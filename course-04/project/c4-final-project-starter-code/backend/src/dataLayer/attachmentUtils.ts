import * as AWSXRay from 'aws-xray-sdk'
import { S3 } from 'aws-sdk'
import config from '../config/config'

// TODO: Implement the fileStogare logic
export class AttachmentUtils {
  s3
  constructor() {
    this.s3 = new S3({
      signatureVersion: 'v4',
      region: 'us-east-1'
    })
    AWSXRay.captureAWS((this.s3 as any).service)
  }
  
  getUrl = (todoId: string) => {
    return this.s3.getSignedUrlPromise('putObject', {
      Bucket: config['bucket-name'],
      Key: todoId
    })
  }
}