'use strict';

angular.module('modelServices', ['resourceProvider'])
    .factory('Model', ['$rootScope', 'Users', 'Questions', 'Answers', 'Comments', 'AnswerComments', 'Students', 'Parents', 'Teachers', 'Admins', 'Superadmins',
        'Schools', 'Sections', 'Units', 'Materials',
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
        function ($rootScope, Users, Questions, Answers, Comments, AnswerComments, Students, Parents, Teachers, Admins, Superadmins,
                  Schools, Sections, Units, Materials) {
            var modelInstance = {};

            // helper mapping
            var nameToResource = {
                'student': Students,
                'parent': Parents,
                'teacher': Teachers,
                'admin': Admins,
                'superadmin': Superadmins,
                'school': Schools,
                'section': Sections,
                'unit': Units,
                'material': Materials
            };

            modelInstance.Users = Users;
            modelInstance.Questions = Questions;

            /**
             * @alias Model.destroy()
             * Handle for destroy the model instance. Is called later during log out
             */
            modelInstance.destroy = function() {
                // do nothing
            }
            /**
             * @alias Model.init()
             * init function will initialize some of the most basic and commonly assessed components
             * that are needed by the UI
             * note that some fields will be over written and some may not be written depending on
             * the user role and specific user settings
             */
            modelInstance.init = function (user) {
                console.log('model initialized')
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
                var typeLookup = 'on'+typeItem.toUpperCase()+'s';

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
            }

            modelInstance.getVoteStatus = function(model){
                if (modelInstance.user) {
                    model.votedup = _.contains(model.voteup, modelInstance.user.username)
                    model.voteddown = _.contains(model.votedown, modelInstance.user.username)
                } else {
                    model.votedup = false;
                    model.voteddown = false;
                }
            }
            modelInstance.getQuestionVoteStatus = function(){
                modelInstance.getVoteStatus(modelInstance.question);
            };

            modelInstance.attachAnswerComments = function () {

                function dichotomizer (answerComments, answer) {
                    var acceptList = [], rejectList = [];

                    function arbitrator (answerComment) {
//                        console.log(answerComment.answerId);
//                        console.log(answer.id);
//                        console.log(answerComment.answerId.valueOf() === answer.id)
                        if (answerComment.answerId.valueOf() === answer.id) {
                            acceptList.push(answerComment);
                        }
                        else {rejectList.push(answerComment)}
                    };

                    _.each(answerComments, arbitrator);

                    return [acceptList, rejectList]
                }
                function attachByAnswerId (answer) {
//                    console.log(dichotomizer(modelInstance.question.answerComments, answer))
                    var tuple = dichotomizer(modelInstance.question.answerComments, answer)
                    answer.comments = tuple[0] ;
                    modelInstance.question.answerComments = tuple[1];
                }
//                _.map(modelInstance.question.answerComments, modelInstance.getVoteStatus)
                _.each(modelInstance.question.answers, attachByAnswerId)
            }

            modelInstance.getQuestion = function(id) {
                Questions.get(
                    {id:id},
                    function(question){
                        modelInstance.question = question;
                        modelInstance.getQuestionVoteStatus();
                        _.map(modelInstance.question.answers, modelInstance.getVoteStatus)
                        _.map(modelInstance.question.comments, modelInstance.getVoteStatus)
                        _.map(modelInstance.question.answerComments, modelInstance.getVoteStatus)
                        modelInstance.attachAnswerComments();
                    }, function(err){
                        $rootScope.error = err;
                    } );
            };
            modelInstance.queryQuestions = function(query) {
                Questions.query(
                    query,
                    function (questions) {
                        modelInstance.questions = questions;
                    },
                    function (err) {
                        $rootScope.error = err;
                    });
            };
            modelInstance.createQuestion = function(question, success, error) {
                Questions.create(question, function(result){
                    modelInstance.question = result;
                    if (typeof success != 'undefined') { success(result); };
                }, function(err){
                    $rootScope.error = err;
                    if (typeof error != 'undefined') { error(err); };
                } );
            };
            modelInstance.saveQuestion = function(question, success, error) {
//                if (question.id) {$rootScope.error = "udpate does not have object id."}
                Questions.save(question, function(q){
                    _.extend(modelInstance.question, q);
                    if (typeof success != 'undefined') { success(q) };
                }, function(err){
                    $rootScope.error = err;
                    if (typeof error != 'undefined') { error(err) };
                } );
            };
            modelInstance.removeQuestion = function(question, success, error) {
                Questions.remove(question, function(res){
//                    console.log('removal success');
                    modelInstance.question = {};
                    modelInstance.queryQuestions();
                    if (typeof success != 'undefined') {success();}
                }, function(err){
                    $rootScope.error = err;
                    if (typeof error != 'undefined') { error(); }
                } );
            };

            modelInstance.voteup = function(question) {
                var q = {
                    id: question.id,
                    voteup: 'true'
                }
                modelInstance.saveQuestion(q, modelInstance.getQuestionVoteStatus);
            }
            modelInstance.votedown = function(question) {
                var q = {
                    id: question.id,
                    votedown: 'true'
                }
                modelInstance.saveQuestion(q, modelInstance.getQuestionVoteStatus);
            }

            modelInstance.queryStickyQuestions = function() {
                modelInstance.queryQuestions({
                    //TODO: nothing here yet. will need stickys.
                });
            }

            modelInstance.addAnswer = function(answer, success, error) {
                var ans = {
                    id: modelInstance.question.id,
                    text: answer.text
                };
                Answers.add(
                    ans,
                    function(results){
                        modelInstance.question.answers = results.answers;
                        _.each(modelInstance.question.answers, modelInstance.getVoteStatus);
                        if (typeof success != 'undefined') { success(results); }
                    }, function(err) {
                        $rootScope.error = err;
                        if (typeof error != 'undefined') { error(err); };
                    }
                );
            }
            modelInstance.updateAnswer = function(answer, success, error) {
                var ans = {
                    id: modelInstance.question.id,
                    answerId: answer.id,
                    text: answer.text
                };
                Answers.save(
                    ans,
                    function( results ) {
                        modelInstance.question.answers = results.answers;
                        _.each(modelInstance.question.answers, modelInstance.getVoteStatus);
                        if (typeof success != 'undefined') { success(results); }
                    }, function( err ) {
                        $rootScope.error = err;
                        if (typeof error != 'undefined') { error(err); };
                    }
                )
            }
            modelInstance.removeAnswer = function(answer, success, error) {
                var ans = {
                    id: modelInstance.question.id,
                    answerId: answer.id
                };
                Answers.remove(
                    ans,
                    function( results ) {
                        modelInstance.question.answers = results.answers;
                        _.each(modelInstance.question.answers, modelInstance.getVoteStatus);
                        if (typeof success != 'undefined') { success(results); }
                    }, function( err ) {
                        $rootScope.error = err;
                        if (typeof error != 'undefined') { error(err); };
                    }
                )
            }
            modelInstance.voteupAnswer = function(answer) {
                var ans = {
                    id: modelInstance.question.id,
                    answerId: answer.id,
                    "voteup": 'true'
                }
                function callback (result)  {
                    _.extend(modelInstance.question, result);
                    _.each(modelInstance.question.answers, modelInstance.getVoteStatus);
                }
                Answers.save(ans, callback );
            }
            modelInstance.votedownAnswer = function(answer) {
                var ans = {
                    id: modelInstance.question.id,
                    answerId: answer.id,
                    "votedown": 'true'
                }
                function callback (result)  {
                    _.extend(modelInstance.question, result);
                    _.each(modelInstance.question.answers, modelInstance.getVoteStatus);
                }
                Answers.save(ans, callback );
            }

            modelInstance.addComment = function (comment, success, error) {
                var query = {
                    id: modelInstance.question.id,
                    text: comment.text
                };
                Comments.add(
                    query,
                    function(results){
                        modelInstance.question.comments = results.comments;
                        _.each(modelInstance.question.comments, modelInstance.getVoteStatus);
                        if (typeof success != 'undefined') { success(results); }
                    }, function(err) {
                        $rootScope.error = err;
                        if (typeof error != 'undefined') { error(err); };
                    }
                );
            }
            modelInstance.updateComment = function (comment, success, error) {
                /**
                 * extend the comment object with the query id, then post to the api call.
                 */
                var query = {
                    id: modelInstance.question.id,
                    commentId: comment.id,
                };
                _.extend(comment, query)
                Comments.save(
                    comment,
                    function( results ) {
                        modelInstance.question.comments = results.comments;
                        _.each(modelInstance.question.comments, modelInstance.getVoteStatus);
                        if (typeof success != 'undefined') { success(results); }
                    }, function( err ) {
                        $rootScope.error = err;
                        if (typeof error != 'undefined') { error(err); };
                    }
                )
            }
            modelInstance.removeComment = function (comment, success, error) {
                /**
                 * extend the comment object with the query id, then post to the api call.
                 */
                var query = {
                    id: modelInstance.question.id,
                    commentId: comment.id
                };
                Comments.remove(
                    query,
                    function( results ) {
                        modelInstance.question.comments = results.comments;
                        _.each(modelInstance.question.comments, modelInstance.getVoteStatus);
                        if (typeof success != 'undefined') { success(results); }
                    }, function( err ) {
                        $rootScope.error = err;
                        if (typeof error != 'undefined') { error(err); };
                    }
                );
            }
            modelInstance.voteupComment = function (comment, success, error) {
                var query = {
                    id: modelInstance.question.id,
                    commentId: comment.id,
                    "voteup": 'true'
                }
                Comments.save(
                    query,
                    function( results ) {
                        modelInstance.question.comments = results.comments;
                        _.each(modelInstance.question.comments, modelInstance.getVoteStatus);
                        if (typeof success != 'undefined') { success(results); }
                    }, function( err ) {
                        $rootScope.error = err;
                        if (typeof error != 'undefined') { error(err); };
                    }
                );
            }
            modelInstance.votedownComment = function (comment, success, error) {
                var query = {
                    id: modelInstance.question.id,
                    commentId: comment.id,
                    "votedown": 'true'
                }
                Comments.save(
                    query,
                    function( results ) {
                        modelInstance.question.comments = results.comments;
                        _.each(modelInstance.question.comments, modelInstance.getVoteStatus);
                        if (typeof success != 'undefined') { success(results); }
                    }, function( err ) {
                        $rootScope.error = err;
                        if (typeof error != 'undefined') { error(err); };
                    }
                );
            }


            modelInstance.addAnswerComment = function (comment, answer, success, error) {
                var query = {
                    id: modelInstance.question.id,
                    answerId: answer.id,
                    text: comment.text
                };
                AnswerComments.add(
                    query ,
                    function(results){
                        modelInstance.question.answerComments = results.answerComments;
                        _.each(modelInstance.question.answerComments, modelInstance.getVoteStatus);
                        modelInstance.attachAnswerComments();
                        if (typeof success != 'undefined') { success(results); }
                    }, function(err) {
                        $rootScope.error = err;
                        if (typeof error != 'undefined') { error(err); };
                    }
                );

            }
            modelInstance.updateAnswerComment = function (comment, success, error) {
                /**
                 * extend the comment object with the query id, then post to the api call.
                 */
                var query = {
                    id: modelInstance.question.id,
                    answerId: comment.answerId,
                    commentId: comment.id,
                };
                _.extend(comment, query)
                AnswerComments.save(
                    comment,
                    function( results ) {
                        modelInstance.question.answerComments = results.answerComments;
                        _.each(modelInstance.question.answerComments, modelInstance.getVoteStatus);
                        modelInstance.attachAnswerComments();
                        if (typeof success != 'undefined') { success(results); }
                    }, function( err ) {
                        $rootScope.error = err;
                        if (typeof error != 'undefined') { error(err); };
                    }
                )
            }
            modelInstance.removeAnswerComment = function (comment, success, error) {
                /**
                 * extend the comment object with the query id, then post to the api call.
                 */
                var query = {
                    id: modelInstance.question.id,
                    answerId: comment.answerId,
                    commentId: comment.id
                };
                AnswerComments.remove(
                    query,
                    function( results ) {
                        modelInstance.question.answerComments = results.answerComments;
                        _.each(modelInstance.question.answerComments, modelInstance.getVoteStatus);
                        modelInstance.attachAnswerComments();
                        if (typeof success != 'undefined') { success(results); }
                    }, function( err ) {
                        $rootScope.error = err;
                        if (typeof error != 'undefined') { error(err); };
                    }
                );
            }
            modelInstance.voteupAnswerComment = function (comment, success, error) {
                var query = {
                    id: modelInstance.question.id,
                    answerId: comment.answerId,
                    commentId: comment.id,
                    "voteup": 'true'
                }
                AnswerComments.save(
                    query,
                    function( results ) {
                        modelInstance.question.answerComments = results.answerComments;
                        _.each(modelInstance.question.answerComments, modelInstance.getVoteStatus);
                        modelInstance.attachAnswerComments();
                        if (typeof success != 'undefined') { success(results); }
                    }, function( err ) {
                        $rootScope.error = err;
                        if (typeof error != 'undefined') { error(err); };
                    }
                );
            }
            modelInstance.votedownAnswerComment = function (comment, success, error) {
                var query = {
                    id: modelInstance.question.id,
                    answerId: comment.answerId,
                    commentId: comment.id,
                    "votedown": 'true'
                }
                AnswerComments.save(
                    query,
                    function( results ) {
                        modelInstance.question.answerComments = results.answerComments;
                        _.each(modelInstance.question.answerComments, modelInstance.getVoteStatus);
                        modelInstance.attachAnswerComments();
                        if (typeof success != 'undefined') { success(results); }
                    }, function( err ) {
                        $rootScope.error = err;
                        if (typeof error != 'undefined') { error(err); };
                    }
                );
            }

            // TODO: Model.getSchools(Model.user) or () <= function(model){ If (model==undefined) {model = Model.user;}};
            // TODO: need to understand the undefined case better.
            //      handle input cases of :
            //          model == undefined => model = Model.user
            /**
             * this one gets the school based on the user object passed in
             *      note that this doesn't have to be the same as the user object which gives
             *          flexibility
             *      also note that the backend database API will implement the constraints
             *
             *      could be used for refreshing data upon updating the database.
             *
             * @param userParam
             */
            modelInstance.getSchools = function (userParam) {
                if (modelInstance.user.roleTitle!== 'superadmin') {
                    modelInstance.schools = nameToResource[modelInstance.user.roleTitle].onSchools.get({id: userParam.id});
                } else {
                    // super admin
                    modelInstance.schools = Schools.onSchools.list();
                }
            };

            //TODO: Model.getSections(Model.user) or () <= function(model){ If (model==undefined) {model = Model.user;}};

            /**
             * get the sections of different user (each with separate logic)
             *
             * for admins, the method is overloaded with the second parameter which specifies the type and the list desired
             * The subject list must follow the following format:
             *    subjectList.type is a type, like 'student', or 'unit'
             *    subjectList.idList is a list of IDs to be looked up
             * @param userData
             */

            modelInstance.getSections = function (userParam, subjectList) {

                /*
                 * get the list of schools
                 * this shouldn't be an access issue since
                 *   1. the schools not accessible shouldn't show up
                 *   2. the resource could control this
                 */

                if (subjectList !== null) {
                    modelInstance.sections = getDataHelper(subjectList.type, 'section', subjectList.idList);
                    return;
                }


                if (modelInstance.user.roleTitle!== ('superadmin' || 'admin')) {
                    modelInstance.sections = nameToResource[ modelInstance.user.roleTitle ].onSections.get({id: userParam.id});
                } else {
                    if (modelInstance.user.roleTitle== 'admin') {
                        // get everything in the schools the admin controls
                        var schools = Admins.onSchools.get({id: userParam.id});
                        modelInstance.sections = getDataHelper('school', '', schools);
                    } else {
                        // must be superadmin, get all sections
                        Sections.onSelf.list();
                    }
                }
            }

            /**
             * Get students of related students
             */
            modelInstance.getStudent = function (userParam, subjectList) {

            }

            /**
             * Utilities
             */
            modelInstance.stripHtml = function(string, maxLength) {
                /**
                 * following code from http://www.rishida.net/tools/conversion/conversionfunctions.js
                 * the applet is at: http://www.rishida.net/tools/conversion/
                 * @param n
                 * @returns {string}
                 */
                function dec2char ( n ) {
                    // converts a single string representing a decimal number to a character
                    // note that no checking is performed to ensure that this is just a hex number, eg. no spaces etc
                    // dec: string, the dec codepoint to be converted
                    var result = '';
                    if (n <= 0xFFFF) { result += String.fromCharCode(n); }
                    else if (n <= 0x10FFFF) {
                        n -= 0x10000
                        result += String.fromCharCode(0xD800 | (n >> 10)) + String.fromCharCode(0xDC00 | (n & 0x3FF));
                    }
                    else { result += 'dec2char error: Code point out of range: '+dec2hex(n); }
                    return result;
                }
                function convertDecNCR2Char ( str ) {
                    // converts a string containing &#...; escapes to a string of characters
                    // str: string, the input

                    // convert up to 6 digit escapes to characters
                    str = str.replace(/&#([0-9]{1,7});/g,
                        function(matchstr, parens) {
                            return dec2char(parens);
                        }
                    );
                    return str;
                }

                if (!string) { return null; }
                if (!maxLength) { var maxLength = 300 }
                string = convertDecNCR2Char(string)
                string = string.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>?/gi," ");
                return string.slice(0, maxLength);
            }
            return modelInstance;
        }

    ]);


var jsdoc = 'hello';
