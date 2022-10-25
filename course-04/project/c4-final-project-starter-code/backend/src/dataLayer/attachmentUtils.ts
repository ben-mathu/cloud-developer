import * as AWSXRay from 'aws-xray-sdk'
import * as AWS from 'aws-sdk'
import config from '../config/config'

// TODO: Implement the fileStogare logic
export class AttachmentUtils {
  XAWS
  s3
  constructor() {
    this.XAWS = AWSXRay.captureAWS(AWS)
    this.s3 = new this.XAWS.S3({
      signatureVersion: 'v4',
      region: 'us-east-1'
    })
  }
  
  getUrl = (todoId: string) => {
    return this.s3.getSignedUrlPromise('putObject', {
      Bucket: config['bucket-name'],
      Key: todoId
    })
  }
}