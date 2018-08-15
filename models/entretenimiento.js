var bcrypt = require("bcrypt-nodejs");
var mongoose = require("mongoose");
var entretenimientoSchema = mongoose.Schema({
    nombre:{type: String,require:true},
    descripcion:{type:String,require:true},
    direccion:{type:String,require:true},
    date:{type:Date,require:true}
});

var Entretenimiento = mongoose.model("Entretenimiento",entretenimientoSchema);
module.exports = Entretenimiento;