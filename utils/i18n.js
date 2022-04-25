import i18n from "i18n";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { config } from "./config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

i18n.configure({
  locales: [
    "ar",
    "cs",
    "de",
    "el",
    "en",
    "es",
    "fa",
    "fr",
    "id",
    "it",
    "ja",
    "ko",
    "mi",
    "nl",
    "pl",
    "pt_br",
    "ru",
    "sv",
    "th",
    "tr",
    "uk",
    "vi",
    "zh_cn",
    "zh_sg",
    "zh_tw"
  ],
  directory: join(__dirname, "..", "locales"),
  defaultLocale: "en",
  retryInDefaultLocale: true,
  objectNotation: true,
  register: global,

  logWarnFn: function (msg) {
    console.log(msg);
  },

  logErrorFn: function (msg) {
    console.log(msg);
  },

  missingKeyFn: function (locale, value) {
    return value;
  },

  mustacheConfig: {
    tags: ["{{", "}}"],
    disable: false
  }
});

i18n.setLocale(config.LOCALE);

export { i18n };
