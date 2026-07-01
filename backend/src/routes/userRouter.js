// src/routes/userRouter.js (or .ts)
import { Router } from 'express';
import { deleteOrder, editProfile, getOrders, getPrivateProfile, getPublicProfile, incomingApplications, outgoingApplications } from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';

const userRouter = Router();

userRouter.get( "/profile", protect, getPrivateProfile );
userRouter.get( "/profile/:userId", getPublicProfile );
userRouter.patch( "/profile/edit", protect,editProfile );

userRouter.get( "/applications/incoming", protect, incomingApplications );
// userRouter.patch( "/applications/incoming", protect, incomingApplications );
userRouter.get( "/applications/outgoing", protect, outgoingApplications );
// userRouter.patch( "/applications/outgoing", outgoingApplications );

userRouter.get( "/orders", protect, getOrders );
// userRouter.patch( "/orders", getOrders );
userRouter.delete( "/order/delete/:orderId", protect, deleteOrder )


export default userRouter;