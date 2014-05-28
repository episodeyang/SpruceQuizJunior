'use strict';

angular.module('modelServices', ['resourceProvider'])
    .factory('Model', ['$rootScope', 'Users', 'Questions', 'Answers', 'Comments', 'AnswerComments', 'Books', 'Sessions', 'Students', 'Parents', 'Teachers', 'Admins', 'Superadmins',
        'Schools', 'Units', 'Materials',
        /**
         * model factory
         *
         * The goal of this implementation is for better abstraction and simpler interface with frontend
         *      It is achieved through over loading different functions
         *      It also calls the resources on each call to achieve refreshed data presentation
         *      It needs to serve the following user types:
         *      {public: 1, student: 2, parent: 4, teacher: 8, admin: 16, superadmin: 32}
         *
         * @alias ModelFactory
         * @author test
         * @param random
         */
            function ($rootScope, Users, Questions, Answers, Comments, AnswerComments, Books, Sessions, Students, Parents, Teachers, Admins, Superadmins, Schools, Units, Materials) {
            var modelInstance = {};

            // helper mapping
            var nameToResource = {
                'student': Students,
                'parent': Parents,
                'teacher': Teachers,
                'admin': Admins,
                'superadmin': Superadmins,
                'school': Schools,
                'session': Sessions,
                'unit': Units,
                'material': Materials
            };

            modelInstance.Users = Users;
            modelInstance.Questions = Questions;

            /**
             * @alias Model.destroy()
             * Handle for destroy the model instance. Is called later during log out
             */
            modelInstance.destroy = function () {
                // do nothing
            };
            /**
             * @alias Model.init()
             * init function will initialize some of the most basic and commonly assessed components
             * that are needed by the UI
             * note that some fields will be over written and some may not be written depending on
             * the user role and specific user settings
             */
            modelInstance.init = function (user) {
                console.log('model initialized');
                modelInstance.user = user;
                modelInstance.question = {};
                modelInstance.questions = [];
            };

            /** helper function that gets the role string by looking up the object defined for the roles
             * @param value
             * @param obj
             * @returns {*}
             */
            modelInstance.reverseRoleLookup = function (value, obj) {
                for (var key in obj) {
                    if (obj[key] === value) {
                        console.log(obj[key]);
                        console.log(key);
                        return key;
                    }
                }
                console.log("messup up and didn't find anything!", value);
                return null;
            };

            // helper function to get sections of indicated types.
            var getDataHelper = function (typeDb, typeItem, idList) {

                // NOTE: this is an important dependency
                var typeLookup = 'on' + typeItem.toUpperCase() + 's';

                var sections = new Array();
                for (var anId in idList) {
                    // this is just to prevent the controller from not abiding by the calling rules
                    try {
                        var newSections = nameToResource[typeDb][typeLookup].get({id: anId});
                    } catch (err) {
                        console.log(err.message);
                    }
                    sections.push(newSections);
                }
                return sections;
            };

            modelInstance.getVoteStatus = function (model) {
                if (modelInstance.user) {
                    model.votedup = _.contains(model.voteup, modelInstance.user.username)
                    model.voteddown = _.contains(model.votedown, modelInstance.user.username)
                } else {
                    model.votedup = false;
                    model.voteddown = false;
                }
            }
            modelInstance.getQuestionVoteStatus = function () {
                modelInstance.getVoteStatus(modelInstance.question);
            };

            modelInstance.attachAnswerComments = function () {

                function dichotomizer(answerComments, answer) {
                    var acceptList = [], rejectList = [];

                    function arbitrator(answerComment) {
//                        console.log(answerComment.answerId);
//                        console.log(answer.id);
//                        console.log(answerComment.answerId.valueOf() === answer.id)
                        if (answerComment.answerId.valueOf() === answer.id) {
                            acceptList.push(answerComment);
                        }
                        else {
                            rejectList.push(answerComment)
                        }
                    };

                    _.each(answerComments, arbitrator);

                    return [acceptList, rejectList]
                }

                function attachByAnswerId(answer) {
//                    console.log(dichotomizer(modelInstance.question.answerComments, answer))
                    var tuple = dichotomizer(modelInstance.question.answerComments, answer)
                    answer.comments = tuple[0];
                    modelInstance.question.answerComments = tuple[1];
                }

//                _.map(modelInstance.question.answerComments, modelInstance.getVoteStatus)
                _.each(modelInstance.question.answers, attachByAnswerId)
            }

            modelInstance.getQuestion = function (id) {
                Questions.get(
                    {id: id},
                    function (question) {
                        modelInstance.question = question;
                        modelInstance.getQuestionVoteStatus();
                        _.map(modelInstance.question.answers, modelInstance.getVoteStatus)
                        _.map(modelInstance.question.comments, modelInstance.getVoteStatus)
                        _.map(modelInstance.question.answerComments, modelInstance.getVoteStatus)
                        modelInstance.attachAnswerComments();
                    }, function (err) {
                        $rootScope.error = err;
                    });
            };
            modelInstance.queryQuestions = function (query) {
                Questions.query(
                    query,
                    function (questions) {
                        modelInstance.questions = questions;
                    },
                    function (err) {
                        $rootScope.error = err;
                    });
            };
            modelInstance.createQuestion = function (question, success, error) {
                Questions.create(question, function (result) {
                    modelInstance.question = result;
                    if (typeof success != 'undefined') {
                        success(result);
                    }
                }, function (err) {
                    $rootScope.error = err;
                    if (typeof error != 'undefined') {
                        error(err);
                    }
                });
            };
            modelInstance.saveQuestion = function (question, success, error) {
//                if (question._id) {$rootScope.error = "udpate does not have object id."}
                Questions.save(
                    question,
                    function (q) {
                        _.extend(modelInstance.question, q);
                        if (typeof success != 'undefined') {
                            success(q)
                        }
                    }, function (err) {
                        $rootScope.error = err;
                        if (typeof error != 'undefined') {
                            error(err)
                        }
                    });
            };
            modelInstance.removeQuestion = function (question, success, error) {
                Questions.remove(question, function (res) {
//                    console.log('removal success');
                    modelInstance.question = {};
                    modelInstance.queryQuestions();
                    if (typeof success != 'undefined') {
                        success();
                    }
                }, function (err) {
                    $rootScope.error = err;
                    if (typeof error != 'undefined') {
                        error();
                    }
                });
            };

            modelInstance.voteup = function (question) {
                var q = {
                    id: question._id,
                    voteup: 'true'
                }
                modelInstance.saveQuestion(q, modelInstance.getQuestionVoteStatus);
            }
            modelInstance.votedown = function (question) {
                var q = {
                    id: question._id,
                    votedown: 'true'
                }
                modelInstance.saveQuestion(q, modelInstance.getQuestionVoteStatus);
            }

            modelInstance.queryStickyQuestions = function () {
                modelInstance.queryQuestions({
                    //TODO: nothing here yet. will need stickys.
                });
            }

            modelInstance.addAnswer = function (answer, success, error) {
                var ans = {
                    id: modelInstance.question._id,
                    text: answer.text
                };
                Answers.add(
                    ans,
                    function (results) {
                        modelInstance.question.answers = results.answers;
                        _.each(modelInstance.question.answers, modelInstance.getVoteStatus);
                        if (typeof success != 'undefined') {
                            success(results);
                        }
                    }, function (err) {
                        $rootScope.error = err;
                        if (typeof error != 'undefined') {
                            error(err);
                        }
                        ;
                    }
                );
            }
            modelInstance.updateAnswer = function (answer, success, error) {
                var ans = {
                    id: modelInstance.question._id,
                    answerId: answer.id,
                    text: answer.text
                };
                Answers.save(
                    ans,
                    function (results) {
                        modelInstance.question.answers = results.answers;
                        _.each(modelInstance.question.answers, modelInstance.getVoteStatus);
                        if (typeof success != 'undefined') {
                            success(results);
                        }
                    }, function (err) {
                        $rootScope.error = err;
                        if (typeof error != 'undefined') {
                            error(err);
                        }
                    }
                )
            };
            modelInstance.removeAnswer = function (answer, success, error) {
                var ans = {
                    id: modelInstance.question._id,
                    answerId: answer.id
                };
                Answers.remove(
                    ans,
                    function (results) {
                        modelInstance.question.answers = results.answers;
                        _.each(modelInstance.question.answers, modelInstance.getVoteStatus);
                        if (typeof success != 'undefined') {
                            success(results);
                        }
                    }, function (err) {
                        $rootScope.error = err;
                        if (typeof error != 'undefined') {
                            error(err);
                        }
                    }
                )
            };
            modelInstance.voteupAnswer = function (answer) {
                var ans = {
                    id: modelInstance.question._id,
                    answerId: answer.id,
                    "voteup": 'true'
                }

                function callback(result) {
                    _.extend(modelInstance.question, result);
                    _.each(modelInstance.question.answers, modelInstance.getVoteStatus);
                }

                Answers.save(ans, callback);
            }
            modelInstance.votedownAnswer = function (answer) {
                var ans = {
                    id: modelInstance.question._id,
                    answerId: answer.id,
                    "votedown": 'true'
                }

                function callback(result) {
                    _.extend(modelInstance.question, result);
                    _.each(modelInstance.question.answers, modelInstance.getVoteStatus);
                }

                Answers.save(ans, callback);
            }

            modelInstance.addComment = function (comment, success, error) {
                var query = {
                    id: modelInstance.question._id,
                    text: comment.text
                };
                Comments.add(
                    query,
                    function (results) {
                        modelInstance.question.comments = results.comments;
                        _.each(modelInstance.question.comments, modelInstance.getVoteStatus);
                        if (typeof success != 'undefined') {
                            success(results);
                        }
                    }, function (err) {
                        $rootScope.error = err;
                        if (typeof error != 'undefined') {
                            error(err);
                        }
                        ;
                    }
                );
            }
            modelInstance.updateComment = function (comment, success, error) {
                /**
                 * extend the comment object with the query id, then post to the api call.
                 */
                var query = {
                    id: modelInstance.question._id,
                    commentId: comment.id,
                };
                _.extend(comment, query)
                Comments.save(
                    comment,
                    function (results) {
                        modelInstance.question.comments = results.comments;
                        _.each(modelInstance.question.comments, modelInstance.getVoteStatus);
                        if (typeof success != 'undefined') {
                            success(results);
                        }
                    }, function (err) {
                        $rootScope.error = err;
                        if (typeof error != 'undefined') {
                            error(err);
                        }
                        ;
                    }
                )
            }
            modelInstance.removeComment = function (comment, success, error) {
                /**
                 * extend the comment object with the query id, then post to the api call.
                 */
                var query = {
                    id: modelInstance.question._id,
                    commentId: comment.id
                };
                Comments.remove(
                    query,
                    function (results) {
                        modelInstance.question.comments = results.comments;
                        _.each(modelInstance.question.comments, modelInstance.getVoteStatus);
                        if (typeof success != 'undefined') {
                            success(results);
                        }
                    }, function (err) {
                        $rootScope.error = err;
                        if (typeof error != 'undefined') {
                            error(err);
                        }
                        ;
                    }
                );
            }
            modelInstance.voteupComment = function (comment, success, error) {
                var query = {
                    id: modelInstance.question._id,
                    commentId: comment.id,
                    "voteup": 'true'
                }
                Comments.save(
                    query,
                    function (results) {
                        modelInstance.question.comments = results.comments;
                        _.each(modelInstance.question.comments, modelInstance.getVoteStatus);
                        if (typeof success != 'undefined') {
                            success(results);
                        }
                    }, function (err) {
                        $rootScope.error = err;
                        if (typeof error != 'undefined') {
                            error(err);
                        }
                        ;
                    }
                );
            }
            modelInstance.votedownComment = function (comment, success, error) {
                var query = {
                    id: modelInstance.question._id,
                    commentId: comment.id,
                    "votedown": 'true'
                }
                Comments.save(
                    query,
                    function (results) {
                        modelInstance.question.comments = results.comments;
                        _.each(modelInstance.question.comments, modelInstance.getVoteStatus);
                        if (typeof success != 'undefined') {
                            success(results);
                        }
                    }, function (err) {
                        $rootScope.error = err;
                        if (typeof error != 'undefined') {
                            error(err);
                        }
                        ;
                    }
                );
            }


            modelInstance.addAnswerComment = function (comment, answer, success, error) {
                var query = {
                    id: modelInstance.question._id,
                    answerId: answer.id,
                    text: comment.text
                };
                AnswerComments.add(
                    query,
                    function (results) {
                        modelInstance.question.answerComments = results.answerComments;
                        _.each(modelInstance.question.answerComments, modelInstance.getVoteStatus);
                        modelInstance.attachAnswerComments();
                        if (typeof success != 'undefined') {
                            success(results);
                        }
                    }, function (err) {
                        $rootScope.error = err;
                        if (typeof error != 'undefined') {
                            error(err);
                        }
                        ;
                    }
                );

            }
            modelInstance.updateAnswerComment = function (comment, success, error) {
                /**
                 * extend the comment object with the query id, then post to the api call.
                 */
                var query = {
                    id: modelInstance.question._id,
                    answerId: comment.answerId,
                    commentId: comment.id,
                };
                _.extend(comment, query)
                AnswerComments.save(
                    comment,
                    function (results) {
                        modelInstance.question.answerComments = results.answerComments;
                        _.each(modelInstance.question.answerComments, modelInstance.getVoteStatus);
                        modelInstance.attachAnswerComments();
                        if (typeof success != 'undefined') {
                            success(results);
                        }
                    }, function (err) {
                        $rootScope.error = err;
                        if (typeof error != 'undefined') {
                            error(err);
                        }
                        ;
                    }
                )
            }
            modelInstance.removeAnswerComment = function (comment, success, error) {
                /**
                 * extend the comment object with the query id, then post to the api call.
                 */
                var query = {
                    id: modelInstance.question._id,
                    answerId: comment.answerId,
                    commentId: comment.id
                };
                AnswerComments.remove(
                    query,
                    function (results) {
                        modelInstance.question.answerComments = results.answerComments;
                        _.each(modelInstance.question.answerComments, modelInstance.getVoteStatus);
                        modelInstance.attachAnswerComments();
                        if (typeof success != 'undefined') {
                            success(results);
                        }
                    }, function (err) {
                        $rootScope.error = err;
                        if (typeof error != 'undefined') {
                            error(err);
                        }
                        ;
                    }
                );
            }
            modelInstance.voteupAnswerComment = function (comment, success, error) {
                var query = {
                    id: modelInstance.question._id,
                    answerId: comment.answerId,
                    commentId: comment.id,
                    "voteup": 'true'
                }
                AnswerComments.save(
                    query,
                    function (results) {
                        modelInstance.question.answerComments = results.answerComments;
                        _.each(modelInstance.question.answerComments, modelInstance.getVoteStatus);
                        modelInstance.attachAnswerComments();
                        if (typeof success != 'undefined') {
                            success(results);
                        }
                    }, function (err) {
                        $rootScope.error = err;
                        if (typeof error != 'undefined') {
                            error(err);
                        }
                        ;
                    }
                );
            }
            modelInstance.votedownAnswerComment = function (comment, success, error) {
                var query = {
                    id: modelInstance.question._id,
                    answerId: comment.answerId,
                    commentId: comment.id,
                    "votedown": 'true'
                }
                AnswerComments.save(
                    query,
                    function (results) {
                        modelInstance.question.answerComments = results.answerComments;
                        _.each(modelInstance.question.answerComments, modelInstance.getVoteStatus);
                        modelInstance.attachAnswerComments();
                        if (typeof success != 'undefined') {
                            success(results);
                        }
                    }, function (err) {
                        $rootScope.error = err;
                        if (typeof error != 'undefined') {
                            error(err);
                        }
                        ;
                    }
                );
            };

            function timeLapsed(time) {
                var dt = Date.now() - new Date(time);
                // console.log(dt);
                var oneSecond = 1000;
                var oneMinute = oneSecond * 60;
                var oneHour = oneMinute * 60;
                var oneDay = oneHour * 24;
                var oneWeek = oneDay * 7;
                var oneMonth = oneDay * 30;
                var oneYear = oneDay * 365;
                var timeString;

                if (dt >= oneYear) {
                    timeString = Math.floor(dt / oneYear) + ' 年';
                } else if (dt >= oneMonth) {
                    timeString = Math.floor(dt / oneMonth) + ' 月';
                } else if (dt >= oneWeek) {
                    timeString = Math.floor(dt / oneWeek) + ' 周';
                } else if (dt >= oneDay) {
                    timeString = Math.floor(dt / oneDay) + ' 天';
                } else if (dt >= oneHour) {
                    timeString = Math.floor(dt / oneHour) + ' 小时';
                } else if (dt >= oneMinute) {
                    timeString = Math.floor(dt / oneMinute) + ' 分钟';
                } else if (dt >= oneSecond) {
                    timeString = Math.floor(dt / oneSecond) + ' 秒';
                }

                // console.log(timeString);
                return timeString;
            }

            var feedTypeDict = {
                questionGet: {
                    tagText: "阅读",
                    url: "/questions/"
                },
                questionEdit: {
                    tagText: "编辑",
                    url: '/questions/'
                },
                questionAdd: {
                    tagText: "提问",
                    url: '/questions/'
                },
                questionVote: {
                    upVote: {
                        tagText: "投赞",
                        url: '/questions/'
                    },
                    downVote: {
                        tagText: "投踩",
                        url: '/questions/'
                    },
                    removeUpVote: {
                        tagText: "取消",
                        url: '/questions/'
                    },
                    removeDownVote: {
                        tagText: "取消",
                        url: '/questions/'
                    }
                },
                answerAdd: {
                    tagText: "回答",
                    url: '/questions/'
                },
                commentAdd: {
                    tagText: "评论",
                    url: '/questions/'
                },
                questionRemove: {
                    tagText: '删除',
                    url: '/questions/deleted/'
                }
            };

            function getTagText(feed) {
                // console.log(feed);
                var refList = feed.actionType.split('.');
                var ref = feedTypeDict;
                while (refList.length > 0) {
                    ref = ref[refList.splice(0, 1)];
                }
                return ref;
                // console.log(ref);
            }

            function feedFormatter(feeds) {
                var timeStrings;
                _.each(
                    feeds,
                    function (feed) {
//                        console.log(feed);
                        timeStrings = timeLapsed(feed.time).split(' ');
                        feed.timeNumber = timeStrings[0];
                        feed.timeUnit = timeStrings[1];

                        try {
                            feed.tagText = getTagText(feed).tagText;
                            feed.url = feedTypeDict[feed.actionType].url + feed.data.id;
                        } catch (e) {
                        }
                    }
                );
            }

            modelInstance.getUserFeeds = function (username) {
                var query = {
                    username: username
                };

                function success(feedBucket) {
                    modelInstance.userFeed = feedBucket;
                    feedFormatter(modelInstance.userFeed.feeds);
                }

                function error(err) {
                    $rootScope.error = err;
                }

                Users.getFeeds(query, success, error);
            };

            modelInstance.profile = {};
            modelInstance.getUserProfile = function (username, success, error) {
                var query = {};
                if (!username) {
                    query.username = modelInstance.user.username;
                } else {
                    query.username = username;
                }

                var callbackStack;

                function setup(success, error) {
                    callbackStack = {};
                    if (success) {
                        callbackStack.success = success;
                    }
                    if (error) {
                        callbackStack.error = error;
                    }
                }

                function successCallback(user) {
                    _.extend(modelInstance.profile, user);
                    if (callbackStack.success) {
                        callbackStack.success(user)
                    }
                }

                function errorCallback(err) {
                    $rootScope.error = err;
                    if (callbackStack.error) {
                        callbackStack.error(err);
                    }
                }

                function getCallbackConstructor(success) {
                    return function (user) {
                        //console.log(user);
                        modelInstance.profile = _.extend(
                            {
                                addSession: addSession,
                                removeSession: removeSession,
                                addBook: addBook,
                                removeBook: removeBook,
                                save: save
                            },
                            user);
                        if (success) {
                            success(user);
                        }
                    }
                }

                function addSession(id, success, error) {
                    var query = {
                        add: { _id: id },
                        username: modelInstance.profile.username
                    };

                    setup(success, error);
                    Users.updateSessions(query, successCallback, errorCallback);
                }

                function removeSession(id, success, error) {
                    var query = {
                        remove: { _id: id },
                        username: modelInstance.profile.username
                    };
                    setup(success, error);
                    Users.updateSessions(query, successCallback, errorCallback);
                }

                function addBook(bookData, success, error) {
                    var query = {
                        add: {
                            _id: bookData._id
                        },
                        username: modelInstance.profile.username
                    };
                    setup(success, error);
                    Users.updateBooks(query, successCallback, errorCallback);
                }

                function removeBook(bookData, success, error) {
                    var query = {
                        remove: { _id: bookData._id },
                        username: modelInstance.profile.username
                    };
                    setup(success, error);
                    Users.updateBooks(query, successCallback, errorCallback);
                }

                function save(success, error) {
                    var query = _.omit(
                        modelInstance.profile,
                        ['_id', 'save', 'addSession', 'removeSession',
                            'addBook', 'removeBook']
                    );

                    setup(getCallbackConstructor(success), error);
                    Users.save(query, successCallback, errorCallback);
                }

                setup(getCallbackConstructor(success), error);
                Users.get(query, successCallback, errorCallback);
            };


            modelInstance.books = {};
            modelInstance.getBooks = function (query, success, error) {
                var callbackStack;

                function setup(success, error) {
                    callbackStack = {};
                    if (success) {
                        callbackStack.success = success;
                    }
                    if (error) {
                        callbackStack.error = error;
                    }
                }

                function successCallback(books) {
                    _.extend(modelInstance.books, books);
                    if (callbackStack.success) {
                        callbackStack.success(books)
                    }
                }

                function errorCallback(err) {
                    $rootScope.error = err;
                    if (callbackStack.error) {
                        callbackStack.error(err);
                    }
                }

                function getCallback(success) {
                    return function (books) {
                        modelInstance.books = _.extend(
                            {},
                            books);
                        if (success) {
                            success(session);
                        }
                    };
                }

                setup(getCallback(success), error);
                Books.query(query, successCallback, errorCallback);
            }

            modelInstance.book = {};
            modelInstance.createBook = function (title, authors, success, error) {
                var query = {
                    title: title,
                    authors: authors
                };

                function successCallback(book) {
                    modelInstance.book = book;
                    if (success) {
                        return success(book);
                    }
                }

                function errorCallback(err) {
                    $rootScope.error = err;
                    if (error) {
                        return error(err);
                    }
                }

                Books.create(query, successCallback, errorCallback);
            };
            modelInstance.getBook = function (bookId, title, authorName, success, error) {
                var query = {};
                if (bookId) {
                    // console.log('getting the book! ');
                    query = {bookId: bookId};
                    setup(getCallback, error);
                    Books.get(query, successCallback, errorCallback);
                } else if (title) {
                    // console.log('querrying the books! ');
                    query.title = title;
                    if (authorName) {
                        query.authorName = authorName;
                    }
                    setup(queryCallback, error);
                    Books.query(query, successCallback, errorCallback);
                }

                var callbackStack;
                function setup(success, error) {
                    callbackStack = {
                        success: success,
                        error: error
                    };
                }
                function successCallback(book) {
                    _.extend(modelInstance.book, book);
                    if (callbackStack.success) {
                        callbackStack.success(book)
                    }
                }
                function errorCallback(err) {
                    $rootScope.error = err;
                    if (callbackStack.error) {
                        callbackStack.error(err);
                    }
                }

                var methods = {
                    save: save,
                    addQuestion: addQuestion,
                    removeQuestion: removeQuestion,
                    getQuestions: getQuestions,
                    getFeeds: getFeeds
                };
                function getCallback(book) {
                    modelInstance.book = _.extend(methods, book);

                    if (success) {
                        return success(book);
                    }
                }
                function queryCallback(books) {
                    modelInstance.book = _.extend(methods, books[0]);

                    if (success) {
                        return success(books[0]);
                    }
                }

                function save(success, error) {
                    var query = modelInstance.book;
                    query.id = query._id;
                    // delete query._id;
                    setup(success, error);
                    Books.save(query, successCallback, errorCallback);
                }
                function addQuestion(questionId, success, error) {
                    console.assert(modelInstance.book._id, "model.book doesn't have _id field");
                    setup(success, error);
                    Books.updateQuestions({add: {id: questionId}, bookId: modelInstance.book._id}, successCallback, errorCallback)
                }
                function removeQuestion(questionId, success, error) {
                    console.assert(modelInstance.book._id, "model.book doesn't have _id field");
                    setup(success, error);
                    Books.updateQuestions({pull: {id: questionId}, bookId: modelInstance.book._id}, successCallback, errorCallback)
                }
                function getQuestions(success, error) {
                    console.assert(modelInstance.book._id, "model.book doesn't have _id field");
                    setup(success, error);
                    Books.getQuestions({bookId: modelInstance.book._id}, successCallback, errorCallback);
                }
                function getFeeds(success, error) {
                    setup(success, error);
                    function callback(feeds) {
                        modelInstance.bookFeeds = feeds;
                        feedFormatter(modelInstance.bookFeeds.feeds);
                        if (success) {
                            success(modelInstance.bookFeeds);
                        }
                    }

                    setup(null, error);
                    console.assert(modelInstance.book._id, "model.book doesn't have _id field");
                    Books.getFeeds({bookId: modelInstance.book._id}, callback, errorCallback)
                }

            };

            modelInstance.getSchools = function () {
                function success(schools) {
                    modelInstance.schools = schools;
                }

                function error(err) {
                    $rootScope.error = err;
                }

                Schools.index({}, success, error);
            };

            modelInstance.getSessions = function () {
                function success(sessions) {
                    modelInstance.sessions = sessions;
                }

                function error(err) {
                    $rootScope.error = err;
                }

                Sessions.index({}, success, error);
            };

            modelInstance.session = {};
            modelInstance.createSession = function (session, callback) {
                function success(session) {
                    modelInstance.getSessions();
                    callback(null, session);
                }

                function error(err) {
                    $rootScope.error = err;
                    callback(err);
                }

                function validateAndSave(session) {
                    if (!session.name) {
                        return error('sessionHaveNoName');
                    }
                    if (!session.subject) {
                        return error('sessionHaveNoSubject');
                    }
                    if (!session.school) {
                        return error('sessionHaveNoSchool');
                    }
                    Sessions.save(session, success, error);
                }

                validateAndSave(session);
            };
            modelInstance.getSession = function (id, success, error) {
                var query = { sessionId: id };

                var callbackStack;

                function setup(success, error) {
                    callbackStack = {};
                    if (success) {
                        callbackStack.success = success;
                    }
                    if (error) {
                        callbackStack.error = error;
                    }
                }

                function successCallback(session) {
                    _.extend(modelInstance.session, session);
                    if (callbackStack.success) {
                        callbackStack.success(session)
                    }
                }

                function errorCallback(err) {
                    $rootScope.error = err;
                    if (callbackStack.error) {
                        callbackStack.error(err);
                    }
                }

                function getCallback(session) {
                    modelInstance.session = _.extend(
                        {
                            save: save,
                            addQuestion: addQuestion,
                            removeQuestion: removeQuestion,
                            getQuestions: getQuestions,
                            getFeeds: getFeeds
                        },
                        session);

                    if (success) {
                        success(session);
                    }
                }

                function addQuestion(questionId, success, error) {
                    setup(success, error);
                    Sessions.updateQuestions({add: {id: questionId}, sessionId: id}, successCallback, errorCallback)
                }

                function removeQuestion(questionId, success, error) {
                    setup(success, error);
                    Sessions.updateQuestions({pull: {id: questionId}, sessionId: id}, successCallback, errorCallback)
                }

                function getQuestions(success, error) {
                    setup(success, error);
                    Sessions.getQuestions({sessionId: query.sessionId}, successCallback, errorCallback);
                }

                function getFeeds(success, error) {
                    setup(success, error);
                    function callback(feeds) {
                        modelInstance.sessionFeeds = feeds;
                        feedFormatter(modelInstance.sessionFeeds.feeds);
                        if (success) {
                            success(modelInstance.sessionFeeds);
                        }
                    }

                    setup(null, error);
                    Sessions.getFeeds({sessionId: query.sessionId}, callback, errorCallback)
                }

                function save(success, error) {
                    setup(success, error);
                    var query = {
                        sessionId: modelInstance.session._id,
                        name: modelInstance.session.name,
                        teachers: modelInstance.session.teachers,
                        overview: modelInstance.session.overview,
                        tags: modelInstance.session.tags
                    };

                    Sessions.save(query, successCallback, errorCallback);
                }

                setup(getCallback, error);
                Sessions.get(query, successCallback, errorCallback);
            };

            /**
             * Utilities
             */
            modelInstance.stripHtml = function (string, maxLength) {
                /**
                 * following code from http://www.rishida.net/tools/conversion/conversionfunctions.js
                 * the applet is at: http://www.rishida.net/tools/conversion/
                 * @param n
                 * @returns {string}
                 */
                function dec2char(n) {
                    // converts a single string representing a decimal number to a character
                    // note that no checking is performed to ensure that this is just a hex number, eg. no spaces etc
                    // dec: string, the dec codepoint to be converted
                    var result = '';
                    if (n <= 0xFFFF) {
                        result += String.fromCharCode(n);
                    }
                    else if (n <= 0x10FFFF) {
                        n -= 0x10000
                        result += String.fromCharCode(0xD800 | (n >> 10)) + String.fromCharCode(0xDC00 | (n & 0x3FF));
                    }
                    else {
                        result += 'dec2char error: Code point out of range: ' + dec2hex(n);
                    }
                    return result;
                }

                function convertDecNCR2Char(str) {
                    // converts a string containing &#...; escapes to a string of characters
                    // str: string, the input

                    // convert up to 6 digit escapes to characters
                    str = str.replace(/&#([0-9]{1,7});/g,
                        function (matchstr, parens) {
                            return dec2char(parens);
                        }
                    );
                    return str;
                }

                if (!string) {
                    return null;
                }
                if (!maxLength) {
                    var maxLength = 300
                }
                string = convertDecNCR2Char(string)
                string = string.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>?/gi, " ");
                return string.slice(0, maxLength);
            }
            return modelInstance;
        }

    ]);


var jsdoc = 'hello';
