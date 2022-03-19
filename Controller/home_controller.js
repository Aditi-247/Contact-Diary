const Contact = require('../Models/contact');


// fetching contact of their respective user from databse
module.exports.home = async function(req,res){
    console.log(req.user.id);
    try{
        let allcontacts = await Contact.find({user:req.user.id}).sort({name:1}).exec();         
            // console.log(Contacts);
            return res.render('home',{
            title: 'CD | HOME',
            contact_list : allcontacts
           });
    }catch(err){
        console.log('error in fetching Contacts from database', err);
        return;
    }
};

// action for landing page
module.exports.landing = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/user/profile');
     };
     return res.render('landing',{
        title: 'Contact Diary'   
    });
};

// For rendering contact form
module.exports.addContacts = function(req,res){
    return res.render('add_contact',{
    title:" CD | Add Contacts",
    // user:req.user
   });
};

// creating contact 
module.exports.createcontact =  async function(req,res){
    console.log(req.user.id);
    try{
        let contact = await Contact.create({
            name: req.body.name,
            phone: req.body.phone,
            email: req.body.email,
            add: req.body.add,
            dob: req.body.dob,
            relation: req.body.relation, 
            user : req.user.id,
            isAdded: 'Contact Save Successfully !'
        });
        console.log('*********', contact);
        return res.redirect('home')
    }catch(err){
            console.log('error in creating contact', err);
            return;
        }
};
// for deleting the contact
module.exports.deletecontact = async function(req,res){
    try{
        let id = await req.query.id;
        console.log(id);
        await Contact.findByIdAndDelete(id);
        isAdded: 'Successfully Contact deleted !';
        return res.redirect('back');
         
    } catch (err){
         console.log('error in deleting an object from database', err);
         return;
    } 
};