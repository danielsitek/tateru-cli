import { PipelineData } from '../../types';
import { minify } from 'html-minifier';


/**
 * Save generated html in file.
 *
 * @param {Object} data
 */

const minifyHtmlPipeline = (data: PipelineData): PipelineData => {
    const { source } = data;
    const minified = minifyHtml(source);

    data.source = minified;
    return data;
};

export const minifyHtml = (content: string): string => {
    const minified = minify(content, {
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true,
    });

    return minified;
}

export default minifyHtmlPipeline;
