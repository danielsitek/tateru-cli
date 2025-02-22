import path from 'path';
import fs from 'fs';

type TestFunction = () => void | Promise<void>;

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
        // console.log('\nRunning tests...');
        this.passedTests = 0;
        this.failedTests = [];

        for (const { name, fn } of this.tests) {
            // console.log(`\n  Test: ${name}`);
            try {
                for (const beforeEachFn of this.beforeEachFns) {
                    await beforeEachFn();
                }
                await fn();
                for (const afterEachFn of this.afterEachFns) {
                    await afterEachFn();
                }
                // console.log('    ✓ Passed');
                this.passedTests++;
            } catch (error) {
                // console.error('    ✗ Failed:', error);
                this.failedTests.push(`${name}: ${error}`);
            }
        }
        console.log('\nTest Summary:');
        console.log(`  Total Tests: ${this.tests.length}`);
        console.log(`  ✓ Passed: ${this.passedTests}`);
        console.log(`  ✗ Failed: ${this.failedTests.length}`);

        if (this.failedTests.length > 0) {
            console.log('\nFailed Tests:');
            this.failedTests.forEach((failure, index) => {
                console.log(`  ${index + 1}. ${failure}`);
            });
            console.log('');
            throw new Error(`${this.failedTests.length} test(s) failed`);
        }

        console.log('\nAll tests completed successfully.');
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
    };
}

export async function runTestFile(filePath: string) {
    console.log(`Running tests in ${filePath}`);
    testSuite.reset(); // Reset the test suite before running a new file
    await import(filePath);
    await testSuite.runTests();
}

export async function findAndRunTests(dir: string) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            await findAndRunTests(filePath);
        } else if (file.endsWith('.spec.ts')) {
            await runTestFile(filePath);
        }
    }
}
