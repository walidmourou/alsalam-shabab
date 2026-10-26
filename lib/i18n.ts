export type Locale = "de" | "ar";

export const locales: Locale[] = ["de", "ar"];
export const defaultLocale: Locale = "de";

export function isLocale(value: string | undefined): value is Locale {
  return value === "de" || value === "ar";
}

export const dirOf: Record<Locale, "ltr" | "rtl"> = {
  de: "ltr",
  ar: "rtl",
};

/** Name of the association, shown in the header and footer. */
export const organisation = {
  de: {
    full: "Gemeinnütziger Verein Al-Salam in Lörrach",
    short: "Al-Salam Lörrach",
    city: "Lörrach, Deutschland",
  },
  ar: {
    full: "جمعية السلام الخيرية بلوراخ",
    short: "جمعية السلام – لوراخ",
    city: "لوراخ، ألمانيا",
  },
} as const;

/** Codes returned by the server-side validation, mapped to messages below. */
export type ErrorCode =
  | "required"
  | "tooShort"
  | "tooLong"
  | "email"
  | "dateInvalid"
  | "dateFuture"
  | "genderInvalid"
  | "minOneChild"
  | "tooManyChildren"
  | "consentRequired"
  | "serverError";

const de = {
  meta: {
    title: "Jugendkurs Glaubensbildung – Anmeldung | Al-Salam Lörrach",
    description:
      "Anmeldung zum Jugendkurs für Glaubensbildung des gemeinnützigen Vereins Al-Salam in Lörrach. Kinder und Jugendliche anmelden – einfach online.",
  },
  a11y: {
    skipToContent: "Zum Inhalt springen",
    switchLanguage: "Sprache wechseln",
  },
  nav: {
    home: "Startseite",
    course: "Der Kurs",
    register: "Anmeldung",
    admin: "Verwaltung",
  },
  hero: {
    badge: "Jugendkurs 2026",
    title: "Jugendkurs für Glaubensbildung",
    subtitle:
      "Wir laden Kinder und Jugendliche aus Lörrach und Umgebung herzlich ein, am Jugendkurs unseres Vereins teilzunehmen. Vermittelt werden Grundlagen des Glaubens, gutes Benehmen und Gemeinschaft – in arabischer und deutscher Sprache.",
    cta: "Jetzt anmelden",
    ctaSecondary: "Vorstellungsvideo ansehen",
  },
  video: {
    title: "Schau dir zuerst unser Vorstellungsvideo an",
    subtitle:
      "Im kurzen Video stellt der Verein den Jugendkurs vor: Ziele, Inhalte und Ablauf. Bitte schaue es dir an, bevor du dein Kind anmeldest.",
    note: "Das Video wird erst nach dem Anklicken des Abspielknopfs geladen.",
    posterAlt: "Vorschaubild des Vorstellungsvideos",
    unsupported: "Dein Browser kann dieses Video leider nicht abspielen.",
  },
  about: {
    title: "Was erwartet die Kinder?",
    subtitle:
      "Der Kurs verbindet religiöses Grundwissen mit Werten, Gemeinschaft und Freude am Lernen.",
    items: [
      {
        title: "Glaubensgrundlagen",
        text: "Altersgerechte Vermittlung der Grundlagen des Glaubens und der religiösen Praxis.",
      },
      {
        title: "Werte & Charakter",
        text: "Respekt, Ehrlichkeit, Verantwortung und gutes Benehmen im Alltag.",
      },
      {
        title: "Arabische Sprache",
        text: "Lesen und Verstehen der arabischen Sprache, passend zum jeweiligen Alter.",
      },
      {
        title: "Gemeinschaft",
        text: "Gruppenspiele, Ausflüge und Aktivitäten, die den Zusammenhalt stärken.",
      },
    ],
  },
  facts: {
    title: "Auf einen Blick",
    items: [
      { label: "Ort", value: "Lörrach und Umgebung" },
      { label: "Zielgruppe", value: "Kinder und Jugendliche" },
      { label: "Sprachen", value: "Arabisch und Deutsch" },
      { label: "Träger", value: "Gemeinnütziger Verein Al-Salam in Lörrach" },
    ],
  },
  commitment: {
    title: "Teilnahme und Verbindlichkeit",
    text: "Die Plätze sind begrenzt. Mit der Anmeldung bestätigen die Eltern, dass ihr Kind regelmässig und pünktlich am Kurs teilnimmt. Eine frühzeitige Abmeldung bei Verhinderung hilft uns bei der Planung.",
  },
  register: {
    title: "Anmeldung zum Jugendkurs",
    subtitle:
      "Bitte fülle alle Felder aus. Du kannst mehrere Kinder in einer Anmeldung erfassen.",
    sectionParent: "Angaben zur erziehungsberechtigten Person",
    sectionAddress: "Adresse",
    sectionChildren: "Kinder, die teilnehmen",
    sectionConsent: "Zustimmung und Verpflichtung",
    fields: {
      parentName: "Vor- und Nachname",
      parentNamePh: "z. B. Ahmad Mustafa",
      address: "Strasse und Hausnummer",
      addressPh: "z. B. Hauptstrasse 12",
      postalCode: "Postleitzahl",
      postalCodePh: "79539",
      city: "Ort",
      cityPh: "Lörrach",
      phone: "Telefonnummer",
      phonePh: "+49 176 12345678",
      email: "E-Mail-Adresse",
      emailPh: "name@beispiel.de",
      notes: "Bemerkungen (optional)",
      notesPh: "Allergien, besondere Bedürfnisse usw.",
      childName: "Name des Kindes",
      childNamePh: "Vor- und Nachname",
      birthDate: "Geburtsdatum",
      gender: "Geschlecht",
      genderMale: "Junge",
      genderFemale: "Mädchen",
    },
    addChild: "Weiteres Kind hinzufügen",
    removeChild: "Entfernen",
    childNumber: "Kind",
    consentRegulations:
      "Ich habe die Vereinssatzung und die Teilnahmebedingungen gelesen und akzeptiere sie.",
    consentAttendance:
      "Ich verpflichte mich, dass mein Kind bzw. meine Kinder regelmässig und pünktlich am Jugendkurs teilnehmen.",
    privacy:
      "Die angegebenen Daten werden ausschliesslich zur Organisation des Jugendkurses verwendet.",
    submit: "Anmeldung abschicken",
    submitting: "Wird gesendet …",
    videoHint:
      "Du kennst den Kurs noch nicht? Schau dir zuerst unser Vorstellungsvideo an.",
    videoLink: "Zum Video",
    success: {
      title: "Vielen Dank für die Anmeldung!",
      message:
        "Wir haben deine Anmeldung erhalten und melden uns in Kürze mit den weiteren Informationen.",
      again: "Weitere Anmeldung erfassen",
    },
    errors: {
      required: "Dieses Feld ist erforderlich.",
      tooShort: "Bitte gib mindestens 2 Zeichen ein.",
      tooLong: "Dieser Eintrag ist zu lang.",
      email: "Bitte gib eine gültige E-Mail-Adresse ein.",
      dateInvalid: "Bitte gib ein gültiges Datum ein.",
      dateFuture: "Das Geburtsdatum kann nicht in der Zukunft liegen.",
      genderInvalid: "Bitte wähle ein Geschlecht aus.",
      minOneChild: "Bitte gib mindestens ein Kind an.",
      tooManyChildren: "Es können höchstens 6 Kinder angemeldet werden.",
      consentRequired: "Bitte bestätige diesen Punkt.",
      serverError:
        "Die Anmeldung konnte nicht gespeichert werden. Bitte versuche es später noch einmal.",
    },
  },
  footer: {
    about:
      "Gemeinnütziger Verein Al-Salam in Lörrach – engagiert für Bildung, Gemeinschaft und das Wohl der Kinder und Jugendlichen.",
    contactTitle: "Kontakt",
    contactText:
      "Fragen zur Anmeldung? Nutze das Anmeldeformular oder wende dich direkt an die Kursleitung.",
    linksTitle: "Links",
    rights: "Alle Rechte vorbehalten.",
  },
  admin: {
    loginTitle: "Verwaltung – Anmeldung",
    loginSubtitle: "Bitte melde dich an, um die eingegangenen Anmeldungen zu sehen.",
    username: "Benutzername",
    password: "Passwort",
    login: "Anmelden",
    loggingIn: "Wird angemeldet …",
    invalidCredentials: "Benutzername oder Passwort ist falsch.",
    logout: "Abmelden",
    title: "Eingegangene Anmeldungen",
    subtitle: "Übersicht aller Anmeldungen für den Jugendkurs.",
    stats: {
      registrations: "Anmeldungen",
      children: "Kinder",
      boys: "Jungen",
      girls: "Mädchen",
    },
    table: {
      parent: "Erziehungsberechtigte/r",
      contact: "Kontakt",
      address: "Adresse",
      children: "Kinder",
      consent: "Bestätigungen",
      submitted: "Eingegangen",
      notes: "Bemerkungen",
      empty: "Bisher sind keine Anmeldungen eingegangen.",
      yes: "Akzeptiert",
      no: "Nicht akzeptiert",
      regulations: "Teilnahmebedingungen",
      attendance: "Anwesenheitspflicht",
      years: "Jahre",
      childFallback: "Kind",
    },
    refresh: "Aktualisieren",
    export: "Excel herunterladen",
    exportSheetRegistrations: "Anmeldungen",
    exportColumns: {
      id: "ID",
      parentName: "Erziehungsberechtigte/r",
      email: "E-Mail",
      phone: "Telefon",
      address: "Strasse",
      postalCode: "PLZ",
      city: "Ort",
      children: "Anzahl Kinder",
      regulations: "Teilnahmebedingungen",
      attendance: "Anwesenheitspflicht",
      locale: "Sprache",
      notes: "Bemerkungen",
      submittedAt: "Eingegangen am",
      childName: "Name des Kindes",
      birthDate: "Geburtsdatum",
      age: "Alter",
      gender: "Geschlecht",
      yes: "Ja",
      no: "Nein",
    },
    backToSite: "Zur Website",
    loadError:
      "Die Anmeldungen konnten nicht geladen werden. Bitte prüfe die Datenbankverbindung und versuche es erneut.",
  },
};

export type Dictionary = typeof de;

const ar: Dictionary = {
  meta: {
    title: "دورة الشباب للتربية الإيمانية – التسجيل | جمعية السلام بلوراخ",
    description:
      "التسجيل في دورة الشباب للتربية الإيمانية التابعة لجمعية السلام الخيرية في لوراخ. سجّل أطفالك عبر الإنترنت بسهولة.",
  },
  a11y: {
    skipToContent: "الانتقال إلى المحتوى",
    switchLanguage: "تغيير اللغة",
  },
  nav: {
    home: "الرئيسية",
    course: "عن الدورة",
    register: "التسجيل",
    admin: "الإدارة",
  },
  hero: {
    badge: "دورة الشباب 2026",
    title: "دورة الشباب للتربية الإيمانية",
    subtitle:
      "ندعو أبناءنا وبناتنا من الأطفال واليافعين في لوراخ وضواحيها للمشاركة في دورة الشباب التي تنظمها جمعيتنا. تُقدَّم فيها أساسيات الإيمان والسلوك الحسن وروح الجماعة، باللغة العربية والألمانية.",
    cta: "سجّل الآن",
    ctaSecondary: "شاهد فيديو التعريف",
  },
  video: {
    title: "شاهد أولاً فيديو التعريف بالدورة",
    subtitle:
      "يقدّم الفيديو القصير تعريفًا بالدورة: أهدافها ومحتواها وطريقة سيرها. نرجو مشاهدته قبل تسجيل ابنك أو ابنتك.",
    note: "لا يبدأ الفيديو بالتحميل إلا بعد الضغط على زر التشغيل.",
    posterAlt: "صورة معاينة لفيديو التعريف",
    unsupported: "عذرًا، متصفحك لا يدعم تشغيل هذا الفيديو.",
  },
  about: {
    title: "ماذا ينتظر الأطفال في الدورة؟",
    subtitle: "تجمع الدورة بين المعرفة الدينية الأساسية والقيم وروح الجماعة ومتعة التعلّم.",
    items: [
      {
        title: "أساسيات الإيمان",
        text: "تعليم أساسيات الإيمان والممارسة الدينية بما يناسب كل فئة عمرية.",
      },
      {
        title: "القيم والأخلاق",
        text: "الاحترام والصدق والمسؤولية والسلوك الحسن في الحياة اليومية.",
      },
      {
        title: "اللغة العربية",
        text: "تعلّم قراءة اللغة العربية وفهمها بما يتناسب مع عمر الطفل.",
      },
      {
        title: "روح الجماعة",
        text: "أنشطة جماعية ورحلات وفعّاليات تقوّي الترابط بين المشاركين.",
      },
    ],
  },
  facts: {
    title: "معلومات سريعة",
    items: [
      { label: "المكان", value: "لوراخ والمنطقة المجاورة" },
      { label: "الفئة المستهدفة", value: "الأطفال واليافعون" },
      { label: "اللغات", value: "العربية والألمانية" },
      { label: "الجهة المنظِّمة", value: "جمعية السلام الخيرية بلوراخ" },
    ],
  },
  commitment: {
    title: "المشاركة والالتزام",
    text: "المقاعد محدودة. بتسجيل ابنك/ابنتك يقرّ الوالدان بأن الطفل سيشارك بانتظام والتزام بالمواعيد. وإبلاغ الجمعية مسبقًا في حال الاعتذار يساعدنا في تنظيم الدورة.",
  },
  register: {
    title: "التسجيل في دورة الشباب",
    subtitle: "يرجى تعبئة جميع الحقول. يمكنك تسجيل أكثر من طفل في نموذج واحد.",
    sectionParent: "بيانات ولي الأمر",
    sectionAddress: "العنوان",
    sectionChildren: "الأطفال المشاركون",
    sectionConsent: "الموافقة والتعهّد",
    fields: {
      parentName: "الاسم الكامل",
      parentNamePh: "مثال: أحمد مصطفى",
      address: "الشارع ورقم المنزل",
      addressPh: "مثال: Hauptstrasse 12",
      postalCode: "الرمز البريدي",
      postalCodePh: "79539",
      city: "المدينة",
      cityPh: "لوراخ",
      phone: "رقم الهاتف",
      phonePh: "+49 176 12345678",
      email: "البريد الإلكتروني",
      emailPh: "name@beispiel.de",
      notes: "ملاحظات (اختياري)",
      notesPh: "الحساسية أو احتياجات خاصة أو غير ذلك",
      childName: "اسم الطفل",
      childNamePh: "الاسم والكنية",
      birthDate: "تاريخ الميلاد",
      gender: "الجنس",
      genderMale: "ذكر",
      genderFemale: "أنثى",
    },
    addChild: "إضافة طفل آخر",
    removeChild: "إزالة",
    childNumber: "الطفل",
    consentRegulations: "أقرّ بأنني قرأت نظام الجمعية وشروط المشاركة وأوافق عليها.",
    consentAttendance:
      "أتعهّد بأن يشارك ابني/ابنتي بانتظام والتزام بالمواعيد في دورة الشباب.",
    privacy: "تُستخدم البيانات المُدخلة حصرًا لتنظيم دورة الشباب.",
    submit: "إرسال التسجيل",
    submitting: "جارٍ الإرسال …",
    videoHint: "لم تتعرّف على الدورة بعد؟ شاهد أولاً فيديو التعريف بها.",
    videoLink: "إلى الفيديو",
    success: {
      title: "شكرًا لك على التسجيل!",
      message: "لقد استلمنا تسجيلك، وسنتواصل معك قريبًا بمزيد من المعلومات.",
      again: "تسجيل طفل آخر",
    },
    errors: {
      required: "هذا الحقل مطلوب.",
      tooShort: "يرجى إدخال حرفين على الأقل.",
      tooLong: "هذا الإدخال طويل جدًا.",
      email: "يرجى إدخال بريد إلكتروني صحيح.",
      dateInvalid: "يرجى إدخال تاريخ صحيح.",
      dateFuture: "لا يمكن أن يكون تاريخ الميلاد في المستقبل.",
      genderInvalid: "يرجى اختيار الجنس.",
      minOneChild: "يرجى إضافة طفل واحد على الأقل.",
      tooManyChildren: "يمكن تسجيل 6 أطفال كحد أقصى.",
      consentRequired: "يرجى تأكيد هذا البند.",
      serverError: "تعذّر حفظ التسجيل. يرجى المحاولة لاحقًا.",
    },
  },
  footer: {
    about:
      "جمعية السلام الخيرية بلوراخ – نعمل من أجل التعليم والترابط الاجتماعي وخدمة الأطفال واليافعين.",
    contactTitle: "التواصل",
    contactText: "لأي استفسار حول التسجيل، استخدم نموذج التسجيل أو تواصل مباشرة مع إدارة الدورة.",
    linksTitle: "روابط",
    rights: "جميع الحقوق محفوظة.",
  },
  admin: {
    loginTitle: "لوحة الإدارة – الدخول",
    loginSubtitle: "يرجى تسجيل الدخول لعرض طلبات التسجيل المستلمة.",
    username: "اسم المستخدم",
    password: "كلمة المرور",
    login: "تسجيل الدخول",
    loggingIn: "جارٍ تسجيل الدخول …",
    invalidCredentials: "اسم المستخدم أو كلمة المرور غير صحيحة.",
    logout: "تسجيل الخروج",
    title: "طلبات التسجيل المستلمة",
    subtitle: "نظرة عامة على جميع التسجيلات في دورة الشباب.",
    stats: {
      registrations: "التسجيلات",
      children: "الأطفال",
      boys: "ذكور",
      girls: "إناث",
    },
    table: {
      parent: "ولي الأمر",
      contact: "بيانات التواصل",
      address: "العنوان",
      children: "الأطفال",
      consent: "التأكيدات",
      submitted: "تاريخ الإرسال",
      notes: "ملاحظات",
      empty: "لم يتم استلام أي تسجيل حتى الآن.",
      yes: "موافَق عليه",
      no: "غير موافَق عليه",
      regulations: "شروط المشاركة",
      attendance: "الالتزام بالحضور",
      years: "سنة",
      childFallback: "طفل",
    },
    refresh: "تحديث",
    export: "تنزيل Excel",
    exportSheetRegistrations: "التسجيلات",
    exportColumns: {
      id: "المعرّف",
      parentName: "ولي الأمر",
      email: "البريد الإلكتروني",
      phone: "الهاتف",
      address: "الشارع",
      postalCode: "الرمز البريدي",
      city: "المدينة",
      children: "عدد الأطفال",
      regulations: "شروط المشاركة",
      attendance: "الالتزام بالحضور",
      locale: "اللغة",
      notes: "ملاحظات",
      submittedAt: "تاريخ الإرسال",
      childName: "اسم الطفل",
      birthDate: "تاريخ الميلاد",
      age: "العمر",
      gender: "الجنس",
      yes: "نعم",
      no: "لا",
    },
    backToSite: "العودة إلى الموقع",
    loadError: "تعذّر تحميل التسجيلات. يرجى التحقق من اتصال قاعدة البيانات والمحاولة مرة أخرى.",
  },
};

const dictionaries: Record<Locale, Dictionary> = { de, ar };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
