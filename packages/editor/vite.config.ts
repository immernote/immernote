import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import path from "path";
import typescript from "@rollup/plugin-typescript";

export default defineConfig({
	plugins: [solidPlugin()],
	build: {
		target: "esnext",
		polyfillDynamicImport: false,
		lib: {
			entry: path.resolve(__dirname, "src/index.ts"),
			name: "ProsemirrorSolid",
			fileName: (format) => `prosemirror-solid.${format}.js`,
		},
		rollupOptions: {
			// make sure to externalize deps that shouldn't be bundled
			// into your library
			external: ["solid-js", "solid-js/web", "solid-js/store"],
			plugins: [
				typescript({
					typescript: require("typescript"),
					tsconfig: "tsconfig.build.json",
				}),
			],
		},
	},
});
