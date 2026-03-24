import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
  const isLib = mode === 'lib';

  if (isLib) {
    return {
      build: {
        lib: {
          entry: resolve(__dirname, 'src/index.js'),
          name: 'TubePlayer',
          formats: ['es', 'cjs', 'umd'],
          fileName: (format) => `tubeplayer.${format}.js`,
        },
        rollupOptions: {
          external: ['react', 'vue'],
          output: {
            exports: 'named',
            globals: {
              react: 'React',
              vue: 'Vue',
            },
          },
        },
      },
    };
  }

  // 데모 사이트 빌드 설정 (Vercel 배포용)
  return {
    root: 'demo', // demo 폴더를 루트로 설정
    base: './',
    build: {
      outDir: '../dist', // 빌드 결과물을 루트의 dist 폴더로 내보냄
      emptyOutDir: true,
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'demo/index.html'),
        },
      },
    },
    server: {
      open: '/index.html',
    },
  };
});
