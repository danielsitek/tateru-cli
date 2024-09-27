import path from 'path';
import fs from 'fs';

type TestFunction = () => void | Promise<void>;

class TestSuite {
    private tests: { name: string; fn: TestFunction }[] = [];
    private beforeEachFns: TestFunction[] = [];
    private afterEachFns: TestFunction[] = [];
    private currentDescribe: string | null = null;

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
        console.log('Running tests...');
        for (const { name, fn } of this.tests) {
            console.log(`  Test: ${name}`);
            try {
                for (const beforeEachFn of this.beforeEachFns) {
                    await beforeEachFn();
                }
                await fn();
                for (const afterEachFn of this.afterEachFns) {
                    await afterEachFn();
                }
                console.log('    ✓ Passed');
            } catch (error) {
                console.error('    ✗ Failed:', error);
            }
        }
        console.log('All tests completed.');
    }

    reset() {
        this.tests = [];
        this.beforeEachFns = [];
        this.afterEachFns = [];
        this.currentDescribe = null;
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
