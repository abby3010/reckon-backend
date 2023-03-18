const DataUriParser = require('datauri/parser');
const path = require('path');

/**
 * 
 * @param {req.file} file takes in the file data from the request
 * @returns data_uri - returns the data uri of the file
 */
function generateDataUri(file) {
    console.log(file);
    const extName = path.extname(file.originalname).toString();
    return new DataUriParser().format(extName, file.buffer);
}

module.exports = generateDataUri;