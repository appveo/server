function init(app, models, basePath){
    app.get(basePath, function(req, res){
        res.status(401).json({error: "Unauthorized"});
    });

    app.post(basePath, function (req, res) {
        if(!models.functions.checkRequiredFields(['name', 'mail', 'password'], req.body, res)) return;

        var user = new models.User({
            registered: true,
            name: req.body.name,
            mail: req.body.mail,
            passwordHash: models.User.generatePasswordHash(req.body.password)
        });

        user.save(function(err){
            if(err) {
                res.json(err);
                return;
            }

            models.User.find({}, function(err2, docs){
                if(!err2){
                    res.json(docs);
                }else{
                    res.json({error: true, msg: "An internal Database error occured."});
                }
            })
        });
    });
}

module.exports = init;