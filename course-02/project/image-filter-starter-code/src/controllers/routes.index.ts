import { Router } from "express";
import { ImageRouter } from "./images/routes/images.router";
import { UserRouter } from "./users/routes/user.router";

const router: Router = Router();

router.use('/users', UserRouter);
router.use('/images', ImageRouter);

export const IndexRouter: Router = router;