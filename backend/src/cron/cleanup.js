import cron from 'node-cron';
import { Order } from "../models/order.model.js";
const cleanDatabase = async () => {
    const curDate = new Date().toISOString().split( "T" )[ 0 ];
    const expiredOrders = await Order.updateMany( { expiresAt : { $lt : curDate } }, { isActive : false } );
    console.log( "cleaned database" );
}

cron.schedule( "0 0 * * *", async () => {
    console.log( "cleaning up db" );
    await cleanDatabase();
})