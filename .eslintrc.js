module.exports = {
  parser: "@typescript-eslint/parser",
  extends: ["eslint:recommended", "plugin:import/recommended", "plugin:import/typescript", "prettier"],
  plugins: ["@typescript-eslint", "import"],
  overrides: [
    {
      env: { node: true },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: { sourceType: "script" },
    },
    {
      files: ["*.{ts,tsx}"],
      rules: {
        "no-multi-spaces": "warn",
        "no-multiple-empty-lines": "warn",
        "no-unused-vars": "off",
        "no-var": "warn",
        "prefer-const": "warn",
        "space-in-parens": "warn",
        quotes: ["warn", "double"],
        semi: ["error", "always"],
        "@typescript-eslint/no-unused-vars": "warn",
        "@typescript-eslint/consistent-type-imports": ["warn"],
        "import/no-duplicates": ["off"],
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: "tsconfig.json",
  },
  rules: {},
  env: {
    browser: true,
    node: true,
    commonjs: true,
    es2021: true,
  },
};
