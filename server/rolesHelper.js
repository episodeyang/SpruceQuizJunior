'use strict';

define([], function () {
    /**
     * @name rolesConfig
     * @type {{roles: string[], schDict: {student: string, public: string, parent: string, teacher: string, admin: string, superadmin: string}, accessLevels: {all: string, anon: string[], loggedin: string[], superuser: string[], admin: string[], superadmin: string[]}}}
     */
    var config = {

        /* List all the roles you wish to use in the app
         * You have a max of 31 before the bit shift pushes the accompanying integer out of
         * the memory footprint for an integer
         */
        roles: [
            'public',
            'student',
            'parent',
            'teacher',
            'admin',
            'superadmin'
        ],

        schDict : {
            student: "",
            public: "",
            parent: "",
            teacher: "",
            admin: "",
            superadmin: ""
        },

        /*
         Build out all the access levels you want referencing the roles listed above
         You can use the "*" symbol to represent access to all roles
         */
        accessLevels: {
            'all': "*",
            'anon': ['public'],
            'loggedin': ['student', 'parent', 'teacher', 'admin', 'superadmin'],
            'superuser': ['parent', 'teacher', 'admin', 'superadmin'],
            'admin': ['admin', 'superadmin'],
            'superadmin': ['superadmin']
        }

    };

    /**
     * This userRoles returns the mapping of role string to the role number
     * Method to build a distinct bit mask for each role
     * It starts off with "1" and shifts the bit to the left for each element in the
     * roles array parameter
     * @type {*}
     */
    function buildRoles(roles) {
        var bitMask = "01";
        var userRoles = {};

        for (var index in roles) {
            var intCode = parseInt(bitMask, 2);
            userRoles[roles[index]] = {bitMask:intCode, title: roles[index] };
            bitMask = (intCode << 1 ).toString(2)
        }

        return userRoles;
        console.log(userRoles);
    };

    /**
     * This method builds access level bit masks based on the accessLevelDeclaration parameter which must
     * contain an array for each access level containing the allowed user roles.
     */
    function buildAccessLevels(accessLevelDeclarations, userRoles){

        var accessLevels = {};
        for(var level in accessLevelDeclarations){

            if(typeof accessLevelDeclarations[level] == 'string'){
                if(accessLevelDeclarations[level] == '*'){

                    var resultBitMask = '';

                    for( var role in userRoles){
                        resultBitMask += "1"
                    }
                    //accessLevels[level] = parseInt(resultBitMask, 2);
                    accessLevels[level] = {
                        bitMask: parseInt(resultBitMask, 2),
                        title: accessLevelDeclarations[level]
                    };
                }
                else console.log("Access Control Error: Could not parse '" + accessLevelDeclarations[level] + "' as access definition for level '" + level + "'")

            }
            else {

                var resultBitMask = 0;
                for(var role in accessLevelDeclarations[level]){
                    if(userRoles.hasOwnProperty(accessLevelDeclarations[level][role]))
                        resultBitMask = resultBitMask | userRoles[accessLevelDeclarations[level][role]].bitMask
                    else console.log("Access Control Error: Could not find role '" + accessLevelDeclarations[level][role] + "' in registered roles while building access for '" + level + "'")
                }
                accessLevels[level] = {
                    bitMask: resultBitMask,
                    title: accessLevelDeclarations[level][role]
                };
            }
        }

        return accessLevels;
    };

    var userRoles = buildRoles(config.roles);
    var accessLevels = buildAccessLevels(config.accessLevels, userRoles);

    return {
        userRoles: userRoles,
        accessLevels: accessLevels
    }
});