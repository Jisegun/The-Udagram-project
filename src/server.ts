import express from 'express';
import { Request, Response } from "express";
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());


  /**************************************************************************** */
       //  GET /filteredimage?image_url={{URL}}
  app.get("/filteredimage", async (req: Request, res: Response)=>{

       // 1. validate the image_url query

    const image_url: string = req.query.image_url;
  try {
    if(!image_url)
      return res.status(400).send(`Inavlid Image url!`);
    
      // 2. call filterImageFromURL(image_url) to filter the image
      const filterImage = await filterImageFromURL(image_url);

     // 3. send the resulting file in the response
         res.status(200).sendFile(filterImage);

    //  4. deletes any files on the server on finish of the response

         req.on('finish', () => deleteLocalFiles([filterImage]));

    }  
    catch (error) {
        return res.status(422).send("Image process error");
      }
        
  });

  
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();