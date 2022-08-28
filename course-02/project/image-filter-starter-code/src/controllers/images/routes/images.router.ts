import { Router } from "express";
import { getFileSignedUrl } from "../../../aws";
import { deleteLocalFiles } from "../../../util/util";
import { filterImageFromURL } from "../../../util/util";
import { Image } from "../models/Image";

const router: Router = Router();

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

  router.get("/filteredimage", (req, res) => {
    const image_url = req.query['image_url'] as string;
    
    filterImageFromURL(image_url).then((value) => {

      let imageArr = []
      imageArr.push(value);
      deleteLocalFiles(imageArr).then(async (result) => {
        const imageName = value.split("/");
        
        let image: Image = new Image();
        image.imageName = imageName[imageName.length-1];
        const imageResult = await image.save();
        
        res.status(200).send(imageResult);
      }).catch((error) => res.status(404).send(error));
    }).catch((error) => {
      console.log(error);
      res.status(404).send({message: 'Error getting filtered image.'});
    });
  });

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  router.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );

export const ImageRouter: Router = router;