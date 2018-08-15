var express = require("express");
var Usuario = require("./models/usuario");
var Entretenimiento = require("./models/entretenimiento");
var Hotel = require("./models/hotel");
var passport = require("passport");
var acl = require('express-acl');
var router = express.Router();


acl.config({
   
    defaultRole:'invitado',
    decodedObjectName:'usuario',
    roleSearchPath:'usuario.role'
})
router.use((req,res,next)=>{
    res.locals.currentUsuario = req.usuario;
    res.locals.errors=req.flash("error");
    res.locals.infos = req.flash("info");
    if(req.isAuthenticated()){
        req.session.role = req.usuario.role;
    }
    console.log(req.session);
    next();
});
router.use(acl.authorize);

router.get("/",(req,res,next)=>{
    Usuario.find()
    .sort({createAt:"descending"})
    .exec((err,usuarios)=>{
        if(err){
            return next (err);
        }
        res.render("index",{usuarios:usuarios});
    });
});


router.get("/singup",(req,res)=>{
    res.render("singup");
});
router.post("/singup",(req,res,next)=>{
    var username = req.body.username;
    var password = req.body.password;
    var role = req.body.role;

    Usuario.findOne({username:username}, function(err,usuario){
        if(err){
            return next(err);
        }
        if(usuario){
            req.flash("error","El nombre de usuario no esta disponible");
            return res.redirect("/singup");
        }
        var newUsuario = new Usuario({
            username:username,
            password:password,
            role:role
        });
        newUsuario.save(next);
        return res.redirect("/");
    });
});

router.get("/login",(req,res) =>{
    res.render("login");
});

router.post("/login",passport.authenticate("login",{
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
}));

router.get("/logout",(req, res) =>{
    req.logout();
    res.redirect("/");
});

router.get("/addentretenimiento",(req,res)=>{
    res.render("addentretenimiento");

});

router.post("/addentretenimiento",(req,res,next)=>{
    var nombre = req.body.nombre;
    var descripcion = req.body.descripcion;
    var direccion = req.body.direccion;
    var date = req.body.date;
        var newEntretenimiento = new Entretenimiento({
            nombre:nombre,
            descripcion:descripcion,
            direccion:direccion,
            date:date,
        });
        newEntretenimiento.save(next);
        return res.redirect("/entretenimientos");
    
});

router.get("/entretenimientos",(req,res,next)=>{
    Entretenimiento.find()
    .sort({createdAt: "descending"})
    .exec((err,entretenimientos)=>{
        if(err){
            return next (err);
        }
        res.render("entretenimientos",{entretenimientos:entretenimientos});
    });
});

router.get("/addhoteles",(req,res)=>{
    res.render("addhoteles");

});

router.post("/addhoteles",(req,res,next)=>{
    var nombre = req.body.nombre;
    var descripcion = req.body.descripcion;
    var direccion = req.body.direccion;
    var numero = req.body.numero;
    var calidad = req.body.calidad;
        var newHotel = new Hotel({
            nombre:nombre,
            descripcion:descripcion,
            direccion:direccion,
            numero:numero,
            calidad:calidad,
        });
        newHotel.save(next);
        return res.redirect("/hoteles");
    
});

router.get("/hoteles",(req,res,next)=>{
    Hotel.find()
    .sort({createdAt: "descending"})
    .exec((err,hoteles)=>{
        if(err){
            return next (err);
        }
        res.render("hoteles",{hoteles:hoteles});
    });
});



function ensureAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        next();
    }else{
        req.flash("info","Necesitas iniciar sesion..");
        res.redirect("/login");
    }
}

module.exports = router;