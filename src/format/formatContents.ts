import { html, js } from 'js-beautify';

export const formatContents = (contents: string, fileType?: string): string => {
    if (fileType && ['html', 'xml'].includes(fileType)) {
        return html(contents, {
            'indent_size': 4,
        });
    }

    if (fileType && ['json', 'webmanifest'].includes(fileType)) {
        return js(contents, {
            'indent_size': 2,
        });
    }

    return contents;
};
