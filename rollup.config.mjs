import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import { defineConfig } from 'rollup';

export default defineConfig({
    input: 'src/index.ts',
    output: { dir: 'dist', format: 'es' },
    plugins: [commonjs(), nodeResolve(), typescript(), terser()],
    external: ['react', 'react-dom', '@twurple/api', '@twurple/auth'],
});
