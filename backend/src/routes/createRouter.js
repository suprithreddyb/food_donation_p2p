import { Router } from "express";
import { createUser } from "../controllers/createController.js";

const createRouter = Router();


createRouter.post( "/user", createUser);
// createRouter.post( "/application", );


export default createRouter;