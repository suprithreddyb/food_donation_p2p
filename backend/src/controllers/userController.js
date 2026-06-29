import { Application } from "../models/application.model.js";
import { Order } from "../models/order.model.js";
import mongoose, { Mongoose } from "mongoose";
import { User } from "../models/user/user.model.js";

export const getProfile = async ( req, res ) => {
    try{
        const userId = req.params.userId;
        const profile = await User.findById( userId );
        if ( !profile ){
            return res.status( 404 ).json( { message : "user not found", data : userId })
        }
        return res.status( 200 ).json( { message: "fetched user profile", data: profile } );
    }
    catch ( err ) {
        return res.status( 500 ).json( { message : "internal server error", error : err.message } );
    }
}

export const editProfile = async ( req, res ) => {
    try{
        console.log( "body: " + req.body );
        const userId = req.body.user.id;
        var updateData = req.body.data;
        // updpateData = {...updateData, location: }
        const data = await User.findByIdAndUpdate( userId, updateData );
        return res.status( 201 ).json( { message : "updated profile", data : data } );
    }
    catch ( err ){
        return res.status( 500 ).json( { message: "internal server error", error: err.message } );
    }
}

export const outgoingApplications = async ( req, res ) => {
    try{
        const userId = req.body.user.id;
        
        const filters = req.query.filters;
        var status = req.query.status;
        if ( typeof( status ) === "string" ){
            status = [ status ]
        }
        const sortBy = req.query.sortBy;
        const sortType = Number( req.query.sortType );

        const applications = await Application.aggregate([
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
                    status : { $in : status },
                    volunteerId : new mongoose.Types.ObjectId( userId ),
                    "order.type" : { $ne : filters }
                }
            }
        ]);

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
        var status = req.query.status;
        if ( typeof(status) === "string" ){
            status = [ status ];
        }
        const sortBy = { "createdAt" : "createdAt", "qty" : "order.qty", "urgency" : "order.urgency", "distance" : "distance" }[ req.query.sortBy ];
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
                    status : { $in : status },
                    "order.type" : { $ne : filters }
                }
            },
            {
                $sort : {
                    [sortBy ] : sortType
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

        let types = req.query.types; //donation request
        if ( typeof( types ) === "string" ){
            types = [ types ];
        }
        const sortBy = req.query.sortBy
        const sortType = Number( req.query.sortType );
        let status = req.query.status; //isActive : true, false;
        if ( typeof( status ) === "string" ){
            status = [ status ]
        }

        const orders = await Order.find( { ownerId : userId, type : { $in : types }, isActive: { $in : status } } ).sort( { [ sortBy ] : sortType } );
        return res.status( 200 ).json( { message : "fetched orders", data : orders } );
    }
    catch ( err ){
        return res.status( 500 ).json( { message : "internal server error", error : err.message } );
    }   
}

export const deleteOrder = async ( req, res ) => {
    try{
        const userId = req.body.user.id;
        const orderId = req.params.orderId;
        let order = await Order.findById( orderId );
        if ( !order || userId !== order.ownerId.toString() ){
            return res.status( 404 ).json( { message : "order not found", data : orderId });
        }
        order = await Order.findByIdAndDelete( orderId );
        return res.status( 200 ).json( { message : "deleted order", data : order } );
    }
    catch ( err ){
        return res.status( 500 ).json( { message : "internal server error", error: err.message } );
    }
}