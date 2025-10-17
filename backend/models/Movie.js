import mongoose, {Schema} from "mongoose";

const MovieSchema = new Schema({
    _ID : Schema.Types.ObjectId,
    title : "string",
    year : "number",
    genre : "string",
    watched : "boolean",
    rating : "number",
    creatAt : {type: Date},
});
