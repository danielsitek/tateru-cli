import meow from 'meow';

const message: string = `
Usage:
\tnpx tateru-cli [CONFIG FILE] [OPTIONS] [ARGS]

Options:
\t--env     \tSet build environment - dev or prod. Default is dev.
\t--page, -p\tBuild only single page from config.
\t--help    \tDisplay help and usage details
`

const CliService = () => meow(message, {
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
            default: 'cs',
            alias: 'l',
            description: 'Select language subset to build.'
        }
    }
})

export default CliService
