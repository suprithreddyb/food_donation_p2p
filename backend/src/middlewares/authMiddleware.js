import jwt from 'jsonwebtoken'
import { User } from '../models/user/user.model.js';

export const protect = async (req, res, next) => {
    const jwtToken = req.cookies.jwt;
    
    if ( !jwtToken ){
        return res.status( 403 ).json( { status: "FORBIDDEN", message: "Jwt not found" } );
    }

    try{
        const decoded = jwt.verify( jwtToken, process.env.JWT_SECRET );
        const data = await User.findById( decoded.id );
        const userBody = { ...decoded, coordinates : data.location.coordinates };
        req.user = userBody;
        next();
    }
    catch ( err ){
        console.log( "error validating jwt: " + err.message );
        return res.status( 401).json( { status: "FORBIDDEN", message: "Invalid Token" })
    }
}