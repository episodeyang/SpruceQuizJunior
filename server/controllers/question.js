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
define(['underscore', 'async', '../models/SchemaModels', '../models/Question', '../models/Session', '../models/Book', '../rolesHelper', "mongoose", "../models/FeedAPI"],
    function (_, async, SchemaModels, QuestionM, SessionM, BookM, rolesHelper, mongoose, FeedAPI) {

        var userRoles = rolesHelper.userRoles;
        var ObjectId = mongoose.Types.ObjectId;
        var fieldString = '_id title text author tags sessions books vote voteup votedown comments answers answerComments dateEdited dateCreated';
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
             *       _id: '52f6e14da7e331ff15fb4d13' },
             *      { title: '行程问题解法',
             *        text: 'some example text here',
             *        answers: [],
             *        comments: [],
             *j      tags: [ '三年级', '数学', '二元一次方程' ],
             *       _id: '52f6e5ff8021572716e3ee8f' },
             *     ]
             * @apiError UserNotFound The id of the User was not found.
             * @apiErrorExample Error-Response:
             *     HTTP/1.1 404 Not Found
             *     {
             *       "error": "UserNotFound"
             *     }
             */
            search: function (req, res) {
                var query = {};
                if (req.query.authorUsername) {
                    query['author.username'] = req.query.authorUsername;
                } else if (req.query.answerAuthorUsername) {
                    query["answers.author.username"] = req.query.answerAuthorUsername;
                } else if (req.query.search) {
                }

                if (req.user) {
                    // record all search terms.
                }
                if (Object.keys(query).length != 0 || req.query.search) {
                    QuestionM
                        .find(query, function (err, docs) {
                            if (err) {
                                console.log(err);
                                return res.send(500, err);
                            } else {
                                return res.send(200, docs);
                            }
                        }).sort({dateCreated: -1}).limit(20);
                } else {
                    return res.send(400, 'needToSpecifySearchQueriesOrWrongQuery');
                }
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
                    question = _.omit(question, ['voteup', 'votedown', 'comments', 'answers']);
                    question.author = {
                        username: req.user.username,
                        name: req.user.name
                    };
                }

                // QuestionM.snapshot.add(question);
                QuestionM
                    .create(question, function (err, question) {
                        if (err) {
                            console.log(err);
                            return res.send(500, err);
                        }
                        var stack = [];
                        question = question.toObject();
                        function callback(error, result) {
                            if (error) {
                                console.log(error);
                            }
                        }

                        if (question.sessions) {
                            _.each(
                                question.sessions,
                                function (sessionId) {
                                    stack.push(function (callback) {
                                        SessionM.addQuestion({_id: sessionId}, question, callback);
                                    });
                                }
                            );
                        }
                        if (question.books) {
                            _.each(
                                question.books,
                                function (book) {
                                    stack.push(function (callback) {
                                        BookM.addQuestion(book, question, callback);
                                    });
                                }
                            );
                        }
                        function done(callback) {
                            res.location(req.route.path + '/' + question._id);
                            FeedAPI.questionAdd(req.user, question, question.sessions, question.books);
                            return res.send(201, question);
                        }

                        stack.push(done);
                        async.series(stack, callback);
                    });
            },
            /**
             * @api {get} /api/questions/:id Get A Specific Question
             * @apiName GetQuestion
             * @apiGroup Questions
             */
            findOne: function (req, res) {
                if (!req.params.id || req.params.id === "undefined") {
                    return res.send(400);
                }
                QuestionM.findById(req.params.id).select(fieldString).populate('sessions', 'name').exec(
                    function (err, question) {
                        if (err) {
                            return res.send(400, err);
                        } else {
                            FeedAPI.questionGet(req.user, question, question.sessions, question.books);
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
                if (!req.params.id || req.params.id === "undefined") {
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
                                FeedAPI.questionVote(req.user, question, question.sessions, question.books)[actionType]();
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
                    var question = req.body;
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
                        function (err, result) {
                            if (err) {
                                return res.send(500, err);
                            } else {
                                FeedAPI.questionEdit(req.user, result.toObject(), result.sessions, result.books);
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
                if (!req.params.id || req.params.id === "undefined") {
                    return res.send(400);
                }
                QuestionM.findById(
                    ObjectId(req.params.id),
                    function (err, question) {

                        function done(error) {
                            if (error) {
                                return res.send(403, error);
                            }
                            FeedAPI.questionRemove(req.user, question.toObject(), question.sessions, question.books);
                            return res.send(204);
                        }

                        if (question.answers.length >= 1 || question.comments.length >= 1) {
                            return done('canNotRemove:HasAnswersOrComments');
                        } else {
                            question.remove(done);
                        }
                    });
            }
        };
    });
