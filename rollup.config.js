import typescript from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'src/index.ts',
  output: {
    name: 'super-form-formula',
    format: 'umd',
    file: 'lib/umd/super-form-formula.umd.js',
  },
  plugins: [
    typescript({
      tsconfig: './tsconfig.json',
      tsconfigOverride: {
        compilerOptions: {
          module: 'ESNext',
          declaration: false,
        },
      },
      useTsconfigDeclarationDir: true
    }),
    resolve(),
    commonjs()
  ]
}