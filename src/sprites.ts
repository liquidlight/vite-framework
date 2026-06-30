import { PluginOption } from "vite";
import VitePluginSvgSpritemap from '@spiriit/vite-plugin-svg-spritemap';
import { getSites } from './utils.js';

const BODY_SIZE = 16;

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
	...getSites().flatMap(site =>
		VitePluginSvgSpritemap(`./app/sites/${site}/Resources/Private/Sprite/*.svg`, {
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
						const valueInEm = (p1 / BODY_SIZE).toFixed(2);
						return `${match.split(':')[0]}: ${valueInEm}em`;
					});
					return content;
				},
			},
		})
	),
	...fixSpritemapPathPlugin(),
];
