const minify = require('html-minifier').minify;

/**
 * Save generated html in file.
 *
 * @param {Object} data
 */

const minifyHtml = (data) => {
    let fileSource = data.source;
    fileSource = minify(fileSource, {
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true,
    });

    data.source = fileSource;
    return data;
};

module.exports = minifyHtml;
