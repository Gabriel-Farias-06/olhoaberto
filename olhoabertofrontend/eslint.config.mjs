import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    // This object applies to all files by default,
    // unless overridden by a more specific configuration later in the array.
    rules: {
      // To disable a rule, set its severity to "off"
      "no-console": "off", // Disables the 'no-console' rule for all files

      // To disable a TypeScript-specific rule
      "@typescript-eslint/no-explicit-any": "off", // Disables 'no-explicit-any'
      "@typescript-eslint/no-unused-vars": "off", // Disables 'no-unused-vars'
    },
  },
  // You can add more specific configurations for certain files:
  {
    files: ["src/scripts/**/*.js"], // Applies only to files in src/scripts
    rules: {
      "no-console": "error", // Re-enable no-console as an error for scripts
    },
  },
];

export default eslintConfig;
