const {Storage} = require('@google-cloud/storage');
const {format} = require('util');

class StorageService {

    constructor() {
        this.storage = new Storage({
            keyFilename: process.env.GOOGLE_CLOUD_FILE_KEY
        })

        this.bucket = this.storage.bucket(process.env.GOOGLE_CLOUD_BUCKET);
    }

    async uploadImage(file) {
        return new Promise((resolve, reject) => {
            const { originalname, buffer } = file

            const blob = this.bucket.file(originalname.replace(/ /g, "_"))
            const blobStream = blob.createWriteStream()
            blobStream.on('finish', () => {
                const publicUrl = format(
                    `https://storage.googleapis.com/${this.bucket.name}/${blob.name}`
                )

                resolve(publicUrl)
            }).on('error', (error) => {
                console.log(error)
                    reject(`Unable to upload image, something went wrong`)
                })
                .end(buffer)
        })
    }
}

module.exports = StorageService