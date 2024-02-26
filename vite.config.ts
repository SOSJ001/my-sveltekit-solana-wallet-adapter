import { sveltekit } from '@sveltejs/kit/vite'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import path from 'path';
import nodePolyfills from 'rollup-plugin-node-polyfills';
import inject from '@rollup/plugin-inject';


const config = {
	plugins: [sveltekit()],
	optimizeDeps: {
		include: ['@solana/web3.js', 'buffer'],
		esbuildOptions: {
				target: 'esnext',
				plugins: [NodeGlobalsPolyfillPlugin({ buffer: true })],
		},
	},
	resolve: {
		alias: {
			$utils: path.resolve('src/routes/'),
			stream: 'rollup-plugin-node-polyfills/polyfills/stream',
		},
	},
	define: {
		'process.env.BROWSER': true,
		'process.env.NODE_DEBUG': JSON.stringify(''),
	},
	build: {
		target: 'esnext',
		commonjsOptions: {
			transformMixedEsModules: true
		},
		rollupOptions: {
			plugins: [inject({ Buffer: ['buffer', 'Buffer'] }), nodePolyfills({ crypto: true })],
		},
	}
}

export default config