module.exports.setFlash = function(req,res,next){
    res.locals.setFlash = {
        'success' : req.flash('success'),
        'error' : req.flash('error')
    }
    next();
}