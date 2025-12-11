
import type {
	UserConfig
} from './types.js';

import { baseConfig } from './baseConfig.js';
import { deepMerge } from './utils.js';

export default function(
	configOverride: UserConfig = {}
): any {
	return deepMerge({}, baseConfig, configOverride);
}
