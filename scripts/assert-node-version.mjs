const minimum = [22, 13, 0];
const current = process.versions.node.split(".").map(Number);

const comparison = current.reduce((result, part, index) => {
  if (result !== 0) return result;
  return part - minimum[index];
}, 0);
const isSupported = comparison >= 0;

if (!isSupported) {
  console.error(
    `Node.js ${process.versions.node} is unsupported. This project requires Node.js >= ${minimum.join(".")}. Run \`nvm use\` or install Node 22 LTS, then retry.`,
  );
  process.exit(1);
}
