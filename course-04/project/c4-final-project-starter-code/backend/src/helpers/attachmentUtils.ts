import { S3 } from 'aws-sdk'
import config from '../config/config'

// TODO: Implement the fileStogare logic
export class AttachmentUtils {
  s3 = new S3({
    signatureVersion: 'v4',
    region: 'us-east-1'
  })
  
  getUrl = (todoId: string) => {
    return this.s3.getSignedUrlPromise('putObject', {
      Bucket: config['bucket-name'],
      Key: todoId
    })
  }
}