import type { UserConfig } from './types.js';

import typo3 from "vite-plugin-typo3";
import path from "node:path";
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
// @ts-ignore postcss-custom-media doesn't provide types
import postcssCustomMedia from 'postcss-custom-media';
// @ts-ignore postcss-sort-media-queries doesn't provide types
import postcssSortMediaQueries from 'postcss-sort-media-queries';

import { spritemaps } from './sprites.js';

export const baseConfig: UserConfig = {
	plugins: [
		typo3(),
		...spritemaps,
	],
	resolve: {
		alias: {
			// Resolve '@' to app/sites
			'@/': path.resolve('app/sites') + '/',
			// Resolve TYPO3 extension imports like "liquidlight/foundation/..." into vendor dir
			liquidlight: path.resolve('vendor/liquidlight'),
		},
	},
	css: {
		preprocessorOptions: {
			scss: {
				loadPaths: [
					// Allow Sass imports from Composer-installed TYPO3 site packages
					path.resolve('vendor'),
					// Allow sass imports accross sites
					path.resolve('.'),
				],
			}
		},
		postcss: {
			plugins: [
				autoprefixer(),
				postcssCustomMedia(),
				postcssSortMediaQueries(),
				cssnano({ preset: 'default' })
			]
		}
	}
}
