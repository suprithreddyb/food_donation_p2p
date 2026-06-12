import { model, Schema } from "mongoose";


const applicationSchema = new Schema({
    volunteerId : {
        type : Schema.Types.ObjectId,
        ref : "user",
        required : true
    },
    orderId : {
        type : Schema.Types.ObjectId,
        ref : "order",
        required : true
    },
    status: {
        type : String,
        enum : [ "pending", "accepted", "rejected" ],
        default : "pending"
    },
    volunteerLocation : {
        type : {
            type : String,
            enum : [ "Point" ],
            default : "Point"
        },
        coordinates : {
            type : [ Number ],
            required : true
        }
    },
    distance : Number,
    utm: {
      source: String,
      medium: String,
      campaign: String,
      term: String,
      content: String
    }
  },
  { timestamps: true }
)

export const Application = model( "application", applicationSchema )