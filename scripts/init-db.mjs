/**
 * Creates the tables used by the youth-course registration site.
 *
 * The application also creates these tables automatically on first use (see
 * `lib/db.ts`), so running this script is optional. It is useful to provision
 * the database up-front or to verify the connection.
 *
 * Usage:  npm run db:init
 *
 * The statements below mirror `lib/db.ts`. All tables are prefixed with `yc_`
 * so they never touch the existing tables of the association's database.
 */
import fs from "node:fs";
import dns from "node:dns";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mysql from "mysql2/promise";

// See the note in `lib/db.ts`: keep the database connection on IPv4 so that a
// single remote-access allow-list entry is sufficient.
if ((process.env.DB_DNS_ORDER ?? "ipv4first") === "ipv4first") {
  dns.setDefaultResultOrder("ipv4first");
}

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function loadEnv() {
  const envPath = path.join(rootDir, ".env");
  if (!fs.existsSync(envPath)) {
    return {};
  }
  const env = {};
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const separator = trimmed.indexOf("=");
    if (separator === -1) continue;
    env[trimmed.slice(0, separator).trim()] = trimmed
      .slice(separator + 1)
      .trim();
  }
  return env;
}

const fileEnv = loadEnv();
const config = {
  host: process.env.DB_HOST ?? fileEnv.DB_HOST,
  port: Number(process.env.DB_PORT ?? fileEnv.DB_PORT ?? 3306),
  user: process.env.DB_USER ?? fileEnv.DB_USER,
  password: process.env.DB_PASSWORD ?? fileEnv.DB_PASSWORD,
  database: process.env.DB_NAME ?? fileEnv.DB_NAME,
};

if (!config.host || !config.user || !config.database) {
  console.error(
    "Missing database configuration. Please set DB_HOST, DB_USER, DB_PASSWORD and DB_NAME in .env."
  );
  process.exit(1);
}

const statements = [
  `CREATE TABLE IF NOT EXISTS yc_registrations (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    parent_name VARCHAR(200) NOT NULL,
    address VARCHAR(255) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    city VARCHAR(120) NOT NULL,
    phone VARCHAR(40) NOT NULL,
    email VARCHAR(190) NOT NULL,
    notes TEXT NULL,
    locale VARCHAR(5) NOT NULL DEFAULT 'de',
    regulations_accepted TINYINT(1) NOT NULL DEFAULT 0,
    attendance_commitment TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_yc_reg_created (created_at)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS yc_children (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    registration_id INT UNSIGNED NOT NULL,
    full_name VARCHAR(200) NOT NULL,
    birth_date DATE NOT NULL,
    gender ENUM('male','female') NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_yc_child_reg (registration_id),
    CONSTRAINT fk_yc_child_registration
      FOREIGN KEY (registration_id) REFERENCES yc_registrations (id)
      ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
];

let connection;
try {
  connection = await mysql.createConnection(config);
} catch (error) {
  console.error(`Could not connect to ${config.database} on ${config.host}:${config.port}.`);
  console.error(`  ${error.code ?? "ERROR"}: ${error.sqlMessage ?? error.message}`);
  if (error.code === "ER_ACCESS_DENIED_ERROR") {
    console.error(
      "  Hint: the remote MySQL server only accepts connections from allow-listed IPs.\n" +
        "  Add this machine's public IP in the hosting panel (Hostinger > Databases > Remote MySQL),\n" +
        `  or set DB_HOST to the server's local address when running from the server itself.`
    );
  }
  process.exit(1);
}

try {
  for (const statement of statements) {
    await connection.query(statement);
  }
  const [tables] = await connection.query(
    "SHOW TABLES LIKE 'yc\\_%'"
  );
  console.log(`Connected to ${config.database} on ${config.host}.`);
  console.log(
    `Project tables ready: ${tables.map((row) => Object.values(row)[0]).join(", ")}`
  );
} finally {
  await connection.end();
}
