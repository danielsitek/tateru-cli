import { PipelineData } from '../../types';
import { minify } from 'html-minifier';


/**
 * Save generated html in file.
 *
 * @param {Object} data
 */

const minifyHtml = (data: PipelineData): PipelineData => {
    const { source } = data;
    const minified = minify(source, {
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true,
    });

    data.source = minified;
    return data;
};

export default minifyHtml;
