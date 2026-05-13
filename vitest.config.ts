// import { defineConfig }
//   from 'vitest/config';

// export default defineConfig({
//   test: {
//     globals: true,

//     environment: 'node',
//   },
// });

import { defineConfig }
  from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,

    environment: 'node',

    setupFiles: [
      './src/tests/setup.ts',
    ],
  },

  resolve: {
    alias: {
      '@': '/src',
    },
  },
});