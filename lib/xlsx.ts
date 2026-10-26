import { deflateRawSync } from "node:zlib";

/**
 * Minimal XLSX writer.
 *
 * An XLSX file is a ZIP archive containing a handful of XML documents. The data
 * volumes of this project are small (a few hundred registrations), so writing
 * the package ourselves avoids pulling in a large spreadsheet dependency.
 * Strings are stored as inline strings, which keeps the document self-contained
 * and preserves text exactly as it comes from the database.
 */

export type XlsxCell = string | number | boolean | null | undefined;

export type XlsxColumn = {
  header: string;
  /** Column width in characters. Computed from the content when omitted. */
  width?: number;
};

export type XlsxSheet = {
  name: string;
  columns: XlsxColumn[];
  rows: XlsxCell[][];
};

const XML_HEADER = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
const SPREADSHEET_NS =
  "http://schemas.openxmlformats.org/spreadsheetml/2006/main";
const RELATIONSHIP_NS =
  "http://schemas.openxmlformats.org/officeDocument/2006/relationships";

function escapeXml(value: string): string {
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Converts a 1-based column index into its Excel letter (1 -> A, 27 -> AA). */
function columnLetter(index: number): string {
  let letter = "";
  let remaining = index;
  while (remaining > 0) {
    const offset = (remaining - 1) % 26;
    letter = String.fromCharCode(65 + offset) + letter;
    remaining = Math.floor((remaining - 1) / 26);
  }
  return letter;
}

function sheetName(name: string): string {
  // Excel rejects these characters and names longer than 31 characters.
  return name.replace(/[[\]:*?/\\]/g, " ").slice(0, 31) || "Sheet";
}

function columnWidth(column: XlsxColumn, rows: XlsxCell[][], index: number): number {
  if (column.width) return column.width;

  let longest = column.header.length;
  for (const row of rows) {
    const value = row[index];
    if (value === null || value === undefined) continue;
    longest = Math.max(longest, String(value).length);
  }
  // Keep a little breathing room and avoid absurd widths for long notes.
  return Math.min(60, Math.max(10, longest + 2));
}

function cellXml(reference: string, value: XlsxCell, styleId = 0): string {
  const style = styleId ? ` s="${styleId}"` : "";

  if (value === null || value === undefined) {
    return `<c r="${reference}"${style}/>`;
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    return `<c r="${reference}"${style}><v>${value}</v></c>`;
  }
  if (typeof value === "boolean") {
    return `<c r="${reference}"${style} t="b"><v>${value ? 1 : 0}</v></c>`;
  }
  return `<c r="${reference}"${style} t="inlineStr"><is><t xml:space="preserve">${escapeXml(
    String(value)
  )}</t></is></c>`;
}

function worksheetXml(sheet: XlsxSheet): string {
  const { columns, rows } = sheet;
  const lastColumn = columnLetter(Math.max(columns.length, 1));
  const lastRow = rows.length + 1; // header row

  const cols = columns
    .map((column, index) => {
      const number = index + 1;
      return `<col min="${number}" max="${number}" width="${columnWidth(
        column,
        rows,
        index
      )}" customWidth="1"/>`;
    })
    .join("");

  const headerRow = `<row r="1">${columns
    .map((column, index) =>
      cellXml(`${columnLetter(index + 1)}1`, column.header, 1)
    )
    .join("")}</row>`;

  const dataRows = rows
    .map((row, rowIndex) => {
      const number = rowIndex + 2;
      const cells = columns
        .map((_, columnIndex) =>
          cellXml(
            `${columnLetter(columnIndex + 1)}${number}`,
            row[columnIndex]
          )
        )
        .join("");
      return `<row r="${number}">${cells}</row>`;
    })
    .join("");

  const autoFilter =
    rows.length > 0 ? `<autoFilter ref="A1:${lastColumn}${lastRow}"/>` : "";

  return (
    `${XML_HEADER}<worksheet xmlns="${SPREADSHEET_NS}" xmlns:r="${RELATIONSHIP_NS}">` +
    `<dimension ref="A1:${lastColumn}${lastRow}"/>` +
    `<sheetViews><sheetView workbookViewId="0">` +
    `<pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/>` +
    `</sheetView></sheetViews>` +
    `<sheetFormatPr defaultRowHeight="15"/>` +
    `<cols>${cols}</cols>` +
    `<sheetData>${headerRow}${dataRows}</sheetData>` +
    autoFilter +
    `</worksheet>`
  );
}

const STYLES_XML =
  `${XML_HEADER}<styleSheet xmlns="${SPREADSHEET_NS}">` +
  `<fonts count="2">` +
  `<font><sz val="11"/><name val="Calibri"/><family val="2"/></font>` +
  `<font><b/><sz val="11"/><name val="Calibri"/><family val="2"/></font>` +
  `</fonts>` +
  `<fills count="3">` +
  `<fill><patternFill patternType="none"/></fill>` +
  `<fill><patternFill patternType="gray125"/></fill>` +
  `<fill><patternFill patternType="solid"><fgColor rgb="FFE7F4EC"/><bgColor indexed="64"/></patternFill></fill>` +
  `</fills>` +
  `<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>` +
  `<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>` +
  `<cellXfs count="2">` +
  `<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>` +
  `<xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1"><alignment vertical="center" wrapText="1"/></xf>` +
  `</cellXfs>` +
  `<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>` +
  `</styleSheet>`;

/* -------------------------------------------------------------------------- */
/* ZIP archive                                                                */
/* -------------------------------------------------------------------------- */

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let index = 0; index < 256; index += 1) {
    let value = index;
    for (let bit = 0; bit < 8; bit += 1) {
      value =
        value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
    }
    table[index] = value >>> 0;
  }
  return table;
})();

function crc32(buffer: Buffer): number {
  let crc = 0xffffffff;
  for (let index = 0; index < buffer.length; index += 1) {
    crc = CRC_TABLE[(crc ^ buffer[index]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

type ZipEntry = { name: string; data: Buffer };

function zip(entries: ZipEntry[]): Buffer {
  const now = new Date();
  const dosTime =
    (now.getHours() << 11) |
    (now.getMinutes() << 5) |
    Math.floor(now.getSeconds() / 2);
  const dosDate =
    ((Math.max(now.getFullYear(), 1980) - 1980) << 9) |
    ((now.getMonth() + 1) << 5) |
    now.getDate();

  const localParts: Buffer[] = [];
  const centralParts: Buffer[] = [];
  let offset = 0;

  for (const entry of entries) {
    const name = Buffer.from(entry.name, "utf8");
    const compressed = deflateRawSync(entry.data);
    const checksum = crc32(entry.data);

    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0); // local file header signature
    local.writeUInt16LE(20, 4); // version needed to extract
    local.writeUInt16LE(0x0800, 6); // UTF-8 file names
    local.writeUInt16LE(8, 8); // deflate
    local.writeUInt16LE(dosTime, 10);
    local.writeUInt16LE(dosDate, 12);
    local.writeUInt32LE(checksum, 14);
    local.writeUInt32LE(compressed.length, 18);
    local.writeUInt32LE(entry.data.length, 22);
    local.writeUInt16LE(name.length, 26);
    local.writeUInt16LE(0, 28);
    localParts.push(local, name, compressed);

    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0); // central directory signature
    central.writeUInt16LE(20, 4); // version made by
    central.writeUInt16LE(20, 6); // version needed to extract
    central.writeUInt16LE(0x0800, 8); // UTF-8 file names
    central.writeUInt16LE(8, 10); // deflate
    central.writeUInt16LE(dosTime, 12);
    central.writeUInt16LE(dosDate, 14);
    central.writeUInt32LE(checksum, 16);
    central.writeUInt32LE(compressed.length, 20);
    central.writeUInt32LE(entry.data.length, 24);
    central.writeUInt16LE(name.length, 28);
    central.writeUInt16LE(0, 30); // extra field length
    central.writeUInt16LE(0, 32); // comment length
    central.writeUInt16LE(0, 34); // disk number
    central.writeUInt16LE(0, 36); // internal attributes
    central.writeUInt32LE(0, 38); // external attributes
    central.writeUInt32LE(offset, 42);
    centralParts.push(central, name);

    offset += local.length + name.length + compressed.length;
  }

  const centralDirectory = Buffer.concat(centralParts);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0); // end of central directory signature
  end.writeUInt16LE(0, 4); // disk number
  end.writeUInt16LE(0, 6); // disk with central directory
  end.writeUInt16LE(entries.length, 8);
  end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(centralDirectory.length, 12);
  end.writeUInt32LE(offset, 16);
  end.writeUInt16LE(0, 20); // comment length

  return Buffer.concat([...localParts, centralDirectory, end]);
}

/* -------------------------------------------------------------------------- */
/* Workbook                                                                   */
/* -------------------------------------------------------------------------- */

export function buildXlsx(sheets: XlsxSheet[]): Buffer {
  if (sheets.length === 0) {
    throw new Error("A workbook needs at least one sheet.");
  }

  const entries: ZipEntry[] = [];

  const contentTypes =
    `${XML_HEADER}<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">` +
    `<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>` +
    `<Default Extension="xml" ContentType="application/xml"/>` +
    `<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>` +
    `<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>` +
    sheets
      .map(
        (_, index) =>
          `<Override PartName="/xl/worksheets/sheet${index + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`
      )
      .join("") +
    `</Types>`;

  const rootRels =
    `${XML_HEADER}<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">` +
    `<Relationship Id="rId1" Type="${RELATIONSHIP_NS}/officeDocument" Target="xl/workbook.xml"/>` +
    `</Relationships>`;

  const workbook =
    `${XML_HEADER}<workbook xmlns="${SPREADSHEET_NS}" xmlns:r="${RELATIONSHIP_NS}">` +
    `<bookViews><workbookView activeTab="0"/></bookViews>` +
    `<sheets>` +
    sheets
      .map(
        (sheet, index) =>
          `<sheet name="${escapeXml(
            sheetName(sheet.name)
          )}" sheetId="${index + 1}" r:id="rId${index + 1}"/>`
      )
      .join("") +
    `</sheets></workbook>`;

  const workbookRels =
    `${XML_HEADER}<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">` +
    sheets
      .map(
        (_, index) =>
          `<Relationship Id="rId${index + 1}" Type="${RELATIONSHIP_NS}/worksheet" Target="worksheets/sheet${index + 1}.xml"/>`
      )
      .join("") +
    `<Relationship Id="rId${sheets.length + 1}" Type="${RELATIONSHIP_NS}/styles" Target="styles.xml"/>` +
    `</Relationships>`;

  entries.push({ name: "[Content_Types].xml", data: Buffer.from(contentTypes) });
  entries.push({ name: "_rels/.rels", data: Buffer.from(rootRels) });
  entries.push({ name: "xl/workbook.xml", data: Buffer.from(workbook) });
  entries.push({
    name: "xl/_rels/workbook.xml.rels",
    data: Buffer.from(workbookRels),
  });
  entries.push({ name: "xl/styles.xml", data: Buffer.from(STYLES_XML) });
  sheets.forEach((sheet, index) => {
    entries.push({
      name: `xl/worksheets/sheet${index + 1}.xml`,
      data: Buffer.from(worksheetXml(sheet)),
    });
  });

  return zip(entries);
}
