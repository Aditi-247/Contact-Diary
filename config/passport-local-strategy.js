const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../Models/user');
const bcrypt=require('bcrypt');

// passport.use(new LocalStrategy({
//     usernameField : 'email',
//     passReqToCallback:true
//    },
//   function(req,email,password,done){
//    User.findOne({email:email}, async function(err,user){
//        if(err){
//            console.log('Error in finding user ==> passport');
//            return done(err);
//        }
//        if(user){
//          let match = await bcrypt.compare(password,user.password);
//          if(!match){
//             console.log('error','Invalid username/password');
//             return done(null,false);
//          }
//        }
//         return done(null,user);
//      });
//    } 
// ));
passport.use(new LocalStrategy({
    usernameField:'email',
    passReqToCallback:true
},function(req,email,password,done){
     User.findOne({email:email,status:"Active"},async function(err,user){
        if(err){
            console.log('error',err);
            return done(err);
        }
        if(user){

            let match=await bcrypt.compare(password,user.password);
            if(!match){
                console.log('error','Andha h kya re!!');
                return done(null,false);
            }
        }
        return done(null,user);
    });
}
));
passport.serializeUser(function(user,done){
    done(null,user.id);
});
passport.deserializeUser(function(id,done){
    User.findById(id,(function(err,user){
     if(err){
        console.log('Error in finding user ==> passport');
        return done(err);  
    }
    return done(null,user);
  }));
});
passport.checkAuthentication = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    return res.redirect('/user/sign-in');
};
passport.setAuthenticatedUser = function(req,res,next){
    if(req.isAuthenticated()){
        res.locals.user = req.user;
    }
    next();
};
module.exports = passport;