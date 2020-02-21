import fs from 'fs';
import path from 'path';
import { PipelineData } from '../../types';

/**
 * Save generated html in file.
 *
 * @param {Object} data
 */

 const saveFile = (data: PipelineData): PipelineData => {
    const fileDir = path.dirname(data.filePathExt);
    const filePath = data.filePathExt;
    const fileSource = data.source;

    if (!fs.existsSync(fileDir)) {
        fs.mkdirSync(fileDir, { recursive: true });
    }
    fs.writeFileSync(filePath, fileSource);
    return data;
}

export default saveFile;
