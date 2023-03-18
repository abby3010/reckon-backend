// import multer from "multer";
const multer = require("multer");


// Multer configuration for storing files in memory
const storage = multer.memoryStorage()

// Multer configuration for storing files in disk
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, '/tmp/my-uploads')
//     },
//     filename: function (req, file, cb) {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//         cb(null, file.fieldname + '-' + uniqueSuffix)
//     }
// })

/**
 * Multer middleware for uploading files.
 * Currently, it is configured to store files in memory. 
 * 
 */
const upload = multer({ storage: storage });

module.exports = upload;