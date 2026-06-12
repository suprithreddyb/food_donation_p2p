import { Router } from "express";
import { newDonation, newRequest, viewOrders } from "../controllers/orderController.js";

const orderRouter = Router();

orderRouter.post( "/new/donation", newDonation );
orderRouter.post( "/new/request", newRequest );

orderRouter.get( "/orders", viewOrders )

export default orderRouter;
