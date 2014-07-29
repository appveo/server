function init(app, models, basePath){
    app.get(basePath, function(req, res){
        models.Project.find({user: req.user}, function(err, docs){
            if(!err){
                res.json(docs);
            }else{
                res.json({error: true});
            }
        });
    });

    app.post(basePath, function(req, res){
        if(models.functions.checkRequiredFields(['mail', 'password', 'app'], req.body, res)){
            console.log(req.body);

            models.User.tryLogin(req.body.mail, req.body.password, function(success, data){
                if(success){
                    var session = new models.Session({
                        app: req.body.app,
                        user: data['_id']
                    });

                    session.save(function(err, data2){
                        if(!err){
                            res.json({error: false, key: data2['_id']});
                        }else{
                            res.json({error: true, msg: "An internal Database error occured"});
                        }
                    });
                }else{
                    if(data == 1){
                        res.json({error: true, msg: "Invalid credentials"});
                    }else{
                        res.json({error: true, msg: "An internal Database error occured"});
                    }
                }
            });
        }
    });
}

module.exports = init;