#!/usr/bin/env ts-node

import { findAndRunTests } from '../src/index';

// Get the current working directory
const cwd = process.cwd();
let hasErrors = false;

// Start searching for test files from the current working directory
(async () => {
    try {
        await findAndRunTests(cwd);
    } catch (error) {
        console.error(error.message);
        hasErrors = true;
    } finally {
        process.exit(hasErrors ? 1 : 0);
    }
})();
