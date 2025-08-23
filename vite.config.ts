/* eslint-disable no-console */
import { resolve } from 'path';
import { BuildOptions, build, defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { viteSingleFile } from 'vite-plugin-singlefile';
import { writeFile } from 'fs/promises';
import mkcert from 'vite-plugin-mkcert';
import tailwindcss from '@tailwindcss/vite';

const PORT = 3000;
const clientRoot = './src/client';
const outDir = './dist';
const serverEntry = 'src/server/index.ts';
const copyAppscriptEntry = './appsscript.json';
const devServerWrapper = './dev/dev-server-wrapper.html';

const clientEntrypoints = [
  {
    name: 'CLIENT - InNoHassle Scheduling Plugin',
    rootDir: 'sidebar',
    template: 'sidebar/index.html',
    output: 'innohassle-sidebar',
  },
];

const clientServeConfig = () =>
  defineConfig({
    plugins: [mkcert(), tailwindcss(), react()],
    server: {
      port: PORT,
    },
    root: clientRoot,
  });

const clientBuildConfig = ({
  clientEntrypointRoot,
  template,
}: {
  clientEntrypointRoot: string;
  template: string;
}) =>
  defineConfig({
    plugins: [
      tailwindcss(),
      react(),
      viteSingleFile({ useRecommendedBuildConfig: true }),
    ],
    root: resolve(__dirname, clientRoot, clientEntrypointRoot),
    build: {
      sourcemap: false,
      write: false, // don't write to disk
      outDir,
      emptyOutDir: true,
      minify: true,
      rollupOptions: {
        external: [
          'react',
          'react-dom',
          'react-transition-group',
          'react-bootstrap',
          '@mui/material',
          '@emotion/react',
          '@emotion/styled',
          'gas-client',
          '@types/react',
        ],
        output: {
          format: 'iife', // needed to use globals from UMD builds
          dir: outDir,
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
            'react-transition-group': 'ReactTransitionGroup',
            'react-bootstrap': 'ReactBootstrap',
            '@mui/material': 'MaterialUI',
            '@emotion/react': 'emotionReact',
            '@emotion/styled': 'emotionStyled',
            'gas-client': 'GASClient',
            '@types/react': '@types/react',
          },
        },
        input: resolve(__dirname, clientRoot, template),
      },
    },
  });

const serverBuildConfig: BuildOptions = {
  emptyOutDir: true,
  minify: false, // needed to work with footer
  lib: {
    entry: resolve(__dirname, serverEntry),
    fileName: 'code',
    name: 'globalThis',
    formats: ['iife'],
  },
  rollupOptions: {
    output: {
      entryFileNames: 'innohassle-code.js',
      extend: true,
      footer: (chunk) =>
        chunk.exports
          .map((exportedFunction) => `function ${exportedFunction}() {};`)
          .join('\n'),
    },
  },
};

const buildConfig = ({ mode }: { mode: string }) => {
  const targets = [{ src: copyAppscriptEntry, dest: './' }];
  if (mode === 'development') {
    targets.push(
      ...clientEntrypoints.map((entrypoint) => ({
        src: devServerWrapper,
        dest: './',
        rename: `${entrypoint.output}.html`,
        transform: (contents: string) =>
          contents
            .toString()
            .replace(/__PORT__/g, String(PORT))
            .replace(/__FILE_NAME__/g, entrypoint.template),
      }))
    );
  }
  return defineConfig({
    plugins: [
      viteStaticCopy({
        targets,
      }),
      /**
       * This builds the client react app bundles for production, and writes them to disk.
       * Because multiple client entrypoints (dialogs) are built, we need to loop through
       * each entrypoint and build the client bundle for each. Vite doesn't have great tooling for
       * building multiple single-page apps in one project, so we have to do this manually with a
       * post-build closeBundle hook (https://rollupjs.org/guide/en/#closebundle).
       */
      mode === 'production' && {
        name: 'build-client-production-bundles',
        closeBundle: async () => {
          console.log('Building client production bundles...');
          // eslint-disable-next-line no-restricted-syntax
          for (const clientEntrypoint of clientEntrypoints) {
            console.log('Building client bundle for', clientEntrypoint.name);
            console.log(clientEntrypoint.template);
            // eslint-disable-next-line no-await-in-loop
            const buildOutput = await build(
              clientBuildConfig({
                clientEntrypointRoot: clientEntrypoint.rootDir,
                template: clientEntrypoint.template,
              })
            );
            // eslint-disable-next-line no-await-in-loop
            await writeFile(
              resolve(__dirname, outDir, `${clientEntrypoint.output}.html`),
              // @ts-expect-error - output is an array of RollupOutput
              buildOutput.output[0].source
            );
          }
          console.log('Finished building client bundles!');
        },
      },
    ].filter(Boolean),
    build: serverBuildConfig,
  });
};

// https://vitejs.dev/config/
export default async ({ command, mode }: { command: string; mode: string }) => {
  if (command === 'serve') {
    // for 'serve' mode, we only want to serve the client bundle locally
    return clientServeConfig();
  }
  if (command === 'build') {
    // for 'build' mode, we have two paths: build assets for local development, and build for production
    return buildConfig({ mode });
  }
  return {};
};
