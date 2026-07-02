import { Order } from "../models/order.model.js";
import { User } from "../models/user/user.model.js";


export const createUser = async ( req, res ) => {
    try{
        const user = await User.create( req.body );
        return res.status( 200 ).json( { message : "created user", data : user } );
    }
    catch ( err ){
        return res.status( 500 ).json( { message : "internal server error", error : err.message } );
    }
}
