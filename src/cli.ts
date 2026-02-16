import { Command } from "commander";
import { run } from "./commands/build.ts";
import type { BuildOptions } from "./core/types.ts";

async function main() {
    const program = new Command();

    program
        .name("learn-cli")
        .description("CLI de aprendizado")
        .version("1.0.0");

    program
        .command("build")
        .description("Builda o projeto")
        .option("-c, --config <path>", "Arquivo de configuração")
        .option("-v, --verbose", "Modo verbose", false)
        .action(async (opts: BuildOptions) => {
            const cwd = process.cwd();
            await run(cwd, opts);
        });

    await program.parseAsync(process.argv);
}

main().catch((err: Error) => {
    const message =
        err instanceof Error ? err.message : "Unexpected error";

    console.error(`learn-cli: ${message}`);
    process.exitCode = 1;
});