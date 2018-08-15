var bcrypt = require("bcrypt-nodejs");
var mongoose = require("mongoose");
var hotelSchema = mongoose.Schema({
    nombre:{type: String,require:true},
    descripcion:{type:String,require:true},
    direccion:{type:String,require:true},
    numero:{type:String,require:true},
    calidad:{type:Number,require:true},
    
    
});

var Hotel = mongoose.model("Hotel",hotelSchema);
module.exports = Hotel;