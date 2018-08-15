var bcrypt = require("bcrypt-nodejs");
var mongoose = require("mongoose");

var SALT_FACTOR=10;

var usuarioSchema = mongoose.Schema({
    username:{type: String,require: true,unique:true},
    password:{type:String,require:true},
    role:{type:String,require:true},
    createdat:{type:Date, default:Date.now},
});

var donothing=()=>{

}

usuarioSchema.pre("save",function(done){
    var usuario = this;
    if(!usuario.isModified("password")){
        return done();
    }
    bcrypt.genSalt(SALT_FACTOR,(err,salt)=>{
        if(err){
            return done(err);
        }
        bcrypt.hash(usuario.password,salt,donothing,(err,hashedpassword)=>{
            if(err){
                return done(err);
            }
            usuario.password = hashedpassword;
            done();
        });
    });
});

usuarioSchema.methods.checkPassword = function(guess,done){
    bcrypt.compare(guess,this.password,function(err,isMatch){
        done(err,isMatch);
    });

}

usuarioSchema.methods.name=function(){
    return this.displayname || this.username;
}

var Usuarios = mongoose.model("Usuario",usuarioSchema);
module.exports = Usuarios;