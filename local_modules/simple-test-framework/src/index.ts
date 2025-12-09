import path from 'path';
import fs from 'fs';
import { colorize } from './utils/colors';

type TestFunction = () => void | Promise<void>;

let failedTests: string[] = [];

class TestSuite {
    private tests: { name: string; fn: TestFunction }[] = [];
    private beforeEachFns: TestFunction[] = [];
    private afterEachFns: TestFunction[] = [];
    private currentDescribe: string | null = null;
    private passedTests: number = 0;
    private failedTests: string[] = [];

    test(name: string, fn: TestFunction) {
        this.tests.push({ name: this.currentDescribe ? `${this.currentDescribe} - ${name}` : name, fn });
    }

    describe(name: string, fn: () => void) {
        const parentDescribe = this.currentDescribe;
        this.currentDescribe = parentDescribe ? `${parentDescribe} - ${name}` : name;
        fn();
        this.currentDescribe = parentDescribe;
    }

    beforeEach(fn: TestFunction) {
        this.beforeEachFns.push(fn);
    }

    afterEach(fn: TestFunction) {
        this.afterEachFns.push(fn);
    }

    async runTests() {
        this.passedTests = 0;
        this.failedTests = [];

        for (const { name, fn } of this.tests) {
            try {
                for (const beforeEachFn of this.beforeEachFns) {
                    await beforeEachFn();
                }
                await fn();
                for (const afterEachFn of this.afterEachFns) {
                    await afterEachFn();
                }
                this.passedTests++;
            } catch (error) {
                this.failedTests.push(`${name}: ${error}`);
                failedTests.push(`${name}: ${error}`);
            }
        }

        // Print summary for current test file
        console.log(`\n   Tests:  ${this.tests.length}`);
        console.log(` ✓ Passed: ${this.passedTests}`);
        console.log(` ✗ Failed: ${this.failedTests.length}`);

        if (this.failedTests.length > 0) {
            console.log('\nFailed Tests:');
            this.failedTests.forEach((failure, index) => {
                console.log(`  ${index + 1}. ${failure}`);
            });
            console.log('');
            return;
        }

        console.log('\nAll tests completed successfully.\n');
    }

    reset() {
        this.tests = [];
        this.beforeEachFns = [];
        this.afterEachFns = [];
        this.currentDescribe = null;
        this.passedTests = 0;
        this.failedTests = [];
    }
}

const testSuite = new TestSuite();

export const test = testSuite.test.bind(testSuite);
export const describe = testSuite.describe.bind(testSuite);
export const beforeEach = testSuite.beforeEach.bind(testSuite);
export const afterEach = testSuite.afterEach.bind(testSuite);

export function expect<T>(actual: T) {
    return {
        toBe: (expected: T) => {
            if (actual !== expected) {
                throw new Error(`Expected ${expected}, but got ${actual}`);
            }
        },
        toEqual: (expected: T) => {
            if (JSON.stringify(actual) !== JSON.stringify(expected)) {
                throw new Error(`Expected ${JSON.stringify(expected)}, but got ${JSON.stringify(actual)}`);
            }
        },
        toBeUndefined: () => {
            if (actual !== undefined) {
                throw new Error(`Expected undefined, but got ${actual}`);
            }
        },
        toContain: (expected: any) => {
            if (Array.isArray(actual)) {
                if (!actual.includes(expected)) {
                    throw new Error(`Expected array to contain ${expected}, but it did not.`);
                }
            } else if (typeof actual === 'string') {
                if (!actual.includes(expected)) {
                    throw new Error(`Expected string to contain "${expected}", but it did not.`);
                }
            } else {
                throw new Error(`Expected toContain to be used with an array or string, but got ${typeof actual}`);
            }
        },
        not: {
            toContain: (expected: any) => {
                if (Array.isArray(actual)) {
                    if (actual.includes(expected)) {
                        throw new Error(`Expected array NOT to contain ${expected}, but it did.`);
                    }
                } else if (typeof actual === 'string') {
                    if (actual.includes(expected)) {
                        throw new Error(`Expected string NOT to contain "${expected}", but it did.`);
                    }
                } else {
                    throw new Error(`Expected not.toContain to be used with an array or string, but got ${typeof actual}`);
                }
            },
            toBe: (expected: T) => {
                if (actual === expected) {
                    throw new Error(`Expected not to be ${expected}, but it was.`);
                }
            }
        }
    };
}

export async function runTestFile(filePath: string) {
    console.log(`Running tests in ${filePath}`);
    testSuite.reset(); // Reset the test suite before running a new file
    await import(filePath);
    await testSuite.runTests();
}

async function findAndRunTests(dir: string) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            if (file === 'node_modules') {
                continue;
            }
            await findAndRunTests(filePath);
        } else if (file.endsWith('.spec.ts')) {
            await runTestFile(filePath);
        }
    }
}

export const testsRunner = async (cwd: string): Promise<void> => {
    failedTests = [];
    const startTime = Date.now();

    try {
        await findAndRunTests(cwd);
    } catch (error) {
        console.error('Unexpected error while running tests:', error);
    } finally {
        const duration = Date.now() - startTime;

        if (failedTests.length > 0) {
            console.error(colorize.red(`${failedTests.length} test(s) failed\n`));
            console.error('Failed Tests:');

            failedTests.forEach((failure, index) => {
                console.error(`  ${index + 1}. ${failure}`);
            });

            console.log(colorize.gray(`\nFinished in ${duration}ms`));
            process.exit(1);
        }

        console.log(colorize.green('✓ All tests passed successfully'));
        console.log(colorize.gray(`\nFinished in ${duration}ms`));
        process.exit(0);
    }
}
