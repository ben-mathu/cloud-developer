import { S3Client } from "@aws-sdk/client-s3";
import AWS, { SharedIniFileCredentials, S3} from "aws-sdk";
import { config } from "./config/config";

const c = config.aws

// Configure AWS
const credentails = new SharedIniFileCredentials({ profile: c.aws_profile })
AWS.config.credentials = credentails;

export const s3Client = new S3Client({
  region: c.aws_region
})

export const s3 = new S3({
  signatureVersion: 'v4',
  region: c.aws_region,
  params: { Bucket: c.aws_media_bucket }
});

export function getFileSignedUrl(fileName: string) {
  const param = { Bucket: c.aws_media_bucket, Key: fileName, Expires: 60*5 };
  const url = s3.getSignedUrl('getObject', param);
  return url;
}

export function getPutFileSignedUrl(fileName: string) {
  const param = { Bucket: c.aws_media_bucket, Key: fileName, Expires: 60*5 };
  const url = s3.getSignedUrl('putObject', param);
  return url;
}