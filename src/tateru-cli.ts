#!/usr/bin/env node

'use strict';

import path from 'path';
import fs from 'fs';
import TateruCLI from './index';
import CliService from './app/services/cliService';
import { ConfigFile, BuilderOptions } from './types';

const loadConfigurationFromFile = (file: string, rootDir: string): ConfigFile => {
    const configFileSrc = path.resolve(rootDir, file);

    if (!fs.existsSync(configFileSrc)) {
        throw new Error(`Cannot find file "${file}" on path "${configFileSrc}"`);
    }

    try {
        const configFileContent: string = fs.readFileSync(configFileSrc).toString('utf-8');
        const configFileJson: ConfigFile = JSON.parse(configFileContent);
        console.log(`Config file "${file}" loaded`)
        return configFileJson
    } catch (e) {
        throw new Error(`Cannot load config file "${configFileSrc}"`)
    }
}

const runBuilder = () => {
    try {
        const rootDir = path.resolve(process.cwd())
        const options = CliService.init();
        const configuration = loadConfigurationFromFile(options.configFile, rootDir)
        const builderOptions: BuilderOptions = {
            ...options,
            configuration
        }

        TateruCLI(builderOptions);
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

runBuilder();
