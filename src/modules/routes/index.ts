import { Router } from "express";
import { bookRoute } from "../book/book.route";
import { borrowRoutes } from "../borrow/borrow.route";

const routes=Router();
routes.use('/api/books',bookRoute)
routes.use('/api/borrow',borrowRoutes)
export default routes