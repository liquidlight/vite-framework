import type { UserConfig } from './types.js';

import typo3 from "vite-plugin-typo3";
import path from "node:path";
import { readdirSync, existsSync } from 'node:fs';

// Plugins
import VitePluginSvgSpritemap from '@spiriit/vite-plugin-svg-spritemap'
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
// @ts-ignore postcss-custom-media doesn't provide types
import postcssCustomMedia from 'postcss-custom-media';
// @ts-ignore postcss-sort-media-queries doesn't provide types
import postcssSortMediaQueries from 'postcss-sort-media-queries';

// Functions
import { fixSpritemapPathPlugin } from './utils.js'

const sites = readdirSync('./app/sites')
    .filter(name => existsSync(`./app/sites/${name}/Configuration/ViteEntrypoints.json`));

const spritemaps = sites.flatMap(site =>
    VitePluginSvgSpritemap(`./app/sites/${site}/Resources/Private/Sprite/*.svg`, {
        injectSvgOnDev: true,
    	styles: {
			lang: 'scss',
            filename: `./app/sites/${site}/Resources/Private/Css/src/_sprite.scss`,
            include: ['mixin', 'variables'],
			names: {
				mixin: 'viteSprite',
			},
			callback: ({ content }) => {
				const BODY_SIZE = 16;

				content = content.replace(/(?:width|height):\s*(\d+)px/g, (match, p1) => {
					// Divide the captured number by 16 and format to 2 decimal places
					const valueInEm = (p1 / BODY_SIZE).toFixed(2);

					// Return the new string with 'em'
					return `${match.split(':')[0]}: ${valueInEm}em`;
				});

				return content
			}
        },
    })
);

export const baseConfig: UserConfig = {
	plugins: [
		typo3(),
		...spritemaps,
		fixSpritemapPathPlugin(),
	],
	resolve: {
		alias: {
			// Resolve TYPO3 extension imports like "liquidlight/foundation/..." into vendor dir
			liquidlight: path.resolve('vendor/liquidlight'),
		},
	},
	css: {
		preprocessorOptions: {
			scss: {
				includePaths: [
					// Allow Sass imports from Composer-installed TYPO3 site packages
					path.resolve('vendor'),
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
