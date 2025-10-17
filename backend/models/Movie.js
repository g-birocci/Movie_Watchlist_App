import mongoose, {now, Schema} from "mongoose";

const MovieSchema = new Schema({
    _ID : Schema.Types.ObjectId,
    title : {type: String},
    year : {type : Number},
    genre : {type: String},
    watched : {type : Boolean, default: false},
    rating : {type : Number},
    creatAt : {type: Date, default: Date.now},
});
