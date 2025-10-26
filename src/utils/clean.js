import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, rmSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function removeDir(dir) {
    const fullPath = join(__dirname, '..', dir);
    if (existsSync(fullPath)) {
        rmSync(fullPath, { recursive: true, force: true });
        console.log(`✓ Removed: ${dir}`);
    } else {
        console.log(`- Not found: ${dir}`);
    }
}

console.log('🧹 Cleaning build directories...');
removeDir('dist');
removeDir('node_modules/.vite');
console.log('✅ Clean completed!');