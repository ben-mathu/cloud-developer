import * as AWS from 'aws-sdk'

// TODO: Implement the fileStogare logic
export class AttachmentUtils {
  s3 = new AWS.S3({
    signatureVersion: 'v4'
  })
  
  getUrl = (bucketName: string, todoId: string) => {
    return this.s3.getSignedUrlPromise('PutObject', {
      Bucket: bucketName,
      Key: todoId,
      Expires: 60 * 5
    })
  }
}