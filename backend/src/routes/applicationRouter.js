import { Router } from "express";
import { apply, performTask, withdraw } from "../controllers/applicationController.js";


const applicationRouter = Router();

applicationRouter.post( "/apply/:orderId", apply );
applicationRouter.delete( "/withdraw/:applicationId", withdraw );

applicationRouter.patch( "/task/:applicationId", performTask );

export default applicationRouter;
