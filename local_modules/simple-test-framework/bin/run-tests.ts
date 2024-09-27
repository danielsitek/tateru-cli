#!/usr/bin/env ts-node

import { findAndRunTests } from '../src/index';

// Get the current working directory
const cwd = process.cwd();

// Start searching for test files from the current working directory
findAndRunTests(cwd).catch(console.error);
