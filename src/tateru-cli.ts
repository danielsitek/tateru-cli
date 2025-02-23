#!/usr/bin/env node

const timeStart = process.hrtime();

import { resolve } from 'path';
import { getProjectDir } from './cli/utils/getProjectDir';
import { loadConfiguration } from './cli/utils/loadConfiguration';
import { core } from './core';
import { printLog } from './cli/utils/printLog';
import { parseCLIArgs } from './cli/services/cli';
import { writeFile } from './cli/utils/writeFile';
import { getEndTime } from './cli/utils/getEndTime';
import { formatContents } from './format/formatContents';
import { minifyContents } from './minify/minifyContents';

let exitCode = 0;

try {
    const { configFile, env, lang, page } = parseCLIArgs(
        resolve(__dirname, '..'),
    );

    const processCwd = process.cwd();

    const projectDir = getProjectDir(configFile, processCwd);

    const config = loadConfiguration(configFile, processCwd);

    printLog(`Config file "${configFile}" loaded`);
    printLog(`Environment:\t${env}\n`);

    core({
        config,
        env,
        lang,
        page,
        cwd: projectDir,
        formatter: formatContents,
        minify: minifyContents,
    }).forEach(({ contents, ext, path, cwd }) => {
        writeFile(contents, resolve(cwd, path));

        printLog(`Created:\t${ext}`);
    });
} catch (e) {
    if (e instanceof Error) {
        console.error(e.message);
    } else {
        console.error(e);
    }
    exitCode = 1;
} finally {
    const timeEnd = getEndTime(timeStart);
    printLog(`\nTime:\t\t${timeEnd.s}s ${timeEnd.ms}ms`);
    process.exit(exitCode);
}
