module.exports = function(models){
    return function(req, res, next){
        if(models.functions.checkRequiredFields(['api-key'], req.headers, res)){
            models.Session.findById(req.headers['api-key'], '-__v').populate('user', '-passwordHash -__v').exec(function(err, doc){
                if(!err){
                    doc.lastAccessed = Date.now();
                    doc.save(function(err2, doc2){
                        console.log(err2, doc2);
                    });

                    req.user = doc.user;
                    req.session = doc;

                    next();
                }else{
                    res.json({error: true, msg: "API Key doesn't exist. Please create a new session first."});
                }
            });
        }
    }
};