import { PipelineData } from '../../types';

/**
 * Print console log.
 *
 * @param {Object} data
 */
const printLog = (data: PipelineData): PipelineData => {
    console.log(`Created:\t${data.relativeFileExt}`);
    console.log(data);
    return data;
};

export default printLog;
