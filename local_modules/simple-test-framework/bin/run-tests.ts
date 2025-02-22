#!/usr/bin/env ts-node

import { testsRunner } from '../src/index';

const cwd = process.cwd();

testsRunner(cwd);
