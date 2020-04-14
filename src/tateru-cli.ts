#!/usr/bin/env node

'use strict';

import TateruCLI from './index';
import CliService from './app/services/cliService';

const options = CliService.init();

TateruCLI(options);
