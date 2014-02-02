/**
 * @fileOverview User Controller
 * @module User
 * @type {exports}
 */
define(['underscore', '../models/SchemaModels', '../rolesHelper'],
    function (_, SchemaModels, rolesHelper) {
        var QuestionM = SchemaModels.Question;
        var userRoles = rolesHelper.userRoles;
        return {
            /**
             *
             * @api {get} /api/questions Request Questions
             * @apiName Question.index
             * @apiGroup Questions
             * @apiParam {Number} id Users unique ID.
             * @apiSuccess {String} firstname Firstname of the User.
             * @apiSuccess {String} lastname  Lastname of the User.
             * @apiSuccessExample Success-Response:
             *     HTTP/1.1 200 OK
             *     {
             *       "firstname": "John",
             *       "lastname": "Doe"
             *     }
             * @apiError UserNotFound The id of the User was not found.
             * @apiErrorExample Error-Response:
             *     HTTP/1.1 404 Not Found
             *     {
             *       "error": "UserNotFound"
             *     }
             */
            index: function (req, res) {
                console.log('got request to /api/problems, processing now.');
                console.log(req);
                res.json(200, {'message': 'got it?'});
            },
            /**
             * @api {post} /api/questions Create Question
             * @apiName CreateQuestion
             * @apiGroup Questions
             */
            add: function (req, res) {
                res.json(201, {'message': 'created! success!'});
//                QuestionM.create(req.body, function(err, results){
//                    if (err) {
//                        console.log(err)
//                        return res.send(403, err)}
//                    else {
//                        console.log(results)
//                        return res.send(200, results)
//                    };
//                })
            }
        };
    });
//            /**
//             * @api {get} /api/questions/:id Retrieve Question
//             * @apiName GetQuestion
//             * @apiGroup Questions
//             */
//            findOne: function (req, res) {
//                var question;
//                QuestionM.findById(req.params.id, 'title text authors tags comments answers', function(err, results){
//                    if (err) {return res.send(403, err)}
//                    else {
//                        console.log(results)
//                        return res.send(201, results)
//                    };
//                })
//            },
//            /**
//             * @api {post} /api/questions/:id Update Question
//             * @apiName UpdateQuestion
//             * @apiGroup Questions
//             */
//            update: function (req, res) {
//
//                console.log('add ');
//            },
//            /**
//             * @api {delete} /api/questions/:id Delete Question
//             * @apiName DeleteQuestion
//             * @apiGroup Questions
//             */
//            removebyId: function (req, res) {
//                console.log('add ');
//                UserM.remove({ id: req.params.id }, function (err) {
//                    if (err) {
//                        res.send(404, "Remove user failed.");
//                    }
//                });
//            }
