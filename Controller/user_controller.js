const User = require('../Models/user');
const forget=require('../Models/forgettokens');
const path = require('path');
const linkmail= require('../mailers/verifyuser');
const fs = require('fs');
const bcrypt = require('bcrypt');
const saltr=3; 
const crypto = require('crypto');
const accesstoken = require('../Models/verifiedtokens');


module.exports.profile = async function(req,res){
    let profile = await User.findById(req.user.id);
    console.log(profile.name);
    return res.render('user_profile',{
        title:'CD | Profile',
        profile: profile
     })
};
module.exports.update = function(req,res){
    return res.render('update_profile',{
        title:'CD | Update Profile'
     })
};
module.exports.updatep = async function(req,res){
    try{
        console.log(req.user.id);
        let user = await User.findById(req.user.id);
        console.log(user.name);
        User.uploadedAvatar(req,res,function(err){
            if(err){
                console.log('****Multer Error', err)
            }
            console.log('name ',req.body.name);
            user.name = req.body.name;
            user.phone = req.body.phone;
            user.bio = req.body.bio;
            console.log('value updated');
            if(req.file){
                if(user.avatar){
                    fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                };
                // this is svaing the path of the uploaded file into the avatr field in the user
                user.avatar = User.avatarPath + '/' + req.file.filename;
            }
            user.save();
            console.log('okkkkkkkkk');
            return res.redirect('/user/profile');
        });
    }catch(err){
        console.log(err);
        return res.redirect('back');
    }
}

module.exports.signUp = function(req,res){
    if(req.isAuthenticated()){
       return res.redirect('/user/profile');
    };
    console.log('ok');
    return res.render('contact_sign_up',{
        title:"CD | Sign Up",
        isAdded:''
    });
};
module.exports.signIn = function(req,res){
    if(req.isAuthenticated()){
       return res.redirect('/user/profile');
    };
    return res.render('contact_sign_in',{
        title:"CD| Sign In",
        isAdded:''
    });
};
// get the sign up data
module.exports.create = async function(req,res){
    try {
        let existuser = await User.findOne({email:req.body.email,status:"Active"});
        if(existuser){
            return res.render('contact_sign_up',{
                title:"CD| Sign Up",
                isAdded:'Email Already Exist'
            });
        }
        let existuserss = await User.findOne({email:req.body.email,status:"Pending"});
        if(existuserss){
            let del = await User.findOneAndDelete({email:existuserss.email});
        }

        let existusers = await User.findOne({email:req.body.email});
        let newuser;
        if(!existusers){
            let hashpass = await bcrypt.hash(req.body.password, saltr);
            newuser = await User.create({
                email:req.body.email,
                name:req.body.name,
                password:hashpass,
                status:"Pending",
                isAdded:'Sign Up Succesfully!'
            });
        }

        let setat;
        console.log(newuser);
        if(newuser){
            setat=await accesstoken.create({
                userid:newuser.id,
                accesstokenvalue:crypto.randomBytes(120).toString('hex'),
                isvalid:true
            });
        }
        setat = await accesstoken.findOne({userid:newuser.id});
        console.log(newuser.email);
        console.log(setat);
    
        linkmail.newuserverify(newuser.email,setat.accesstokenvalue,newuser.name);

        return res.render('calllink',{
            title:"CD | Thank You",
            isAdded:'check your mail'
        });   
  }catch(err){
      console.log(err);
      return;
  }
};
module.exports.createSession = function(req,res){
    // req.flash('success', "Logged in Successfully");
    isAdded:"Logged in Successfully";
    return res.redirect('/home');
};
module.exports.verify = async function(req,res){
    try{
      const accesstokenvalue = req.params.accesstokenvalue;
      console.log('got the token',accesstokenvalue);
      let userstoken = await accesstoken.findOne({accesstokenvalue,isvalid:true});
      console.log('token mil gya',userstoken.userid);
      if(userstoken){
          let updatetoken = await accesstoken.findOneAndUpdate({userid:userstoken.userid},{isvalid:false});
          let updateactive = await User.findByIdAndUpdate(userstoken.userid,{status:"Active"});
          let updateuser = await User.findById(userstoken.userid);
          console.log('updated ',updateuser);
        
          // here changes---------------------------------------------------------
          return res.redirect('/user/sign-in');
      }
    }catch(err){
        console.log(err);
    }
};

module.exports.forgetpage= function(req,res){
    return res.render('forget',{
        title:"CD | Forget Page",
        isAddedpass:""
    });
};

module.exports.forgetpass=async function(req,res){
    userexist=await User.findOne({email:req.body.email});
    if(userexist){
        tokenpass= await forget.create({
            email:req.body.email,
            accesstokenvalue:crypto.randomBytes(120).toString('hex'),
            isvalid:true
        });
        let forgetuser = await forget.findOne({email:req.body.email});
        console.log('user h',forgetuser);
        linkmail.forgetpass(req.body.email,forgetuser.accesstokenvalue);
        return res.render('calllink.ejs',{
            title:"CD  | Thank You"
        });
    }
    else{
        return res.render('forget',{
            title:"Forget Password",
            isAddedpass:"Email not Found"
        });
    }
   
};
 module.exports.updatepass=async function(req,res){
     try{
         const accesstokenvalue=req.params.accesstokenvalue;
         const email=req.params.email;
 
         console.log(email,'got the token',accesstokenvalue);
         let userstoken=await forget.findOne({accesstokenvalue,isvalid:true});
         console.log('token mil gya',userstoken.email);
         if(userstoken){
             return res.render('passchange',{
                 title:"CD | New Pass",
                 user:userstoken.email,
                 error:""
             });
         }
       }catch(err){
           console.log(err);
       }
 
 };
 
 module.exports.newpass=async function(req,res){
     let hashpass = await bcrypt.hash(req.body.password, saltr);
     
     let updated = await User.findOneAndUpdate({email:req.body.email,status:"Active"},{password:hashpass}); 
     let updatetoken = await forget.findOneAndUpdate({email:req.body.email},{isvalid:false});  
     if(updated){
         return res.render('contact_sign_in',{
             title:"CD | Sign-In",
             isAdded:"Password Updated !"
         })
     }
 
 };
 
module.exports.destroySession = function(req,res){
    req.logout();
    // isAdded:'Logout';
    return res.redirect('/');
}