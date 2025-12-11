import { PluginOption } from "vite";
import type {
	PlainObject
} from './types.js';

/**
 * Functions
 */
export function fixSpritemapPathPlugin(): PluginOption[] {
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

// Allow deep merging of objects
export function deepMerge<T extends PlainObject>(target: T, ...sources: PlainObject[]): T {
	if (!sources.length) return target;
	const source = sources.shift() as PlainObject;

	if (isObject(target) && isObject(source)) {
		for (const key in source) {
			if (isObject(source[key])) {
				if (!target[key]) Object.assign(target, { [key]: {} });
				deepMerge(target[key] as PlainObject, source[key] as PlainObject);
			} else {
				Object.assign(target, { [key]: source[key] });
			}
		}
	}

	return deepMerge(target, ...sources);
}

// Detect if a variable is an object
export function isObject(item: any): item is PlainObject {
	return (item && typeof item === 'object' && !Array.isArray(item));
}
