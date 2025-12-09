type TestFunction = () => void | Promise<void>;
export declare const test: (name: string, fn: TestFunction) => void;
export declare const describe: (name: string, fn: () => void) => void;
export declare const beforeEach: (fn: TestFunction) => void;
export declare const afterEach: (fn: TestFunction) => void;
export declare function expect<T>(actual: T): {
    toBe: (expected: T) => void;
    toEqual: (expected: T) => void;
    toBeUndefined: () => void;
    toContain: (expected: any) => void;
    not: {
        toContain: (expected: any) => void;
        toBe: (expected: T) => void;
    };
};
export declare function runTestFile(filePath: string): Promise<void>;
export declare const testsRunner: (cwd: string) => Promise<void>;
export {};
