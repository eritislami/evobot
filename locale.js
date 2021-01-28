const i18n = require("i18n");
const path = require("path");

module.exports = {
  initI18n() {
    i18n.configure({
      locales: ["en", "es", "ko", "fr", "tr", "pt_br", "zh_cn", "zh_tw"],
      directory: path.join(__dirname, "locales"),
      defaultLocale: "en",
      objectNotation: true,
      register: global,

      logWarnFn: function (msg) {
        console.log("warn", msg);
      },

      logErrorFn: function (msg) {
        console.log("error", msg);
      },

      missingKeyFn: function (locale, value) {
        return value;
      },

      mustacheConfig: {
        tags: ["{{", "}}"],
        disable: false
      }
    });
  }
};
