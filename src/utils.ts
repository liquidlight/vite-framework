import { readdirSync, existsSync } from 'node:fs';
import type {
	PlainObject
} from './types.js';

// Moved to sprites.ts — re-exported here for backwards compatibility
export { fixSpritemapPathPlugin } from './sprites.js';

export function getSites(): string[] {
	return readdirSync('./app/sites')
		.filter(name => existsSync(`./app/sites/${name}/Configuration/ViteEntrypoints.json`));
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
