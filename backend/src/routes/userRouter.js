// src/routes/userRouter.js (or .ts)
import { Router } from 'express';
import { deleteOrder, editProfile, getOrders, getProfile, incomingApplications, outgoingApplications } from '../controllers/userController.js';


const userRouter = Router();

userRouter.get( "/profile/:userId", getProfile );
userRouter.patch( "/profile", getProfile );
userRouter.patch( "/profile/edit", editProfile );

userRouter.get( "/applications/incoming", incomingApplications );
userRouter.patch( "/applications/incoming", incomingApplications );
userRouter.get( "/applications/outgoing", outgoingApplications );
userRouter.patch( "/applications/outgoing", outgoingApplications );

userRouter.get( "/orders", getOrders );
userRouter.patch( "/orders", getOrders );
userRouter.delete( "/order/delete/:orderId", deleteOrder )


export default userRouter;