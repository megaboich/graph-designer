module.exports = {
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  extends: ["eslint:recommended", "airbnb-base", "plugin:prettier/recommended"],
  plugins: ["jsdoc"],
  settings: {
    jsdoc: {
      /*
       * Could be "typescript", "closure", "jsdoc" or "permissive" to try to be as accommodating to any of the styles.
       */
      mode: "permissive",
    },
  },
  rules: {
    "import/extensions": "off",
    "import/no-unresolved": "off",
    "import/prefer-default-export": "off",
    "no-plusplus": "off",
    "no-param-reassign": "off",
    "no-restricted-syntax": "off",
    "no-underscore-dangle": ["error", { allow: ["_this"] }],

    "jsdoc/valid-types": 1,
    "jsdoc/check-syntax": 1,
    "jsdoc/require-param-type": 1,
    "jsdoc/require-property-type": 1,
    "jsdoc/require-returns-type": 1,
  },
  env: {
    browser: true,
    es6: true,
  },
  ignorePatterns: ["**/lib/*.js"],
};
