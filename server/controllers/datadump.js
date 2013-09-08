/**
 * Created with JetBrains WebStorm.
 * User: yifanwu
 * Date: 9/7/13
 * Time: 9:34 PM
 * To change this template use File | Settings | File Templates.
*/

'use strict';


var _ =           require('underscore')
    , SectionM = require('../models/SchemaModels').Section
    , StudentM = require('../models/SchemaModels').Student
    , TeacherM = require('../models/SchemaModels').Teacher
    , SchoolM = require('../models/SchemaModels').School;

module.exports = {
  getAllStudents: function (req, res) {
    StudentM.find(
      {},
      function (err, results) {
        if (!err) {
          res.json(results);
        } else {
          throw err;
        }
      }
    );
  }
};