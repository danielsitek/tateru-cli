import { PipelineData } from '../../types';

/**
 * Piping middleware.
 *
 * @param {Any} data
 */
class Pipeline {
    public data: PipelineData

    constructor(data: PipelineData) {
        this.data = data
    }

    public pipe(fn: (data: PipelineData) => PipelineData): this {
        const data = this.data;
        const pipedData = fn(data);
        this.data = {
            ...data,
            ...pipedData
        };
        return this
    }
}

export default Pipeline
