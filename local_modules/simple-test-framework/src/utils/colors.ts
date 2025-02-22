const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    gray: '\x1b[90m',
    reset: '\x1b[0m'
} as const;

export const colorize = {
    green: (text: string) => `${colors.green}${text}${colors.reset}`,
    red: (text: string) => `${colors.red}${text}${colors.reset}`,
    gray: (text: string) => `${colors.gray}${text}${colors.reset}`,
};