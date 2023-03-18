// Functions to upload images to the cloudinary
const cloudinary = require("../configs/cloudinary");

const imageUploadOptions = {
    // folder: process.env.CLOUDINARY_ENTITY_PROFILE_IMAGE_FOLDER,
    // resource_type: "image",
    upload_preset: "nft",
}


/**
Uploads single image to cloudinary. Assumes that the image is base64 encoded.
@param {String} imageBase64 base64 encoded image data
@returns {String} secure_url - URL of the image on the cloudinary server with https protocol
@throws {Error} error - Error object if anything goes wrong
*/
async function uploadImage(imageBase64) {
    try {
        // The secure_url is the url of the image on the cloudinary server with https protocol
        let secure_url = null;

        // The cloudinary.uploader.upload() function returns a promise
        // It takes in the path of the image to be uploaded and the upload options
        // We can even pass in base64 encoded image data in the .upload() function
        await cloudinary.uploader.upload(imageBase64, imageUploadOptions, (error, result) => {
            if (error) {
                throw error;
            } else {
                secure_url = result.secure_url;
            }
        });

        return secure_url;
    } catch (error) {
        throw error;
    }
}

module.exports = { uploadImage };