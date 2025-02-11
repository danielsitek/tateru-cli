import { readFileSync } from "fs";
import path from "path";
import { BuilderOptions, Environment } from '../../types';
import { ENV_DEVELOPMENT, ENV_PRODUCTION } from '../defines';

/**
 * Finds the absolute path to package.json.
 */
function getPackageJsonPath(): string {
    return path.resolve(__dirname, "../../..", "package.json");
}

/**
 * Reads and returns the package.json data.
 */
function getPackageJson(): any {
    return JSON.parse(readFileSync(getPackageJsonPath(), "utf-8"));
}

/**
 * Prints the help message.
 */
function printHelp() {
    console.log(`
  Simple CLI static site builder tool with Twig.

  Usage:
    \tnpx tateru-cli [CONFIG FILE] [OPTIONS] [ARGS]

  Options:
    \t--env <env>, -e <env> \t\tSet build environment (dev or prod). Default is dev.
    \t--page <page>, -p <page> \tBuild only a single page from the config.
    \t--lang <lang>, -l <lang> \tSet a single language to build.
    \t--help, -h \t\t\tDisplay help and usage details.
    \t--version, -V \t\t\tDisplay Tateru CLI version.
    `);
}

/**
 * Parses command-line arguments and returns options.
 * If --help or --version is provided, it prints output and exits the process.
 */
export function parseCLIArgs(): BuilderOptions {
    const args = process.argv.slice(2);
    const options: BuilderOptions = {
        configFile: "tateru.config.json",
        env: ENV_DEVELOPMENT,
    };

    // Get package.json data
    const packageJson = getPackageJson();

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
                    printHelp();
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
