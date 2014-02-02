'use strict';
/**
 * @fileOverview User Model
 * @memberOf User
 * @type {exports}
 */

define(['underscore', 'passport', 'passport-local', 'validator', '../rolesHelper',
    './SchemaModels'],
    function (_, passport, passportLocal, validator, rolesHelper, SchemaModels) {
        var LocalStrategy = passportLocal.Strategy;
        var userRoles = rolesHelper.userRoles;
        var QuestionM = SchemaModels.Question,
            UserM = SchemaModels.User,
            StudentM = SchemaModels.Student,
            ParentM = SchemaModels.Parent,
            TeacherM = SchemaModels.Teacher,
            AdminM = SchemaModels.Admin,
            SuperadminM = SchemaModels.Superadmin;

        var check = validator.check;

        return {
            addUser: function (username, password, role, params, callback) {
                UserM.findOne({ username: username }, function (err, duplicate) {
                    if (err) {
                        console.log("An error occurred in checking User database.");
                    } else {
                        if (duplicate) {
                            console.log("User already exists");
                            return callback("UserAlreadyExists");
                        } else {
                            var user = new UserM({
                                username: username,
                                password: password,
                                role: role,
                                student: null,
                                parent: null,
                                teacher: null,
                                admin: null,
                                superadmin: null
                            });
                            var userObject;
                            if (role.bitMask === userRoles.student.bitMask) {
                                userObject = new StudentM({
                                    name: params.name,
                                    DOB: params.DOB,
                                    email: params.email
                                });
                                userObject.save();
                                user.student = userObject._id;
                            } else if (role.bitMask === userRoles.parent.bitMask) {
                                userObject = new ParentM({
                                    name: params.name,
                                    email: params.email
                                });
                                userObject.save();
                                user.parent = userObject._id;
                            } else if (role.bitMask === userRoles.teacher.bitMask) {
                                userObject = new TeacherM({
                                    name: params.name,
                                    email: params.email
                                });
                                userObject.save();
                                user.teacher = userObject._id;
                            } else if (role.bitMask === userRoles.admin.bitMask) {
                                userObject = new AdminM({
                                    name: params.name,
                                    email: params.email
                                });
                                userObject.save();
                                user.admin = userObject._id;
                            } else if (role.bitMask === userRoles.superadmin.bitMask) {
                                userObject = new SuperadminM({
                                    name: params.name,
                                    email: params.email
                                });
                                userObject.save();
                                user.superadmin = userObject._id;
                            } else {
//                        console.log("/register invalid role");
//                        console.log(role);
                                return callback('InvalidRole.' + role.title);
                            }
//                    user.userId =userObject.id;
                            user.save(function (err) {
                                if (err) {
                                    console.log("An error occurred in saving new user to database.");
                                } else {
                                    return callback(null, user);
                                }
                            });
                        }
                    }
                });
            }
        };
    });


