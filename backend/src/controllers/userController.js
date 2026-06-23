import { Application } from "../models/application.model.js";
import { Order } from "../models/order.model.js";
import mongoose from "mongoose";
import { User } from "../models/user/user.model.js";

export const getProfile = async ( req, res ) => {
    try{
        const userId = req.body.user.id;
        const profile = await User.findById( userId );
        if ( !profile ){
            return res.status( 404 ).json( { message : "user not found", data })
        }
    }
    catch ( err ) {
        return res.status( 500 ).json( { message : "internal server error", error : err.message } );
    }
}

export const outgoingApplications = async ( req, res ) => {
    try{
        const userId = req.body.user.id;
        
        const filters = req.query.filters;
        const sortBy = req.query.sortBy;
        const sortType = Number( req.query.sortType );

        const applications = await Application.find( { volunteerId : userId, status : { $in : filters } } ).sort( { [ sortBy ] : sortType } );
        return res.status( 200 ).json( { message : "fetched outgoing applications", data : applications } );
    }
    catch ( err ){
        return res.status( 500 ).json( { message : "internal server error", error : err.message } );
    }
}

export const incomingApplications = async ( req, res ) => {
    try{
        const userId = req.body.user.id;

        const filters = req.query.filters;
        const sortBy = req.query.sortBy;
        const sortType = Number( req.query.sortType );
        const applications = await Application.aggregate( [ 
            {
                $lookup : {
                    from : "orders",
                    localField : "orderId",
                    foreignField : "_id",
                    as : "order"
                }
            },
            {
                $unwind : "$order"
            },
            {
                $match : {
                    "order.ownerId": new mongoose.Types.ObjectId( userId ),
                    status : { $in : filters }
                }
            }

        ]);
        return res.status( 200 ).json( { message : "fetched incoming applications", data : applications } );
    }
    catch ( err ){
        return res.status( 500 ).json( { message : "internal server error", error : err.message } );
    }   
}

export const getOrders = async ( req, res ) => {
    try{
        const userId = req.body.user.id;

        const types = req.query.types; //donation request
        const sortBy = req.query.sortBy;
        const sortType = Number( req.query.sortType );
        const filters = req.query.filters; //isActive : true, false;

        const orders = await Order.find( { ownerId : userId, type : { $in : types }, isActive: { $in : filters } } ).sort( { [ sortBy ] : sortType } );
        return res.status( 200 ).json( { message : "fetched orders", data : orders } );
    }
    catch ( err ){
        return res.status( 500 ).json( { message : "internal server error", error : err.message } );
    }   
}