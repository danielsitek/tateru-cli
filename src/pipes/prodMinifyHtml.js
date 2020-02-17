
/**
 * Save generated html in file.
 *
 * @param {Object} data
 */

const prodMinifyHtml = (data) => {
    if (options.env === 'prod') {
        return minifyHtml(data);
    }
    return data;
}

module.exports = prodMinifyHtml;
