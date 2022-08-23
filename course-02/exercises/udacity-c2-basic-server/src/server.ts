import express, { Router, Request, Response } from 'express';
// import bodyParser from 'body-parser'; deprecated
const bodyParser = require('body-parser')

import { Car, cars as cars_list } from './cars';

(async () => {
  let cars:Car[]  = cars_list;

  //Create an express application
  const app = express(); 
  //default port to listen
  const port = 8082; 
  
  //use middleware so post bodies 
  //are accessable as req.body.{{variable}}
  app.use(bodyParser.json()); 
  app.use(express.urlencoded({ extended: true })) //for requests from forms-like data

  // Root URI call
  app.get( "/", ( req: Request, res: Response ) => {
    res.status(200).send("Welcome to the Cloud!");
  } );

  // Get a greeting to a specific person 
  // to demonstrate routing parameters
  // > try it {{host}}/persons/:the_name
  app.get( "/persons/:name", 
    ( req: Request, res: Response ) => {
      let { name } = req.params;

      if ( !name ) {
        return res.status(400)
                  .send(`name is required`);
      }

      return res.status(200)
                .send(`Welcome to the Cloud, ${name}!`);
  } );

  // Get a greeting to a specific person to demonstrate req.query
  // > try it {{host}}/persons?name=the_name
  app.get( "/persons/", ( req: Request, res: Response ) => {
    let { name } = req.query;

    if ( !name ) {
      return res.status(400)
                .send(`name is required`);
    }

    return res.status(200)
              .send(`Welcome to the Cloud, ${name}!`);
  } );

  // Post a greeting to a specific person
  // to demonstrate req.body
  // > try it by posting {"name": "the_name" } as 
  // an application/json body to {{host}}/persons
  app.post( "/persons", 
    async ( req: Request, res: Response ) => {

      const { name } = req.body;

      if ( !name ) {
        return res.status(400)
                  .send(`name is required`);
      }

      return res.status(200)
                .send(`Welcome to the Cloud, ${name}!`);
  } );

  // @TODO Add an endpoint to GET a list of cars
  // it should be filterable by make with a query paramater
  app.get("/cars", (req, res) => {
    const { make } = req.query;
    let car_item_list = cars_list;
    if (make) {
      car_item_list = cars_list.filter((car: Car) => car.make === make);
    }
    res.status(200).send(car_item_list);
  });

  // @TODO Add an endpoint to get a specific car
  // it should require id
  // it should fail gracefully if no matching car is found
  app.get("/cars/:id", (req, res) => {
    const { id } = req.params;
    if (!id) {
      res.status(400).send({"message": "Parameter id is required"});
      return;
    }

    const car = cars_list.filter((car: Car) => car.id.toString() == id);

    if (car && car.length > 0) {
      res.status(200).send(car[0]);
    } else {
      res.status(404).send({"message": `Car with id ${id} was not found` })
    }
  });

  /// @TODO Add an endpoint to post a new car to our list
  // it should require id, type, model, and cost
  app.post("/cars", (req, res) => {
    const { make, type, model, cost} = req.body;
    let { id } = req.body;

    if (make && type && model && cost) {
      let cars: Car[] = cars_list.sort();
      if (!id) {
        id = cars[cars_list.length-1].id + 1
      }

      cars = cars_list.filter((car: Car) => car.id === id);
      if (cars && cars.length > 0) {
        res.status(400).send({"message": `car with id ${id} already exists` })
        return;
      }
      
      const car: Car = {
        id: id,
        make: make,
        type: type,
        model: model,
        cost: cost
      };

      cars_list.push(car);

      res.status(200).send(cars_list);
    } else {
      res.status(404).send({"message": "all parameters required" })
    }
  })

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();
