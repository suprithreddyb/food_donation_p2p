// src/routes/userRouter.js (or .ts)
import { Router } from 'express';
import { getOrders, incomingApplications, outgoingApplications } from '../controllers/userController.js';


const userRouter = Router();

userRouter.get( "/applications/incoming", incomingApplications );
userRouter.get( "/applications/outgoing", outgoingApplications );

userRouter.get( "/orders", getOrders );


export default userRouter;