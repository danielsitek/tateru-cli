#!/usr/bin/env node

'use strict';

import path from 'path';
import fs from 'fs';
import TateruCLI from './index';
import CliService from './app/services/cliService';
import { ConfigFile } from './types';

const rootDir = path.resolve(process.cwd())
const options = CliService.init();

const loadConfigurationFromFile = (file: string): ConfigFile => {
    const configFileSrc = path.resolve(rootDir, file);

    if (!fs.existsSync(configFileSrc)) {
        console.error(`Cannot find config file "${file}" on path "${configFileSrc}"`);
        process.exit(1);
    } else {
        console.log(`Config file "${file}" loaded`)
    }

    let configFile: ConfigFile = {} as ConfigFile;

    try {
        configFile = require(configFileSrc);
        return configFile
    } catch (e) {
        console.error(`Cannot load config file "${configFileSrc}"`)
        process.exit(1);
    }
}

const configuration = loadConfigurationFromFile(options.configFile)

TateruCLI({
    ...options,
    configuration
});
