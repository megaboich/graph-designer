module.exports = {
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  extends: ["eslint:recommended", "airbnb-base", "plugin:prettier/recommended"],
  rules: {
    "import/extensions": "off",
    "import/no-unresolved": "off",
    "import/prefer-default-export": "off",
    "no-plusplus": "off",
    "no-param-reassign": "off",
    "no-restricted-syntax": "off",
  },
  env: {
    browser: true,
    es6: true,
  },
  ignorePatterns: ["**/lib/*.js"],
};
