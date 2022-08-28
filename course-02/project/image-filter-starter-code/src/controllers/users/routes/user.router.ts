import { Request, Response, Router } from "express";
import { User } from "../models/User";

const router: Router = Router();

// Register user
router.post('/', async (req: Request, res: Response) => {
  const username = req.body.username;
  const plainTextPassword = req.body.passowrd;

  if (!username || !plainTextPassword) {
    return res.status(400).send({message: 'username and Password are required'});
  }

  const user = await User.findByPk(username);
  if (user) {
    res.status(400).send({message: 'user already exists'});
  }
});

export const UserRouter: Router = router;