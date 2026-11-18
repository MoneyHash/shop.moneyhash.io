const path = require('path');

// Vendored assets (e.g. public/monaco) are ignored by ESLint/Prettier. Passing
// them explicitly makes ESLint emit "File ignored" warnings, which fail
// `--max-warnings 0`, so drop them before running any command.
const publicDir = `${path.join(__dirname, 'public')}${path.sep}`;
const withoutPublic = files => files.filter(file => !file.startsWith(publicDir));
const quote = files => files.map(file => `"${file}"`).join(' ');

module.exports = {
  '*.{js,ts,tsx}': stagedFiles => {
    const files = withoutPublic(stagedFiles);
    if (!files.length) return [];
    return [
      `eslint --fix --max-warnings 0 ${quote(files)}`,
      `prettier --write ${quote(files)}`,
      `cross-env CI=true npm run test --if-present -- --findRelatedTests --bail ${quote(files)}`,
    ];
  },
  '*.{html,json,md,mdx,yml,yaml}': stagedFiles => {
    const files = withoutPublic(stagedFiles);
    return files.length ? [`prettier --write ${quote(files)}`] : [];
  },
};
