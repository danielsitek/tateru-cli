import { html, js } from 'js-beautify';

export const formatBuildContent = (content: string, fileType?: string): string => {
    if (fileType && ['html', 'xml'].includes(fileType)) {
        return html(content, {
            'indent_size': 4,
        });
    }

    if (fileType && ['json', 'webmanifest'].includes(fileType)) {
        return js(content, {
            'indent_size': 2,
        });
    }

    return content;
};
