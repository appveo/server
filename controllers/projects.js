function init(app, models, basePath){
    app.get(basePath, function(req, res){
        models.Project
            .find({creator: req.user._id}, '-__v')
            .populate("creator", "-__v -passwordHash")
            .exec(function(err, docs){
                if(!err){
                    res.json(docs);
                }else{
                    res.json({error: true, msg: "An internal Database error occured."});
                }
        });
    });

    app.post(basePath, function(req, res){
        if(models.functions.checkRequiredFields(['name'], req.body, res)){
            var proj = new models.Project({
                name: req.body.name,
                creator: req.user._id
            });

            proj.save(function(err, docs){
                if(!err){
                    res.status(201).json(docs);
                }else{
                    res.json({error: true, msg: "An internal Database error occured."});
                }
            });
        }
    });

    app.get(basePath + "/:id", function(req, res){
        models.Project
            .find({creator: req.user._id, _id: req.params.id}, '-__v')
            .populate("creator", "-__v -passwordHash")
            .exec(function(err, docs){
                if(!err){
                    res.json(docs);
                }else{
                    res.json({error: true, msg: "An internal Database error occured."});
                }
            });
    });

    app.put(basePath + "/:id", function(req, res){
        var updateFields = models.functions.createUpdateFields(['name', 'archived', 'deleted'], req.body, res);

        if(updateFields != false){
            models.Project.update({creator: req.user._id, _id: req.params._id}, updateFields, function(err, docs){
                if(!err){
                    res.json(docs);
                }else{
                    res.json({error: true});
                }
            });
        }
    });

    app.delete(basePath + "/:id", function(req, res){
        models.Project.update({creator: req.user._id, _id: req.params._id}, {deleted: true}, function(err, docs){
            if(!err){
                res.json(docs);
            }else{
                res.json({error: true});
            }
        });
    });
}

module.exports = init;