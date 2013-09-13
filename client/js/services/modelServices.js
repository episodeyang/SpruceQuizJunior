'use strict';

/**
 * model factory
 *
 * The goal of this implementation is for better abstraction and simpler interface with frontend
 *      It is achieved through over loading different functions
 *      It also calls the resources on each call to achieve refreshed data presentation
 *      It needs to serve the following user types:
 *      {public: 1, student: 2, parent: 4, teacher: 8, admin: 16, superadmin: 32}
 *
 * @author test
 * @param random
 */

angular.module('modelServices')
    .factory('Model', ['$rootScope', 'Students', 'Parents', 'Teachers', 'Admins', 'Superadmins',
        function ($rootScope, Students, Parents, Teachers, Admins, Superadmins) {
            var modelInstance = {};
//
//            // helper mapping
//            var roleToResource = {
//                'student': Students,
//                'parent': Parents,
//                'teachers': Teachers,
//                'admin': Admins,
//                'superadmin': Superadmins
//            };
//
//
//            // TODO: testing code, to be deleted
//            modelInstance.test = 1;
//
//            /**
//             * init function will initialize some of the most basic and commonly assessed components
//             *      that are needed by the UI
//             * note that some fields will be over written and some may not be written depending on
//             *      the user role and specific user settings
//             */
            modelInstance.init = function () {
//
//                // this should assign all the fields in
//                modelInstance.user = $rootScope.user;
//                //rolesHelper needs no special importing since it's explosed via js exports
//                console.log($rootScope.user);
//                console.log(rolesHelper.userRoles);
//
//                // Now retrieve Student information and assemble it with Model.user.
//
//                modelInstance.user.roleName =
//                    modelInstance.reverseRoleLookup(modelInstance.user.role, rolesHelper.userRoles);
//
//                console.log("testing the mapping");
//                console.log(modelInstance.user.roleName);
//                console.log(roleToResource[modelInstance.user.roleName]);
//                // get basic data
//                modelInstance.userData = roleToResource[modelInstance.user.roleName].onSelf.get({
//                    uuid: modelInstance.user.id
//                });
//
//                //console.log(modelInstance.user.roleName);
//
////
//
//                //modelInstance.getStudent();
//                //The following are for tomorrow:
//                //TODO: or () <= function(model){ If (model==undefined) {model = Model.user;}};
//                //      handle input cases of :
//                //          model == undefined => model = Model.user
//                //
//                //TODO: Model.updateSchools(*student/section)
//                //TODO: Model.addStudent(school/section,student)
//                //TODO: Model.deleteStudent(school/section,student.id)
//                //TODO: Model.addSchool(student/section,school)
//                //TODO: Model.addSection(student/school)
//                //TODO: Model.getSections(Model.user) or () <= function(model){ If (model==undefined) {model = Model.user;}};
//                //TODO: Model.getExams(Model.user) or () <= function(model){ If (model==undefined) {model = Model.user;}};
//
//                //TODO: Now with ModelInstance.user.userRole, call '/api/%userRole/:id and load it into ModelInstance.user
//                //      At the end of the day, user should have both the original keys as well as those from 'student',
//                //      'teacher', 'parent', 'admin' etc.
//                //      Also, all the sections, schools, and exams should at this point be loaded into `user`
//                //TODO: Testing Cases: I want testing cases to include testing cases for four different user types. Also
//                //      Check all the schema.
//                //      Check if schools, sections, and exams are loaded.
//
//                //modelInstance.user = Students.onStudents.list();
//
            };
//
//            /**
//             * helper function that gets the role string by looking up the object defined for the roles
//             * @param value
//             * @param obj
//             * @returns {*}
//             */
//            modelInstance.reverseRoleLookup = function (value, obj) {
//                for (var key in obj) {
//                    if (obj[key] === value) {
//                        console.log(obj[key]);
//                        console.log(key);
//                        return key;
//                    }
//                }
//                console.log("messup up and didn't find anything!", value);
//                return null;
//            };
//
//            // TODO: Model.getSchools(Model.user) or () <= function(model){ If (model==undefined) {model = Model.user;}};
//            // TODO: need to understand the undefined case better.
//            //      handle input cases of :
//            //          model == undefined => model = Model.user
//
//            /**
//             * this one gets the school based on the user object passed in
//             *      note that this doesn't have to be the same as the user object which gives
//             *          flexibility
//             *      also note that the backend database API will implement the constraints
//             *
//             *      could be used for refreshing data upon updating the database.
//             *
//             * @param userParam
//             */
//            modelInstance.getSchools = function (userParam) {
//
//                switch (modelInstance.user.roleName) {
//                    case 'student':
//                        modelInstance.schools = Students.onSchools.get({uuid: userParam.id});
//                        break;
//                    // parent not yet supported
//                    case 'teacher':
//                        modelInstance.schools = Teachers.onSchools.get({uuid: userParam.id});
//                        break;
//                    case 'admin':
//                        modelInstance.schools = Admins.onSchools.get({uuid: userParam.id});
//                        break;
//                    // the superadmin gets all the schools
//                    case 'superadmin':
//                        modelInstance.schools = Schools.onSchools.list();
//                        break;
//                    default:
//                        console.log('getSchools not supported for this input!');
//                }
//
//            };
//
//
//            //TODO: Model.getSections(Model.user) or () <= function(model){ If (model==undefined) {model = Model.user;}};
//
//            /**
//             * get the sections of different user (each with separate logic)
//             *
//             * for admins, the method is overloaded with the second parameter which specifies the type and the list desired
//             * The subject list must follow the following format:
//             *    subjectList.role is a role, like 'student'
//             *    subjectList.idList is a list of IDs to be looked up
//             * @param userData
//             */
//            modelInstance.getSections = function (userParam, subjectList) {
//
//                switch (modelInstance.user.roleName) {
//                    case 'student':
//                        modelInstance.schools = Students.onSections.get({uuid: userParam.id});
//                        break;
//                    // parent not yet supported
//                    case 'teacher':
//                        modelInstance.schools = Teachers.onSchools.get({uuid: userParam.id});
//                        break;
//                    case 'admin':
//                        if (subjectList === null) {
//                            // just get all the sections in the school
//                            modelInstance.schools = Admins.onSchools.get({uuid: userParam.id});
//                        } else {
//                        }
////                            switch (subjectList.role) }
////
////                            break;
////                            // the superadmin gets all the schools
//                    case 'superadmin':
//                        modelInstance.schools = Schools.onSchools.list();
//                        break;
//                    default:
//                        console.log('getSchools not supported for this input!');
//                }
//
//            }
//
//
//            //TODO: Model.getExams(Model.user) or () <= function(model){ If (model==undefined) {model = Model.user;}};
//
//            //TODO: Model.schools <= This is the school object for general use.
//            //TODO: Model.updateSchools() <= input is a list
//            //TODO: Model.section.addStudent()
//            //TODO: Model.deleteSchools() <= imput is a list
//
//            //TODO: Model.sections<= This is the section object for general use.
//            //TODO: Model.getSections()
//            //TODO: MOdel.updateSections()
//            //TODO: Model.exams <= This is the school object for general use.
//            //TODO: Model.onExams()
//            //TODO: Model.problems<= This is the school object for general use.
//            //TODO: Model.onExams()
//
            return modelInstance;
        }

    ]);


