// module.exports = {
//     "env": {
//         "browser": true,
//         "es2021": true
//     },
//     "extends": [
//         "eslint:recommended",
//         "plugin:react/recommended"
//     ],
//     "overrides": [
//     ],
//     "parserOptions": {
//         "ecmaVersion": "latest",
//         "sourceType": "module"
//     },
//     "plugins": [
//         "react"
//     ],
//     "rules": {
//         "indent": [
//             "error",
//             4
//         ],
//         "linebreak-style": [
//             "error",
//             "unix"
//         ],
//         "quotes": [
//             "error",
//             "double"
//         ],
//         "semi": [
//             "error",
//             "always"
//         ]
//     }
// };

module.exports = {
  env: { es6: true, browser: true, es2021: true },
  extends: ["eslint:recommended", "plugin:react/recommended"],
  overrides: [],
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  plugins: ["react", "import", "react-hooks"],
  rules: {
    "react/prop-types": "off",
    "react/display-name": "off",
    indent: ["error", 2],
    "linebreak-style": ["error", "unix"],
    quotes: ["error", "double"],
    semi: ["error", "always"],
    "react-hooks/exhaustive-deps": "warn",
    "no-unused-vars": "warn",
    "import/order": [
      "error",
      {
        groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
        "newlines-between": "always",
      },
    ],
  },
};
  