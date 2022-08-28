import axios from 'axios';
import { Request, response, Response, Router } from 'express';
import { User } from '../../users/models/User';
import { deleteLocalFiles, requireAuth } from '../../../util/util';
import { filterImageFromURL } from '../../../util/util';
import { Image } from '../models/Image';
import { getFileSignedUrl, s3Client } from '../../../aws';
import { config } from '../../../config/config';
import fs from 'fs';

const router: Router = Router();
const cAws = config.aws

// @TODO1 IMPLEMENT A RESTFUL ENDPOINT
// GET /filteredimage?image_url={{URL}}
// endpoint to filter an image from a public url.
// IT SHOULD
//    1
//    1. validate the image_url query
//    2. call filterImageFromURL(image_url) to filter the image
//    3. send the resulting file in the response
//    4. deletes any files on the server on finish of the response
// QUERY PARAMATERS
//    image_url: URL of a publicly accessible image
// RETURNS
//   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

/**************************************************************************** */

router.get('/filteredimage', requireAuth, async (req: Request, res: Response) => {
  const image_url = req.query['image_url'] as string;
  const userId = req.query['user_id'] as string;

  let user = await User.findByPk(userId);

  if (!user) {
    return res.status(401).send({message: `user with id ${userId} does not exist.`});
  }
  
  filterImageFromURL(image_url).then((value) => {

    let imageArr = []
    imageArr.push(value);
    deleteLocalFiles(imageArr).then(async (result) => {
      const imageName = value.split('/');
      
      let image: Image = new Image();
      image.imageName = imageName[imageName.length-1];
      image.userId = user.id;
      const imageResult = await image.save();

      const imageList: Image[] = []
      imageList.push(image);

      user.images = imageList
      user = await user.update(user);
      
      res.status(200).send(imageResult);
    }).catch((error) => res.status(404).send(error));
  }).catch((error) => {
    console.log(error);
    res.status(404).send({message: 'Error getting filtered image.'});
  });
});

//! END @TODO1

// get all images and key
router.get('/', requireAuth, async (req: Request, res: Response) => {
  const userId = req.query['user_id'] as string;
  if (!userId) {
    return res.status(400).send({message: 'user id is required'});
  }
  
  const user = await User.findByPk(userId, {include: [Image]});
  if (!user && user.images.length < 1) {
    return res.status(400).send({message: 'No images found'});
  }

  return res.status(200).send(user.images);
});

// Download a filtered image
router.get('/:imageName', requireAuth, async (req: Request, res: Response) => {
  const { imageName } = req.params;

  if (!imageName) {
    return res.status(400).send({message: 'url is not configured properly'});
  }
  const url = getFileSignedUrl(imageName);
  const response = await axios.get(url, {
    responseType: 'arraybuffer'
  });
  
  const buffer = Buffer.from(response.data, 'utf-8');
  return res.status(200).send(buffer);
});

// Root Endpoint
// Displays a simple message to the user
router.get( '/', async ( req: Request, res: Response ) => {
  res.send('try GET /filteredimage?image_url={{}}')
} );

export const ImageRouter: Router = router;