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

            const ext =  originalname.split('.').at(-1)
            const filename = new Date().getTime() + '.' + ext
            const blob = this.bucket.file(filename)
            const blobStream = blob.createWriteStream()

            blobStream.on('finish', () => {
                const publicUrl = format(
                    `https://storage.googleapis.com/${this.bucket.name}/${filename}`
                )

                resolve(publicUrl)
            }).on('error', (error) => {
                console.log(error)
                    reject(`Unable to upload image, something went wrong`)
                })
                .end(buffer)
        })
    }

    async deleteImage(path) {
        try {
            const filename  = path.split('/').at(-1)
            await this.storage.bucket(this.bucket.name).file(filename).delete();
        } catch (e) {
            console.log(e)
        }

    }
}

module.exports = StorageService