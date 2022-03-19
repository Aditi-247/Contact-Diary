const nodeMailer= require('../config/nodemailer');
const accesstoken = require('../Models/verifiedtokens');


exports.newuserverify = (user,access,name)=>{
    console.log('inside');

    let htmlString=nodeMailer.renderTemplate({user:user,accesstoken:access,username:name},'/user_verify/verifyuser.ejs');


    nodeMailer.transporter.sendMail({
        from:'"Contact_Diary" <diraycontactbook@gmail.com',
        to:user,
        subject:'User Verification Link',
        html:htmlString,
       
    },(err,info)=>{
        if(err){
            console.log('error in sending mail',err);
            return;
        }
        console.log('mail delivered',info);
        return;
    });
}

exports.forgetpass = (user,access)=>{
    console.log('inside');

    let htmlString=nodeMailer.renderTemplate({user:user,accesstoken:access},'/user_verify/forgetpass.ejs');


    nodeMailer.transporter.sendMail({
        from:'"Contact_Diary" <diraycontactbook@gmail.com>',
        to:user,
        subject:'Forget Password Link',
        html:htmlString,
       
    },(err,info)=>{
        if(err){
            console.log('error in sending mail',err);
            return;
        }
        console.log('mail delivered',info);
        return;
    });
}
