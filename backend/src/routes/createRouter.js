import { Router } from "express";
import { createUser } from "../controllers/createController.js";

const createRouter = Router();


createRouter.post( "/user", createUser);


export default createRouter;