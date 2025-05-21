import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true, // gera types `.d.ts`
  clean: true, // limpa a pasta dist antes de buildar
  sourcemap: true, // gera sourcemaps
  minify: false, // opcional, para libs geralmente não é necessário minificar
})
