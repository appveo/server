// Mongoose initialisieren
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/hook_io');



/* ===========================================================
    Exports
   =========================================================== */
module.exports = {
    User: require('./user.js')(mongoose),
    Project: require('./project.js')(mongoose),
    Task: require('./task.js')(mongoose),
    Session: require('./session.js')(mongoose),
    functions: {
        checkRequiredFields: function(required, body, res){
            var missing = [];

            for (var i = 0; i < required.length; i++) {
                var obj = required[i];

                if(!body.hasOwnProperty(obj)){
                    missing.push(obj);
                }
            }

            if(missing.length > 0){
                res.status(400).json({error: true, msg: "Missing Fields", missing: missing});
                return false;
            }else{
                return true;
            }
        },
        createUpdateFields: function(allowed, body, res){
            var update = [];

            for (var i = 0; i < required.length; i++) {
                var obj = required[i];

                if(body.hasOwnProperty(obj)){
                    update[obj] = body[obj];
                }
            }

            if(allowed.length == 0){
                res.status(400).json({error: true, msg: "Missing Fields", allowed: allowed});
                return false;
            }else{
                return update;
            }
        }
    }
};