
const { execSync } = require('child_process');
try {
    execSync('npx tsc lib/prisma.ts --noEmit --skipLibCheck --target esnext --moduleResolution node --esModuleInterop', { stdio: 'inherit' });
    console.log('Verification passed!');
} catch (e) {
    console.error('Verification failed');
    process.exit(1);
}
