import { Router } from "express";
import { apply, performTask, withdraw } from "../controllers/applicationController.js";
import { protect } from '../middlewares/authMiddleware.js';


const applicationRouter = Router();

applicationRouter.post( "/apply/:orderId", protect, apply );
applicationRouter.delete( "/withdraw/:applicationId", protect, withdraw );

applicationRouter.patch( "/task/:applicationId", protect, performTask );

export default applicationRouter;
