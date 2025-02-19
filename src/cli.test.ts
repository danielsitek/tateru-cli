#!/usr/bin/env node

'use strict';

const timeStart = process.hrtime();

import { resolve } from 'path';
import { getProjectDir } from './utils/getProjectDir';
import { loadConfiguration } from './utils/loadConfiguration';
import { core } from './core';
import { printLog } from './utils/printLog';
import { parseCLIArgs } from './app/services/cli';
import { writeFile } from './utils/writeFile';
import { getEndTime } from './utils/getEndTime';
import { formatBuildContent } from './utils/formatBuildContent';
import { minifyBuildContent } from './utils/minifyBuildContent';

let exitCode = 0;

try {
    const { configFile, env, lang, page } = parseCLIArgs(resolve(__dirname, "..",));

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
        formatter: formatBuildContent,
        minify: minifyBuildContent,
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
