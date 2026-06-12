import { Order } from "../models/order.model.js";

export const newDonation = async ( req, res ) => {
    try{
        const userId = req.body.user.id;
        const userCoordinates = req.body.user.coordinates
        
        const type = "donation";
        
        const qty = req.body.qty;
        const expiresAt = req.body.expiresAt;
    
        const order = await Order.create( { ownerId : userId, ownerLocation : { coordinates : userCoordinates }, qty : qty, expiresAt : expiresAt, type : type } );
        return res.status( 201 ).json( { message : "cretaed new donation", data : order } );
    }
    catch ( err ){
        return res.status( 500 ).json( { message : "internal server error", error : err.message } )
    }
}

export const newRequest = async ( req, res ) => {
    try{
        const userId = req.body.user.id;
        const userCoordinates = req.body.user.coordinates

        const type = "request";
        
        const qty = req.body.qty;
        const urgency = { low : 0, mid : 1, high : 2 }[ req.body.urgency ]

        const order = await Order.create( { ownerId : userId, ownerLocation : { coordinates : userCoordinates }, qty : qty, urgency: urgency, type : type } );
        return res.status( 201 ).json( { message : "created new request", data : order } )
    }
    catch ( err ){
        return res.status( 500 ).json( { message : "internal server error", error : err.message } )
    }
}

export const viewOrders = async ( req, res ) => {
    try{
        const userCoordinates = req.body.user.coordinates;
        
        const type = req.query.type; //donation and request
        const sortBy = req.query.sortBy;
        const sortType = Number( req.query.sortType );

        const orders = await Order.aggregate( [ 
            {
                $geoNear : {
                    near : {
                        type : "Point",
                        coordinates : userCoordinates
                    },
                    distanceField : "dist",
                    spherical : true,
                    query : {
                        isActive : true,
                        type : type
                    }
                }
            },
            {
                $sort : {
                    [ sortBy ] : sortType
                }
            }
        ] );
        return res.status( 200 ).json( { message : "retrieved all orders", data : orders } );
    }
    catch ( err ){
        return res.status( 500 ).json( { message : "internal server error", error : err.message } )
    }
}