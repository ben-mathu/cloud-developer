import fs from 'fs';
import axios from "axios";
import Jimp = require("jimp");
import { s3Client } from "../aws";
import { config } from '../config/config';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import * as bcrypt from 'bcrypt';
import { User } from '../controllers/users/models/User';
import * as jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';

const cAws = config.aws;
const cSecurity = config.security;

// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
export async function filterImageFromURL(inputURL: string): Promise<string> {
  
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
            Bucket: cAws.aws_media_bucket,
            Key: fileName,
            Body: fs.createReadStream(filePath)
          };

          const data = await s3Client.send(new PutObjectCommand(params));

          console.log(data);
          resolve(filePath);
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

export async function getHashedPassword(plainTextPassword: string): Promise<string> {
  const salt = await bcrypt.genSalt(cSecurity.saltRound as unknown as number);
  const hash = await bcrypt.hash(plainTextPassword, salt);

  return hash;
}

export async function comparePassword(plainTextPassword: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
}

export async function generateToken(user: User) {
  return jwt.sign(user.toJSON(), cSecurity.secret);
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.headers || !req.headers.authorization) {
    return res.status(400).send({message: 'No Authrization Headers'});
  }

  const tokenBearerStrArr = req.headers.authorization.split(' ');
  if (tokenBearerStrArr.length != 2 || tokenBearerStrArr[0] != 'Bearer') {
    return res.status(400).send({message: 'Wrong Authorization configuration'});
  }

  const token = tokenBearerStrArr[1];

  return jwt.verify(token, cSecurity.secret, (error, decoded) => {
    if (error) {
      return res.status(400).send({message: 'Failed to authenticate'});
    }
    return next();
  })
}
