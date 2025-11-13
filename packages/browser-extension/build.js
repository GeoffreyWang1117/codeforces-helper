const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

const isWatch = process.argv.includes('--watch');

const buildOptions = {
  entryPoints: {
    background: 'src/background.ts',
    content: 'src/content.ts',
    'popup/popup': 'src/popup/popup.ts',
    'options/options': 'src/options/options.ts',
  },
  bundle: true,
  outdir: 'dist',
  format: 'esm',
  platform: 'browser',
  target: 'es2020',
  sourcemap: true,
};

async function build() {
  try {
    // Clean dist folder
    if (fs.existsSync('dist')) {
      fs.rmSync('dist', { recursive: true });
    }
    fs.mkdirSync('dist', { recursive: true });

    // Build TypeScript files
    if (isWatch) {
      const ctx = await esbuild.context(buildOptions);
      await ctx.watch();
      console.log('Watching for changes...');
    } else {
      await esbuild.build(buildOptions);
      console.log('Build complete');
    }

    // Copy static files
    const staticFiles = ['manifest.json', 'icons', 'popup/popup.html', 'options/options.html', 'content.css'];

    for (const file of staticFiles) {
      const src = path.join(__dirname, file);
      const dest = path.join(__dirname, 'dist', file);

      if (fs.statSync(src).isDirectory()) {
        fs.cpSync(src, dest, { recursive: true });
      } else {
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.copyFileSync(src, dest);
      }
    }

    console.log('Static files copied');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

build();
