import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig({
    plugins: [viteSingleFile()],
    build: {
        rollupOptions: {
            external: (id) => id.endsWith('mock-uploads.mjs')
        }
    }
})