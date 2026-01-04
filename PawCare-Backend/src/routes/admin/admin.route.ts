import { Router, Request, Response } from "express";
import { authorizedMiddleware } from "../../middleware/authorized.middleware";
import { AdminUserController } from "../../controller/admin/user.controller";
const router = Router();
const admincontroller = new AdminUserController();

router.post('/', authorizedMiddleware, admincontroller.createUser);

router.post("/registeradmin", admincontroller.createUser);
router.get(
    '/test',
    (req: Request, res: Response) => {
        res.send("Test route workds")
    }
)

export default router;
