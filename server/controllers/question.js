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
define(['underscore', '../models/SchemaModels', '../rolesHelper', "mongoose"],
    function (_, SchemaModels, rolesHelper, mongoose) {
        var QuestionM = SchemaModels.Question;
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
                QuestionM.find({}, function(err, docs){
                    if (err) {
                        console.log(err);
                        return res.send(500, err);
                    } else {
                        return res.send(200, docs);
                    };
                })
            },
            /**
             * @api {post} /api/questions Create Question
             * @apiName CreateQuestion
             * @apiGroup Questions
             */
            add: function (req, res) {
                var question = req.body;
                question.dateCreated = Date.now();
                QuestionM.create(question, function (err, results) {
                    if (err) {
                        console.log(err);
                        return res.send(500, err);
                    };
                })
                    .then(function (question) {
                        res.location(req.route.path + '/' + question.id);
                        return res.send(201, question);
                    });
            },
            /**
             * @api {get} /api/questions/:id Get A Specific Question
             * @apiName GetQuestion
             * @apiGroup Questions
             */
            findOne: function (req, res) {
                if (!req.params.id) { return res.send(400); }
                QuestionM.findById(req.params.id, 'id title text author tags comments answers', function(err, results){
                    if (err) {return res.send(403, err)}
                    else {
                        return res.send(200, results);
                    };
                })
            },
            /**
             * @api {post} /api/questions/:id Update Question
             * @apiName UpdateQuestion
             * @apiGroup Questions
             */
            update: function (req, res) {
                if (!req.params.id) { return res.send(400); }
                QuestionM.findByIdAndUpdate(
                    ObjectId(req.params.id),
                    req.body,
                    {new: true},
                    function(err, results){
                        if (err) {return res.send(403, err)};
                        return res.send(201, results);
                });
            },
            /**
             * @api {delete} /api/questions/:id Delete Question
             * @apiName DeleteQuestion
             * @apiGroup Questions
             */
            removebyId: function (req, res) {
                if (!req.params.id) { return res.send(400); }
                QuestionM.findByIdAndRemove(
                    ObjectId(req.params.id),
                    function(err, results){
                        if (err) {return res.send(403, err)};
                        return res.send(204);
                    });
            }
        };
    });
