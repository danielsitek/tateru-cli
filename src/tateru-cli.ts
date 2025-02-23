#!/usr/bin/env node

const timeStart = process.hrtime();

import { resolve } from 'path';
import { getProjectDir } from './cli/utils/getProjectDir';
import { readJson } from './utils/readJson';
import { core } from './core';
import { printLog } from './cli/utils/printLog';
import { parseCLIArgs } from './cli/services/cli';
import { writeFile } from './cli/utils/writeFile';
import { getEndTime } from './cli/utils/getEndTime';
import { formatContents } from './format/formatContents';
import { minifyContents } from './minify/minifyContents';
import type { ConfigFile } from '../types';

(async () => {
    let exitCode = 0;

    try {
        const { configFile, env, lang, page } = parseCLIArgs(
            resolve(__dirname, '..'),
        );

        const processCwd = process.cwd();

        const projectDir = getProjectDir(configFile, processCwd);

        const config = await readJson<ConfigFile>(processCwd, configFile);

        printLog(`Config file "${configFile}" loaded`);
        printLog(`Environment:\t${env}\n`);

        const files = await core({
            config,
            env,
            lang,
            page,
            cwd: projectDir,
            formatter: formatContents,
            minify: minifyContents,
        });

        await Promise.all(
            files.map(async ({ contents, ext, path, cwd }) => {
                await writeFile(contents, resolve(cwd, path));
                printLog(`Created:\t${ext}`);
            }),
        );
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
})();
