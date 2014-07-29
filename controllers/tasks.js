function init(app, models, basePath){
    app.get(basePath, function(req, res){
        models.Task
            .find({creator: req.user._id}, '-__v')
            .populate("project", '-__v')
            .exec(function(err, docs){
                if(!err){
                    res.json(docs);
                }else{
                    res.json({error: true});
                }
        });
    });

    app.get(basePath + "/byProject/:id", function(req, res){
        models.Task
            .findOne({creator: req.user._id, project: req.params.id}, '-__v')
            .populate("project", '-__v')
            .exec(function(err, docs){
                if(!err){
                    res.json(docs);
                }else{
                    res.json({error: true});
                }
            });
    });

    app.post(basePath, function(req, res){

        var proj = new models.Project({
            name: req.body.name,
            creator: req.user._id
        });

        proj.save(function(err, docs){
            if(!err){
                res.json(docs);
            }else{
                res.json({error: true});
            }
        });
    });

    app.get(basePath + "/:id", function(req, res){
        models.Task
            .findOne({creator: req.user._id, _id: req.params._id}, '-__v')
            .populate("project", '-__v')
            .populate("creator", '-__v -passwordHash')
            .exec(function(err, docs){
                if(!err){
                    res.json(docs);
                }else{
                    res.json({error: true});
                }
            });
    });

    app.get(basePath + "/:id/start", function(req, res){
        models.Task
            .findOne({creator: req.user._id, _id: req.params.id}, '-__v', function(err, task){
                if(!err){
                    if(task != null){
                        if(!task.active){
                            task.lastActivated = Date.now;
                            task.active = true;

                            task.save(function(err2, data2){
                                if(!err){
                                    res.json(data2);
                                }else{
                                    res.status(500).json({error: true, msg: "Internal Database error."});
                                }
                            })
                        }else{

                        }
                    }else{
                        res.status(404).json({error: true, msg: "Task not found in User scope."});
                    }
                }else{
                    res.json({error: true});
                }
            });
    });

    app.get(basePath + "/:id/stop", function(req, res){
        models.Task
            .findOne({creator: req.user._id, _id: req.params.id}, '-__v', function(err, task){
                if(!err){
                    if(task != null){
                        if(task.active){
                            task.active = false;
                            task.elapsedTime += Math.ceil((Date.now().getTime() - task.lastActivated.getTime())/1000);

                            task.save(function(err2, data2){
                                if(!err2){
                                    res.status(200).json({error: false, elapsedTime: data2.elapsedTime});
                                }else{
                                    res.status(500).json({error: true, msg: "Internal Database error."});
                                }
                            })
                        }else{
                            res.status(200).json({error: false, elapsedTime: task.elapsedTime});
                        }
                    }else{
                        res.status(404).json({error: true, msg: "Task not found in User scope."});
                    }
                }else{
                    res.json({error: true});
                }
            });
    });

    app.put(basePath + "/:id", function(req, res){
        var updateFields = models.functions.createUpdateFields(['name', 'archived', 'deleted'], req.body, res);

        if(updateFields != false){
            models.Task.update({creator: req.user._id, _id: req.params._id}, updateFields, function(err, docs){
                if(!err){
                    res.json(docs);
                }else{
                    res.json({error: true});
                }
            });
        }
    });

    app.delete(basePath + "/:id", function(req, res){
        models.Task.remove({creator: req.user._id, _id: req.params._id}, function(err, docs){
            if(!err){
                res.json(docs);
            }else{
                res.json({error: true});
            }
        });
    });
}

module.exports = init;