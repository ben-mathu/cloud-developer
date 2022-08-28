import fs from 'fs';
import axios from "axios";
import Jimp = require("jimp");
import { getPutFileSignedUrl, s3, s3Client } from "../aws";
import FormData from 'form-data';
import { Agent } from 'https';
import { S3 } from 'aws-sdk';
import { config } from '../config/config';
import { CreateBucketCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
export async function filterImageFromURL(inputURL: string): Promise<string> {
  const c = config.aws
  
  return new Promise(async (resolve, reject) => {
    try {
      const photo = await axios.get(inputURL, {
        responseType: "arraybuffer"
      }).then(function ({data: imageBuffer}) {
        return Jimp.read(imageBuffer);
      });

      const fileName =
        "filtered." + Math.floor(Math.random() * 2000) + ".jpg";
      const outpath = `/tmp/${fileName}`;
      const filePath = __dirname + outpath;
      photo
        .resize(256, 256) // resize
        .quality(60) // set JPEG quality
        .greyscale() // set greyscale
        .write(filePath, async (img) => {
          const params = {
            Bucket: c.aws_media_bucket,
            Key: fileName,
            Body: fs.createReadStream(filePath)
          };

          const data = await s3Client.send(new PutObjectCommand(params));

          console.log(data);
          resolve(filePath);

          // photoBucket.upload({
          //   ACL: "public-read",
          //   Body: fs.createReadStream(outpath),
          //   Key: fileName,
          //   ContentType: "application/octet-stream"
          // }, (error, response) => {
          //   console.log(error);
          // });
          // axios({
          //   method: 'put',
          //   url: url,
          //   data: form,
          //   headers: headers,
          //   httpsAgent: new Agent({
          //     rejectUnauthorized: false
          //   }),
          //   maxContentLength: Infinity,
          //   maxBodyLength: Infinity,
          //   onUploadProgress: (progressEvent: any) => {
          //     const complete = (progressEvent.loaded / progressEvent.total * 100 | 0) + '%';
          //     console.log('upload percent: ' + complete);
          //   }
          // })
          //   .then((result) => resolve(fileName)
          //   ).catch((error) => {
          //     reject(error);
          //   });
        });
    } catch (error) {
      reject(error);
    }
  });
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
export async function deleteLocalFiles(files: Array<string>) {
  for (let file of files) {
    fs.unlinkSync(file);
  }
}
