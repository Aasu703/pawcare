import {Router,Request,Response} from "express"
import { BookController } from "../controller/book.controller"

const router : Router =Router()
const bookController = new BookController()

router.get('/getBook', bookController.getbooks)
router.get('/:bookid', bookController.getBookById)

export default router;