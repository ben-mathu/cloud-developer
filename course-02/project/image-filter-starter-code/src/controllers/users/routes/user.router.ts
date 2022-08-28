import { Request, Response, Router } from 'express';
import { comparePassword, generateToken, getHashedPassword } from '../../../util/util';
import { User } from '../models/User';

const router: Router = Router();

// Register user
router.post('/register', async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username && !password) {
    return res.status(400).send({message: 'username and Password are required'});
  }

  let user = await User.findByPk(username);
  if (user) {
    return res.status(400).send({message: 'user already exists'});
  }

  const hashedPassword = await getHashedPassword(password);

  user = new User();
  user.username = username;
  user.password = hashedPassword;

  const savedUser = await user.save();

  return res.status(200).send(savedUser);
});

router.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username && !password) {
    return res.status(400).send({message: 'username and password required'});
  }

  const user = await User.findByPk(username);
  if (!user) {
    return res.status(400).send({message: 'user does not exist'});
  }

  const validPassword = await comparePassword(password, user.password);
  if (!validPassword) {
    return res.status(400).send({message: 'username or password is invalid'})
  }

  const jwt = await generateToken(user);

  return res.status(301).send({auth: true, token: jwt, user: user});
})

export const UserRouter: Router = router;