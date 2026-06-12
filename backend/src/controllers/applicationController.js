import { application } from "express";
import { Application } from "../models/application.model.js";
import { Order } from "../models/order.model.js";


export const apply = async ( req, res ) => {
    try{
        const userId = req.body.user.id;
        const userCoordinates = req.body.user.coordinates;
        
        const orderId = req.params.orderId;

        const distance = req.body.distance

        let exists = await Order.findById( orderId );
        if ( exists.ownerId === userId ){
            return res.status( 400 ).json( { message : "cannot volunteer to yourself" } );
        }
        if ( !exists.isActive ){
            return res.status( 409 ).json( { message : "order is no longer valid", data : exists } );
        }
        exists = await Application.findOne( { orderId : orderId, volunteerId : userId, status : "pending" } );
        if ( exists ){
            return res.status( 409 ).json( { message : "application was already sent", data : exists } );
        }
        const application = await Application.create( { orderId : orderId, volunteerId : userId, volunteerLocation : { coordinates : userCoordinates }, distance : distance } );
        return res.status( 201 ).json( {message : "creted new application", data : application } );
    }
    catch ( err ){
        return res.status( 500 ).json( { message: "internal server error", error : err.message } );
    }
}

export const withdraw = async ( req, res  ) => {
    try{
        const userId = req.body.user.id;

        const applicationId = req.params.applicationId;
        
        let  application = await Application.findOne( { _id : applicationId, status : "pending" } );
        if ( !application ){
            return res.status( 404 ).json( { message : "application not found or not pending", data : applicationId } );
        }
        if ( String( application.volunteerId ) !== userId ){
            return res.status( 403 ).json( { message : "cannot access application", data : applicationId } );
        }
        application = await Application.findByIdAndDelete( applicationId, { status : "pending" } )
        return res.status( 200 ).json( { message : "deleted application", data : application } );
    }
    catch ( err ){
        return res.status( 500 ).json( { message: "internal server error", error : err.message } );
    }
}

export const performTask = async ( req, res ) => {
    try{
        const userId = req.body.user.id;
        const userCoordinates = req.body.user.coordinates;

        const applicationId = req.params.applicationId;
        
        const task = req.body.task;
        let application = await Application.findOne( { _id : applicationId, status : "pending" } ).populate( "orderId" );
        if ( !application ){
            return res.status( 404 ).json( { message : "application not found or not pending", data : applicationId });
        }
        if ( String( application.orderId.ownerId ) !== userId ){
            return res.status( 403 ).json( { message : "cannot access application", data : applicationId });
        }
        application = await Application.findByIdAndUpdate( applicationId, { status : task }, { new : true } );
        if ( task === "rejected" ){
            return res.status( 200 ).json( { message : "task performed on application", data : application } );
        }
        const order = await Order.findByIdAndUpdate( application.orderId, { volunteerId : userId, distance : application.distance, isActive : false, "volunteerLocation.coordinates" : userCoordinates}, { new : true } );
        return res.status( 200 ).json( { message : "task performed on application", data : application } );
    }
    catch ( err ){
        return res.status( 500 ).json( { message : "internal server error", error : err.message } );
    }
}

