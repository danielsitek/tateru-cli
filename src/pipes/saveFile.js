const fs = require('fs');
const path = require('path');

/**
 * Save generated html in file.
 *
 * @param {Object} data
 */

 const saveFile = (data) => {
    const fileDir = path.dirname(data.filePathExt);
    const filePath = data.filePathExt;
    const fileSource = data.source;

    if (!fs.existsSync(fileDir)) {
        fs.mkdirSync(fileDir, { recursive: true });
    }
    fs.writeFileSync(filePath, fileSource);
    return data;
}

module.exports = saveFile;
