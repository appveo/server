'use strict';

var app_root = __dirname,
    express = require("express"),
    bodyParser = require("body-parser"),
    staticServer = require("serve-static"),
    methodOverride = require("method-override"),
    errorHandler = require("errorhandler"),
    path = require("path"),
    models = require('./models'),
    auth = require("./auth")(models);

var app = express();

// Config
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(staticServer(path.join(app_root, "public")));
app.use(errorHandler({ dumpExceptions: true, showStack: true }));

// Auths
app.use("/api/projects", auth);
app.use("/api/tasks", auth);

// API
require("./controllers/users")(app, models, "/api/users");
require("./controllers/projects")(app, models, "/api/projects");
require("./controllers/sessions")(app, models, "/api/sessions");

// Launch server
app.listen(9001);