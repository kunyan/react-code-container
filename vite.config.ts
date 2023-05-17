import { PluginOption, defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import fs from 'node:fs/promises';
import path from 'node:path';
import url from 'node:url';
import { createRequire } from 'node:module';
import dts from 'vite-plugin-dts';

const WRONG_CODE = `import { bpfrpt_proptype_WindowScroller } from "../WindowScroller.js";`;

function reactVirtualized(): PluginOption {
  return {
    name: 'flat:react-virtualized',
    // Note: we cannot use the `transform` hook here
    //       because libraries are pre-bundled in vite directly,
    //       plugins aren't able to hack that step currently.
    //       so instead we manually edit the file in node_modules.
    //       all we need is to find the timing before pre-bundling.
    configResolved: async () => {
      const require = createRequire(import.meta.url);
      const reactVirtualizedPath = require.resolve('react-virtualized');
      const { pathname: reactVirtualizedFilePath } = new url.URL(
        reactVirtualizedPath,
        import.meta.url
      );
      const file = reactVirtualizedFilePath.replace(
        path.join('dist', 'commonjs', 'index.js'),
        path.join('dist', 'es', 'WindowScroller', 'utils', 'onScroll.js')
      );
      const code = await fs.readFile(file, 'utf-8');
      const modified = code.replace(WRONG_CODE, '');
      await fs.writeFile(file, modified);
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    reactVirtualized(),
    dts({
      insertTypesEntry: true,
      outputDir: 'dist/types',
    }),
  ],
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: 'src/index.tsx',
      name: 'react-code-container',
      // the proper extensions will be added
      fileName: 'index',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'highlight.js',
        'react-virtualized',
      ],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
        exports: 'named',
        assetFileNames: ({ name }) => {
          if (/\.css$/.test(name ?? '')) {
            return 'styles/base.css';
          }

          // default value
          // ref: https://rollupjs.org/guide/en/#outputassetfilenames
          return '[name][extname]';
        },
      },
    },
  },
});
