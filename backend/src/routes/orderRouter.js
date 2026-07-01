import { Router } from "express";
import { newDonation, newRequest, viewOrders } from "../controllers/orderController.js";
import { protect } from '../middlewares/authMiddleware.js';

const orderRouter = Router();

orderRouter.post( "/new/donation", protect, newDonation );
orderRouter.post( "/new/request", protect, newRequest );

orderRouter.get( "/orders", protect, viewOrders )

export default orderRouter;
