import { describe, test, expect } from 'simple-test-framework';
import { minifyContents } from './minifyContents';

describe('minifyContents', () => {
    test('should minify HTML content', async () => {
        const html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>Test</title>
                <style>
                    body {
                        background-color: #fff;
                    }
                </style>
            </head>
            <body>
                <h1>  Hello   World  </h1>
                <script>
                    console.log(  "test"  );
                </script>
            </body>
            </html>
        `;

        const minified = await minifyContents(html, 'html');

        // Basic checks for minification
        expect(minified.includes('  Hello   World  ')).toBe(false);
        expect(minified.includes('Hello World')).toBe(true);
        expect(minified.includes('\n')).toBe(false);
        expect(minified.includes('<!doctype html>')).toBe(true); // @minify-html usually lowercases doctype
    });

    test('should return original content if fileType is not html', async () => {
        const css = `
            body {
                color: red;
            }
        `;
        const result = await minifyContents(css, 'css');
        expect(result).toBe(css);
    });

    test('should handle fileType case insensitively', async () => {
        const html = '<div>  test  </div>';
        const minified = await minifyContents(html, 'HTML');
        expect(minified).toBe('<div>test</div>');
    });

    test('should handle fileType with whitespace', async () => {
        const html = '<div>  test  </div>';
        const minified = await minifyContents(html, ' html ');
        expect(minified).toBe('<div>test</div>');
    });

    test('should handle invalid HTML', async () => {
        const invalidHtml = '<div unclosed tag';
        const minified = await minifyContents(invalidHtml, 'html');
        expect(typeof minified).toBe('string');
    });
});
