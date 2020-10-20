import meow from 'meow';
import { BuilderOptions, Environment } from '../../types';
import { ENV_DEVELOPMENT, ENV_PRODUCTION } from '../defines';

const message: string = `
Usage:
\tnpx tateru-cli [CONFIG FILE] [OPTIONS] [ARGS]

Options:
\t--env     \tSet build environment - dev or prod. Default is dev.
\t--page, -p\tBuild only single page from config.
\t--help    \tDisplay help and usage details
`

const environmentOptions = (options: BuilderOptions): BuilderOptions => {

    if (process.env.NODE_ENV) {
        if (process.env.NODE_ENV === 'development') {
            options.env = ENV_DEVELOPMENT;
        }
        if (process.env.NODE_ENV === 'production') {
            options.env = ENV_PRODUCTION;
        }
    }

    return options
}

const constructOptions = (cli: any): BuilderOptions => {

    const options: BuilderOptions = {
        configFile: cli.input[0] || 'config.json',
        env: cli.flags.env as Environment || ENV_DEVELOPMENT,
        lang: cli.flags.lang,
        page: cli.flags.page,
        flags: cli.flags
    };

    return options
}

export class CliService {

    public static init (): BuilderOptions {

        const cli = meow(message, {
            flags: {
                env: {
                    type: 'string',
                    default: '',
                    alias: 'e',
                    description: 'Set build environment.'
                },
                page: {
                    type: 'string',
                    default: '',
                    alias: 'p',
                    description: 'Build only single page from config.'
                },
                lang: {
                    type: 'string',
                    default: '',
                    alias: 'l',
                    description: 'Select language subset to build.'
                }
            }
        })

        const options = constructOptions(cli)
        return environmentOptions(options)
    }
}

export default CliService
