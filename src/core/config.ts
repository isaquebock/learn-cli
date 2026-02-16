import { cosmiconfig } from "cosmiconfig";
import path from "path";

export type LearnCliConfig = {
    srcDir: string;
    outDir: string;
    plugins: unknown[];
};

const DEFAULTS: LearnCliConfig = {
    srcDir: "src",
    outDir: "dist",
    plugins: [],
};

function validateConfig(raw: any): LearnCliConfig {
    if (raw == null || typeof raw !== "object") {
        throw new Error(`Invalid config: expected an object`);
    }
    const srcDir = raw.srcDir ?? DEFAULTS.srcDir;
    const outDir = raw.outDir ?? DEFAULTS.outDir;
    const plugins = raw.plugins ?? DEFAULTS.plugins;

    if (typeof srcDir !== "string") throw new Error(`Invalid config: "srcDir" must be a string`);
    if (typeof outDir !== "string") throw new Error(`Invalid config: "outDir" must be a string`);
    if (!Array.isArray(plugins)) throw new Error(`Invalid config: "plugins" must be an array`);

    return { srcDir, outDir, plugins };
}

export async function loadConfig(
    cwd: string,
    configPath?: string,
): Promise<{
    config: LearnCliConfig;
    source: "explicit" | "discovered" | "defaults";
    filepath?: string;
}> {
    const explorer = cosmiconfig("learn-cli");

    if (configPath) {
        const absolute = path.isAbsolute(configPath)
            ? configPath
            : path.join(cwd, configPath);

        const result = await explorer.load(absolute);
        if (!result) {
            throw new Error(`Config not found: ${configPath}`);
        }
        return { config: validateConfig(result.config), source: "explicit", filepath: result.filepath };
    }

    console.log("searching for config", cwd);
    const result = await explorer.search(cwd);
    console.log("result", result);
    if (result) {
        console.log("config found");
        return { config: validateConfig(result.config), source: "discovered", filepath: result.filepath };
    }

    // fallback
    return { config: DEFAULTS, source: "defaults" };
}