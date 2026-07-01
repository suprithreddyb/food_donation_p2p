import { Schema, model } from "mongoose";

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: 'https://avatar.iran.liara.run/public'
    },
    phone: {
        type: String,
    },
    role: {
        type: String,
        enum : [ "user", "admin" ],
        default: 'user'
    },
    location: {
        type: {
            type : String,
            enum : [ "Point" ],
            default : "Point"
        },
        coordinates :{
            type : [ Number ],
            default : [ 0, 0 ]
        }
    }
    
}, { timestamps: true })

userSchema.index ( { location : "2dsphere" } );

export const User =  model('user', userSchema);

