// TypeScript with Mongoose
import { Schema, model } from "mongoose";

const orderSchema = new Schema(
  {
    type: { type : String, enum : [ "donation", "request" ], required : true },
    ownerLocation: {
      type: {
        type : String, 
        enum : [ "Point" ],
        default : "Point"
      },
      coordinates : {
        type : [ Number ],
        required : true
      }
    },
    volunteerLocation: {
      type: {
        type : String, 
        enum : [ "Point" ],
        default : "Point"
      },
      coordinates : [ Number ]
    },
    qty : { type : Number, required : true },
    distance : Number,
    ownerId: { type: Schema.Types.ObjectId, ref: "user", default: null },
    volunteerId: { type: Schema.Types.ObjectId, ref: "user", default: null },
    expiresAt: { type: Date, default: null },
    urgency: {
      type : Number,
      enum : [ 0, 1, 2 ]
    },
    isActive: { type: Boolean, default: true },
    utm: {
      source: String,
      medium: String,
      campaign: String,
      term: String,
      content: String,
    }
  },
  { timestamps: true }
);

orderSchema.index( { ownerLocation : "2dsphere" } );

export const Order = model("order", orderSchema );