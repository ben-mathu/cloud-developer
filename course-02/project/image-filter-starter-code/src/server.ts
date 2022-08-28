import { IndexRouter } from './controllers/routes.index';
import { sequelize } from './sequelize';
import express from 'express';
import bodyParser from 'body-parser';
import { Models } from './controllers/model.index';

(async () => {
  await sequelize.addModels(Models);
  await sequelize.sync();

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:8100");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
  });

  app.use("/app/v1", IndexRouter);

  app.get("/", (req, res) => {
    res.status(200).send({message: "please use /app/v1/users or /app/v1/images"});
  });

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();