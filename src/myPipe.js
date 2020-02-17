/**
 * Piping middleware.
 *
 * @param {Any} data
 */
function MyPipe(data) {
    this.data = data;
    return this;
};

MyPipe.prototype.pipe = function(fn) {
    const data = this.data;
    const pipedData = fn(data);
    this.data = {
        ...data,
        ...pipedData
    };
    return this;
};

module.exports = MyPipe;
