/**
 * @fileOverview User Controller
 * @module User
 * @type {exports}
 */
define(['underscore', '../models/SchemaModels', '../rolesHelper', "mongoose"],
    function (_, SchemaModels, rolesHelper, mongoose) {
        var UserM = SchemaModels.User;
        var userRoles = rolesHelper.userRoles;
        var ObjectId = mongoose.Types.ObjectId;
        return {
            index: function (req, res) {
                UserM.find({}, function(err, docs){
                    if (err) {
                        console.log(err);
                        return res.send(500, err);
                    } else {
                        return res.send(200, docs);
                    };
                })
            },
            add: function (req, res) {
                UserM.create(req.body, function (err, results) {
                    if (err) {
                        console.log(err);
                        return res.send(500, err);
                    };
                })
                    .then(function (question) {
                        res.location(req.route.path + '/' + question.id);
                        return res.send(201, question);
                    });
            },
            findOne: function (req, res) {
                if (!req.params.id) { return res.send(400); }
                UserM.findById(req.params.id, 'id role', function(err, results){
                    if (err) {return res.send(403, err)}
                    else {
                        return res.send(200, results);
                    };
                })
            },
            update: function (req, res) {
                if (!req.params.id) { return res.send(400); }
                UserM.findByIdAndUpdate(
                    ObjectId(req.params.id),
                    req.body,
                    {new: true},
                    function(err, results){
                        if (err) {return res.send(403, err)};
                        return res.send(201, results);
                });
            },
            removebyId: function (req, res) {
                if (!req.params.id) { return res.send(400); }
                UserM.findByIdAndRemove(
                    ObjectId(req.params.id),
                    function(err, results){
                        if (err) {return res.send(403, err)};
                        return res.send(204);
                    });
            }
        };
    });
