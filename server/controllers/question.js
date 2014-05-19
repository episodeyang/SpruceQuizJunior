/**
 * @fileOverview User Controller
 * @module User
 * @type {exports}
 * This `QuestionCtrl` module takes care of question related operations, such as
 *              question.index(),
 *              question.add(:id),
 *              question.findOne(:id, payload)
 *              question.update(:id, payload)
 *              question.remove(:id)
 *              etc.,
 *
 *
 */
define(['underscore', '../models/SchemaModels', '../models/Question', '../rolesHelper', "mongoose", "../models/FeedAPI"],
    function (_, SchemaModels, QuestionM, rolesHelper, mongoose, FeedAPI) {
        //var QuestionM = SchemaModels.Question;
        var userRoles = rolesHelper.userRoles;
        var ObjectId = mongoose.Types.ObjectId;
        return {
            /**
             *
             * @api {get} /api/questions Get Questions
             * @apiName IndexQuestion
             * @apiGroup Questions
             * @apiSuccess {Array} list of all questions.
             * @apiSuccessExample Success-Response:
             *     HTTP/1.1 200 OK
             *     [
             *      { title: '行程问题解法',
             *       text: 'some example text here',
             *       answers: [],
             *       comments: [],
             *       tags: [ '三年级', '数学', '二元一次方程' ],
             *       id: '52f6e14da7e331ff15fb4d13' },
             *      { title: '行程问题解法',
             *        text: 'some example text here',
             *        answers: [],
             *        comments: [],
             *       tags: [ '三年级', '数学', '二元一次方程' ],
             *       id: '52f6e5ff8021572716e3ee8f' },
             *     ]
             * @apiError UserNotFound The id of the User was not found.
             * @apiErrorExample Error-Response:
             *     HTTP/1.1 404 Not Found
             *     {
             *       "error": "UserNotFound"
             *     }
             */
            index: function (req, res) {
//                console.log('got request to /api/problems, processing now.');
                QuestionM
                    .find({}, function (err, docs) {
                        if (err) {
                            console.log(err);
                            return res.send(500, err);
                        } else {
                            return res.send(200, docs);
                        }
                    });
            },
            /**
             * @api {post} /api/questions Create Question
             * @apiName CreateQuestion
             * @apiGroup Questions
             */
            add: function (req, res) {
                var question = req.body;
                if (req.user.role.title != 'superadmin') {
                    question.dateCreated = Date.now();
                    delete question.voteup;
                    delete question.votedown;
                    delete question.comments;
                    delete question.answers;
                    question.author = { username: req.user.username };
                }
                QuestionM
                    .create(question, function (err, results) {
                        if (err) {
                            console.log(err);
                            return res.send(500, err);
                        }
                    })
                    .then(function (question) {
                        res.location(req.route.path + '/' + question.id);
                        FeedAPI.questionAdd(req.user, question);
                        return res.send(201, question);
                    });
            },
            /**
             * @api {get} /api/questions/:id Get A Specific Question
             * @apiName GetQuestion
             * @apiGroup Questions
             */
            findOne: function (req, res) {
                if (!req.params.id) {
                    return res.send(400);
                }
                QuestionM.findById(
                    req.params.id,
                    'id title text author tags sessions books vote voteup votedown comments answers answerComments dateEdited dateCreated',
                    function (err, question) {
                        if (err) {
                            return res.send(403, err);
                        } else {
                            FeedAPI.questionGet(req.user, question);
                            return res.send(200, question);
                        }
                    }
                );
            },
            /**
             * @api {post} /api/questions/:id Update Question
             * @apiName UpdateQuestion
             * @apiGroup Questions
             */
            update: function (req, res) {
                //console.log('request user object:')
                //console.log(req.user);
                if (!req.params.id) {
                    return res.send(400, 'noQuestionId');
                }
                var actionType;

                function voteQuestion(err, question) {
                    if (req.body.voteup === 'true') {
                        if (_.contains(question.voteup, req.user.username)) {
                            var update = {
                                $pull: {
                                    votedown: req.user.username,
                                    voteup: req.user.username
                                }
                            };
                            actionType = 'removeUpVote';
                        } else {
                            var update = {
                                $pull: {
                                    votedown: req.user.username
                                },
                                $push: {
                                    voteup: req.user.username
                                }
                            };
                            actionType = 'upVote';
                        }
                    }
                    if (req.body.votedown === 'true') {
                        if (_.contains(question.votedown, req.user.username)) {
                            var update = {
                                $pull: {
                                    votedown: req.user.username,
                                    voteup: req.user.username
                                }
                            };
                            actionType = 'removeDownVote';
                        } else {
                            var update = {
                                $pull: {
                                    voteup: req.user.username
                                },
                                $push: {
                                    votedown: req.user.username
                                }
                            };
                            actionType = 'downVote';
                        }
                    }

                    QuestionM.findByIdAndUpdate(
                        req.params.id,
                        update,
                        {select: 'title vote voteup votedown'},
                        function (err, result, n) {
                            var q = {
                                voteup: result.voteup,
                                votedown: result.votedown,
                                vote: result.vote
                            };
                            if (err) {
                                return res.send(500, err);
                            } else {
                                FeedAPI.questionVote(req.user, result)[actionType]();
                                return res.send(201, q);
                            }
                        }
                    );
                }

                if (req.body.voteup || req.body.votedown) {
                    if (req.body.voteup !== 'true' && req.body.votedown !== 'true') {
                        return res.send(403, 'cannotVoteUpAndDown');
                    } else {
                        QuestionM.findById(
                            req.params.id,
                            'title voteup votedown vote',
                            voteQuestion
                        );
                    }
                } else {
                    var update = {};
                    var fieldString = 'title ';
                    if (req.body.title) {
                        update.title = req.body.title;
                        fieldString += 'title ';
                    }
                    if (req.body.text) {
                        update.text = req.body.text;
                        fieldString += 'text ';
                    }
                    if (req.body.tags) {
                        update.tags = req.body.tags;
                        fieldString += 'tags ';
                    }
                    if (fieldString.length > 0) {
                        fieldString += 'dateEdited';
                    }
                    QuestionM.findByIdAndUpdate(
                        req.params.id,
                        update,
                        {
                            select: fieldString,
                            $currentDate: {dateEdited: true}
                        },
                        function (err, result, n) {
                            if (err) {
                                return res.send(500, err);
                            } else {
                                FeedAPI.questionEdit(req.user, result);
                                return res.send(201, result);
                            }
                        }
                    );
                }
            },
            /**
             * @api {delete} /api/questions/:id Delete Question
             * @apiName DeleteQuestion
             * @apiGroup Questions
             */
            removeById: function (req, res) {
                if (!req.params.id) {
                    return res.send(400);
                }
                QuestionM.findByIdAndRemove(
                    ObjectId(req.params.id),
                    function (err, results) {
                        if (err) {
                            return res.send(403, err)
                        }
                        ;
                        return res.send(204);
                    });
            }
        };
    });
