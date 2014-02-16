'use strict';

angular.module('modelServices', ['resourceProvider'])
    .factory('Model', ['$rootScope', 'Users', 'Questions', 'Students', 'Parents', 'Teachers', 'Admins', 'Superadmins',
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
        function ($rootScope, Users, Questions, Students, Parents, Teachers, Admins, Superadmins,
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

            /** Destroy the model instance
             *    place holder for now, to be called later by log out
             *    @alias Model.destroy()
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
//                console.log(modelInstance.user)
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

            modelInstance.question = {};
            modelInstance.questions = [];

            modelInstance.getVoteStatus = function(){
                modelInstance.question.votedup = _.contains(modelInstance.question.voteup, modelInstance.user.username)
                modelInstance.question.voteddown = _.contains(modelInstance.question.votedown, modelInstance.user.username)
            };
            modelInstance.getQuestion = function(id) {
                Questions.get( {id:id}, function(question){
                    modelInstance.question = question;
                    modelInstance.getVoteStatus();
                }, function(err){ $rootScope.error = err; } );
            };
            modelInstance.queryQuestions = function() {
                Questions.query(function(questions){
                    modelInstance.questions = questions;
                }, function(err){ $rootScope.error = err; } );
            };
            modelInstance.createQuestion = function(question, success, error) {
                Questions.create(question, function(result){
                    modelInstance.question = result;
                    if (success) { success(result); };
                }, function(err){
                    $rootScope.error = err;
                    if (error) { error(err); };
                } );
            };
            modelInstance.saveQuestion = function(question, success, error) {
                if (question.id) {$rootScope.error = "udpate does not have object id."}
                Questions.save(question, function(q){
                    _.extend(modelInstance.question, q);
                    if (success) { success() };
                }, function(err){
                    $rootScope.error = err;
                    if (error) { error() };
                } );
            };
            modelInstance.removeQuestion = function(question) {
                Questions.remove(question, function(result){
                    console.log('removal success');
                }, function(err){ $rootScope.error = err; } );
            };

            modelInstance.voteup = function(question) {
                var q = {
                    id: question.id,
                    voteup: 'true'
                }
                modelInstance.saveQuestion(q, modelInstance.getVoteStatus);
            }
            modelInstance.votedown = function(question) {
                var q = {
                    id: question.id,
                    votedown: 'true'
                }
                modelInstance.saveQuestion(q, modelInstance.getVoteStatus);
            }
            modelInstance.addAnswer = function(text, success, error) {
                var ans = {
                    id: modelInstance.question.id,
                    text: text
                };
                Questions.addAnswer(
                    ans,
                    function(results){
                        modelInstance.question.answers = results.answers;
                        if (success) { success(results); }
                    }, function(err) {
                        $rootScope.error = err;
                        if (error) { error(err); };
                    }
                );
            }
            modelInstance.deleteAnswer = function(answer) {
                var q = {
                    id: question.id,
                    answer: {
                        $push: {}
                    }
                }
                modelInstance.saveQuestion(q, modelInstance.getVoteStatus);
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
            //The following are for tomorrow:
            //TODO: or () <= function(model){ If (model==undefined) {model = Model.user;}};
            //      handle input cases of :
            //          model == undefined => model = Model.user
            //
            //TODO: Model.updateSchools(*student/section)
            //TODO: Model.addStudent(school/section,student)
            //TODO: Model.deleteStudent(school/section,student.id)
            //TODO: Model.addSchool(student/section,school)
            //TODO: Model.addSection(student/school)
            //TODO: Model.getSections(Model.user) or () <= function(model){ If (model==undefined) {model = Model.user;}};
            //TODO: Model.getExams(Model.user) or () <= function(model){ If (model==undefined) {model = Model.user;}};

            //TODO: Now with ModelInstance.user.userRole, call '/api/%userRole/:id and load it into ModelInstance.user
            //      At the end of the day, user should have both the original keys as well as those from 'student',
            //      'teacher', 'parent', 'admin' etc.
            //      Also, all the sections, schools, and exams should at this point be loaded into `user`
            //TODO: Testing Cases: I want testing cases to include testing cases for four different user types. Also
            //      Check all the schema.
            //      Check if schools, sections, and exams are loaded.

            //modelInstance.user = Students.onStudents.list();
            //TODO: Model.getExams(Model.user) or () <= function(model){ If (model==undefined) {model = Model.user;}};

            //TODO: Model.schools <= This is the school object for general use.
            //TODO: Model.updateSchools() <= input is a list
            //TODO: Model.section.addStudent()
            //TODO: Model.deleteSchools() <= imput is a list

            //TODO: Model.sections<= This is the section object for general use.
            //TODO: Model.getSections()
            //TODO: MOdel.updateSections()
            //TODO: Model.exams <= This is the school object for general use.
            //TODO: Model.onExams()
            //TODO: Model.problems<= This is the school object for general use.
            //TODO: Model.onExams()

            /**
             * Utilities
             */
            modelInstance.stripHtml = function(string, maxLength) {
                if (!string) { return null; }
                if (!maxLength) { var maxLength = 300 }
                string = string.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>?/gi," ");
                return string.slice(0, maxLength);
            }
            return modelInstance;
        }

    ]);


var jsdoc = 'hello';
