import { readFileSync } from "fs";
import path from "path";
import { BuilderOptions, Environment } from '../../types';
import { ENV_DEVELOPMENT, ENV_PRODUCTION } from '../defines';

/**
 * Prints the help message.
 */
function printHelp() {
    console.log(`
Simple CLI static site builder tool with Twig.

Usage:
  npx tateru-cli [CONFIG FILE] [OPTIONS] [ARGS]

Options:
  --env <env>, -e <env>       Set build environment (dev or prod). Default is dev.
  --page <page>, -p <page>    Build only a single page from the config.
  --lang <lang>, -l <lang>    Set a single language to build.
  --help, -h                  Display help and usage details.
  --version, -V               Display Tateru CLI version.
`);
}

/**
 * Parses command-line arguments and returns options.
 * If --help or --version is provided, it prints output and exits the process.
 *
 * @param basePath The base path of the project. Used to locale package.json file.
 */
export function parseCLIArgs(basePath: string): BuilderOptions {
    const args = process.argv.slice(2);
    const options: BuilderOptions = {
        configFile: "tateru.config.json",
        env: ENV_DEVELOPMENT,
    };

    // Get package.json data
    const packageJsonPath = path.resolve(basePath, "package.json");
    const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));;

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];

        switch (arg) {
            case "--help":
            case "-h":
                printHelp();
                process.exit(0);
            case "--version":
            case "-V":
                console.log(packageJson.version);
                process.exit(0);
            case "--env":
            case "-e":
                if (args[i + 1] && !args[i + 1].startsWith("-")) {
                    options.env = args[i + 1] as Environment;
                    i++;
                } else {
                    console.error("Error: Missing value for --env.");
                    process.exit(1);
                }
                break;
            case "--page":
            case "-p":
                if (args[i + 1] && !args[i + 1].startsWith("-")) {
                    options.page = args[i + 1] || "";
                    i++;
                } else {
                    console.error("Error: Missing value for --page.");
                    process.exit(1);
                }
                break;
            case "--lang":
            case "-l":
                if (args[i + 1] && !args[i + 1].startsWith("-")) {
                    options.lang = args[i + 1] || "";
                    i++;
                } else {
                    console.error("Error: Missing value for --lang.");
                    process.exit(1);
                }
                break;
            default:
                if (arg.startsWith("-")) {
                    console.error(`Error: Unknown option "${arg}"\n`);
                    console.log(`Run "npx tateru-cli --help" to see available options.\n`);
                    process.exit(1);
                }
                if (!arg.startsWith("-")) {
                    options.configFile = arg;
                }
                break;
        }
    }

    if (process.env.NODE_ENV) {
        if (process.env.NODE_ENV === 'development') {
            options.env = ENV_DEVELOPMENT;
        }
        if (process.env.NODE_ENV === 'production') {
            options.env = ENV_PRODUCTION;
        }
    }

    return options;
}
