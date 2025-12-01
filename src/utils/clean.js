import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { existsSync, rmSync } from "fs";

const nativeConsole = console;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function removeDir(dir) {
  const fullPath = join(__dirname, "..", dir);
  if (existsSync(fullPath)) {
    rmSync(fullPath, { recursive: true, force: true });
    nativeConsole.log(`✓ Removed: ${dir}`);
  } else {
    nativeConsole.log(`- Not found: ${dir}`);
  }
}

nativeConsole.log("🧹 Cleaning build directories...");
removeDir("dist");
removeDir("node_modules/.vite");
nativeConsole.log("✅ Clean completed!");
