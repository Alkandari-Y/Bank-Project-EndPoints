const { S3Client } = require('@aws-sdk/client-s3')

const S3 = new S3Client({
    endpoint: `https://${process.env.DO_REGION_NAME}.digitaloceanspaces.com`, 
    forcePathStyle: false, 
    region: process.env.AWS_S3_REGION_NAME,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID, 
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY 
    }
})

module.exports = S3