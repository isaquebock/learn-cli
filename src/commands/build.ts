import { loadConfig } from "../core/config.ts";
import type { BuildOptions } from "../core/types.ts";

export const run = async (cwd: string, options: BuildOptions) => {
    const { config, source, filepath } = await loadConfig(cwd, options.config);

    if (source === "defaults") {
        console.warn("learn-cli: no config found, using defaults", cwd);
    } else {
        console.log(`learn-cli: config loaded from ${filepath}`);
    }
};
