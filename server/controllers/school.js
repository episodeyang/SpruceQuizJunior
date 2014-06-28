/**
 * @fileOverview School Controller
 * @module School
 * @type {exports}
 * implements create, get, and index for schools in the database.
 */
define(['underscore', '../models/School', '../models/User', '../models/SchemaModels', '../rolesHelper'],
    function (_, SchoolM, UserM, SchemaModels, rolesHelper) {
        "use strict";
        var userRoles = rolesHelper.userRoles;
        var keyString = 'name type address zipCode state country overview url area foundingYear degrees tags 部委 teachers schools created edited';
        var StudentM = SchemaModels.Student;

        return {
            index: function (req, res) {
                SchoolM.find(
                    {},
                    'name type state country degrees tags',
                    function (err, schools) {
                        if (err) {
                            return res.json(404, err);
                        }
                        return res.json(200, schools);
                    }
                );
            },
            search: function (req, res) {
                if (!req.query.name) { return res.send(401, 'noSchoolName'); }
                var query = {
                    name: req.query.name
                };
                // console.log(query);
                SchoolM.find(
                    query,
                    keyString,
                    function (err, schools) {
                        if (err) {
                            return res.json(404, err);
                        }
                        return res.json(200, schools);
                    }
                );
            },
            getStats: function (req, res) {
                if (!req.params.name) { return res.send(401, 'noSchoolName'); }
                var query = {
                    name: req.params.name
                };
                StudentM.count({'schools': req.params.name}).count(function(err, count){
                    if (err) {
                        console.log(err);
                        return res.send(404, 'schoolNameNotFoundInStudents' + err);
                    }
                    res.send(
                        200,
                        {
                            studentCount: count
                        });
                });
            },
            get: function (req, res) {
                if (!req.params.name) { return res.send(401, 'noSchoolName'); }
                var query = {
                    name: req.params.name
                };
                SchoolM.findOne(
                    req.params.name,
                    keyString,
                    function (err, school) {
                        if (err) {
                            console.log(err);
                            return res.send(404, 'schoolNotFound ' + err);
                        }
                        res.send(200, school);
                    }
                );
            },
            create: function (req, res) {
                if (!req.body.name) { return res.send(401, 'noSchoolName'); }
                var data = req.body;
                data._id = data.name;
                SchoolM.add(
                    data,
                    function (err, school) {
                        if (err) {
                            console.log(err);
                            return res.send(404, 'request error' + err);
                        } else {
                            return res.send(201, school);
                        }
                    }
                );

            },
            update: function (req, res) {
                if (!req.params.name) { return res.send(401, 'noSchoolName'); }
                var data = req.body;
                delete data._id;
                delete data.name;
                SchoolM.findOneAndUpdate(
                    {_id: req.params.name},
                    data,
                    keyString,
                    function (err, school) {
                        if (err) {
                            console.log(err);
                            return res.send(404, err);
                        }
                        res.send(201, school);
                    }
                );
            },
            //Not routed.
            remove: function (req, res) {
                SchoolM.remove(
                    {_id: req.params.schoolId},
                    function (err) {
                        if (err) {
                            console.log(err);
                            return res.send(404, 'schoolNotFound');
                        }
                        res.send(201);
                    }
                );
            }
        };
    });
