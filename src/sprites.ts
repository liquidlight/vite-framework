import { existsSync, readdirSync } from 'node:fs';
import { PluginOption } from "vite";
import VitePluginSvgSpritemap from '@spiriit/vite-plugin-svg-spritemap';
import { getSites } from './utils.js';

const BODY_SIZE = 16;

const spriteDirectory = (site: string): string => `./app/sites/${site}/Resources/Public/Svg`;

// Only sites with SVGs get a spritemap - otherwise the plugin warns and emits an empty sprite
function hasSprites(site: string): boolean {
	const directory = spriteDirectory(site);

	return existsSync(directory) && readdirSync(directory).some(file => file.endsWith('.svg'));
}

function fixSpritemapPathPlugin(): PluginOption[] {
	return [{
		name: 'fix-spritemap-path',
		apply: 'build',
		enforce: 'post',
		generateBundle(_, bundle) {
			const spritemapRegex = /url\((["']?)\/assets\/spritemap([^"')]+)\1\)/g;

			for (const asset of Object.values(bundle)) {
				if (asset.type !== 'asset' || !asset.fileName.endsWith('.css') || typeof asset.source !== 'string') {
					continue;
				}

				asset.source = asset.source.replace(spritemapRegex, 'url($1spritemap$2$1)');
			}
		},
	}]
}

export { fixSpritemapPathPlugin };

export const spritemaps = [
	...getSites().filter(hasSprites).flatMap(site =>
		VitePluginSvgSpritemap(`${spriteDirectory(site)}/*.svg`, {
			output: `spritemap-${site}.svg`,
			route: `spritemap-${site}`,
			injectSvgOnDev: true,
			styles: {
				lang: 'scss',
				filename: `./app/sites/${site}/Resources/Private/Css/src/_sprite.scss`,
				include: ['mixin', 'variables'],
				names: {
					mixin: 'viteSprite',
				},
				callback: ({ content }) => {
					content = content.replace(/(?:width|height):\s*(\d+(?:\.\d+)?)px/g, (match, p1) => {
						const valueInEm = (Number(p1) / BODY_SIZE).toFixed(2);
						return `${match.split(':')[0]}: ${valueInEm}em`;
					});
					return content;
				},
			},
		})
	),
	...fixSpritemapPathPlugin(),
];
