const multer = require("multer");
const multerS3 = require("multer-s3");

const s3 = require("../../config/aws/s3Client")

module.exports =  multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, `${+new Date()}${file.originalname}`)
    }
  })
})
