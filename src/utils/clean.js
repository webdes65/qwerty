import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { existsSync, rmSync } from "fs";
import logger from "@utils/logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function removeDir(dir) {
  const fullPath = join(__dirname, "..", dir);
  if (existsSync(fullPath)) {
    rmSync(fullPath, { recursive: true, force: true });
    logger.log(`✓ Removed: ${dir}`);
  } else {
    logger.log(`- Not found: ${dir}`);
  }
}

logger.log("🧹 Cleaning build directories...");
removeDir("dist");
removeDir("node_modules/.vite");
logger.log("✅ Clean completed!");
