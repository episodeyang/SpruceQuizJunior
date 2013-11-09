var _ = require('underscore')
    , passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy
    , check = require('validator').check
    , userRoles = require('../../client/js/rolesHelper').userRoles;


// For initilizing Spruce database in MongoDB as some initial tests. Not needed if data is already in MongoDB
// In the following order to address ObjectId dependency
//    Material,
//    Unit,
//    School,
//    Section,
//    Problem,
//    Exam,
//    Erratum,
//    Student,
//    Parent,
//    Teacher,
//    Admin,
//    Superadmin,
//    User,
//    Quiz,
//    Feed
// Begin of temporary initilization

// Initialization of Material data
var MaterialM = require('./SchemaModels').Material;

var tempmaterial = new MaterialM({
    materialName: "三元一次方程简介",
    comment: "什么是三元一次方程？请点击这里",
    dateOfCreation: "",
    dateOfModification: "",
    lastEditedBy: "episodeyang",
    sourceUrl: "http://baike.baidu.com/view/853269.htm",
    materialType: "webpage"
});
tempmaterial.save();
var m1_id = tempmaterial._id;
// console.log(m1_id);

tempmaterial = new MaterialM({
    materialName: "抛物线的性质",
    comment: "什么是抛物线？",
    dateOfCreation: "",
    dateOfModification: "",
    lastEditedBy: "lizhongchen",
    sourceUrl: "http://zh.wikipedia.org/wiki/%E6%8A%9B%E7%89%A9%E7%BA%BF",
    materialType: "webpage"
});
tempmaterial.save();
var m2_id = tempmaterial._id;
// console.log(m2_id);

tempmaterial = new MaterialM({
    materialName: "那不是一颗流星",
    comment: "语文第三册课文",
    dateOfCreation: "",
    dateOfModification: "",
    lastEditedBy: "吴轶凡",
    sourceUrl: "http://baike.baidu.com/view/1344225.htm",
    materialType: "webpage"
});
tempmaterial.save();
var m3_id = tempmaterial._id;
// console.log(m3_id);


// Initialization of Unit data
var UnitM = require('./SchemaModels').Unit;

var tempunit = new UnitM({
    unitTitle: "一元二次多项式",
    comment: "",
    father: [],
    child: [],
    items: [m2_id],
    archived: []
});
tempunit.save();
var d3_id = tempunit._id;

tempunit = new UnitM({
    unitTitle: "多项式简介",
    comment: "",
    father: [],
    child: [d3_id],
    items: [m1_id],
    archived: [m2_id]
});
tempunit.save();
var d1_id = tempunit._id;

tempunit = new UnitM({
    unitTitle: "二元一次多项式",
    comment: "",
    father: [],
    child: [],
    items: [m2_id],
    archived: [m3_id]
});
tempunit.save();
var d2_id = tempunit._id;

tempunit = new UnitM({
    unitTitle: "一元二次多项式的解法",
    comment: "",
    father: [d3_id],
    child: [],
    items: [m2_id, m3_id],
    archived: [m1_id]
});
tempunit.save();
var d4_id = tempunit._id;


// Initialization of School data
var SchoolM = require('./SchemaModels').School;

var tempschool = new SchoolM({
    schoolName: "No.1 High School"
});
tempschool.save();
var s1_id = tempschool._id;

tempschool = new SchoolM({
    schoolName: "No.2 High School"
});
tempschool.save();
var s2_id = tempschool._id;


// Initialization of Section data
var SectionM = require('./SchemaModels').Section;

var tempsection = new SectionM({
    sectionName: "三年级一班",
    sectionDisplayName: "",
    school: s1_id,
    sectionParent: null,
    sectionUnits: [d1_id, d2_id]
});
tempsection.save();
var g1_id = tempsection._id;

tempsection = new SectionM({
    sectionName: "三年级二班",
    sectionDisplayName: "",
    school: s1_id,
    sectionParent: null,
    sectionUnits: [d1_id, d2_id]
});
tempsection.save();
var g2_id = tempsection._id;

tempsection = new SectionM({
    sectionName: "数学奥林匹克辅导",
    sectionDisplayName: "奥数（高中）",
    school: s2_id,
    sectionParent: null,
    sectionUnits: []
});
tempsection.save();
var g3_id = tempsection._id;

tempsection = new SectionM({
    sectionName: "浪漫主义欣赏",
    sectionDisplayName: "浪漫主义诗歌",
    school: s1_id,
    sectionParent: g2_id,
    sectionUnits: []
});
tempsection.save();
var g4_id = tempsection._id;


// Initialization of Problem data
var ProblemM = require('./SchemaModels').Problem;

var tempproblem = new ProblemM({
    topLevel: "true",
    problemType: 'multipleChoice',
    question: ["请指出下面二元一次方程的解：\n \\(x^2 + 4x -3 = 0\\)"],
    choices: ["\\(\\frac{-4\\pm\\sqrt{28}}{2}\\)", "David Cooperfield", "Bush Junior", "G.W. Bush"],
    multimedia: ['image1.png'],
    subproblems: [""],
    solutions: ['Washinton', 'Mrs. Adams'],
    explanations: ["这道题的答案是好几个的。\\(\\Leftarrow\\)左边说的又不是人话了。。。", ],
    hints: [''],
    hintRules: ['0', '1', ''],
    lastupdated: ''
});
tempproblem.save();
var p1_id = tempproblem._id;

tempproblem = new ProblemM({
    topLevel: "true",
    problemType: 'OpenEnded',
    question: ["如图所示，在足够大的空间范围内，同时存在着竖直向上的匀强电场和垂直纸面向里的水平匀强磁场，磁感应强度\\(B=1.57 T\\)．小球1带正电，其电量与质量之 比为\\(4 C/kg\\)．所受重力与电场力的大小相等；小球2不带电，静止放置于固定的水平悬空支架上．小球1向右以\\(v_0=23.59 m/s\\)的水平速度与 小球2正碰，碰后经过\\(0.75 s\\)再次相碰．设碰撞前后两小球带电情况不发 生改变，且始终保持在同一竖直平面内．(取\\(g=10 m/s^2)\\)，"],
    choices: [],
    multimedia: ['image1.png'],
    subproblems: [""],
    solutions: ['根据题目中给出的信息，我们可以推断，小球附近电场为\\(E_0\\).', ''], //security!
    explanations: ["这道题的答案是好几个的。\\(\\Leftarrow\\)左边说的又不是人话了。。。", ],
    hints: [''],
    hintRules: ['0', '1', ''],
    lastupdated: ''
});
tempproblem.save();
var p2_id = tempproblem._id;

tempproblem = new ProblemM({
    topLevel: "true",
    problemType: 'fillIn',
    question: ["The first president of the US is:", "and the second first lady is:"],
    choices: ["Lincoln", "David Cooperfield", "Bush Junior", "G.W. Bush"],
    multimedia: ['image1.png'],
    subproblems: [""],
    solutions: ['Washinton', 'Mrs. Adams'],
    explanations: ["这道题的答案是好几个的。（<=左边说的又不是人话了。。。)"],
    hints: [''],
    hintRules: ['0', '1', ''],
    lastupdated: ''
});
tempproblem.save();
var p3_id = tempproblem._id;


// Initialization of Exam data
var ExamM = require('./SchemaModels').Exam;

var tempexam = new ExamM({
    examTitle: "Spring 2013 Mid-term Exam",
    examDate: "",
    section: g1_id,
    attendence: true,
    totalScore: 100,
    totalReceivedScore: 93,
    rank: 2,
    examProblems: [
        {
            problemId: p2_id,
            problemType: "multipleChoice",
            weight: 30,
            receivedScore: 28,
            studentAnswer: ['Washinton', 'Mrs. Adams']
        },
        {
            problemId: p1_id,
            problemType: "OpenEnded",
            weight: 70,
            receivedScore: 65,
            studentAnswer: ['根据题目中给出的信息，我们可以推断，小球附近电场为\\(E_0\\).', '']
        }
    ]
});
tempexam.save();
var e1_id = tempexam._id;

// Initialization of Erratum data
var ErratumM = require('./SchemaModels').Erratum;

var temperratum = new ErratumM({
    erratumTitle: "Physics",
    subject: "Physics",
    url: "fake/url",
    problems: [p1_id, p2_id, p3_id],
    dateCreated: "",
    dateModified: ""
});
temperratum.save();
var ert1_id = temperratum._id;

// Initialization of Student data
var StudentM = require('./SchemaModels').Student;

var tempstudent = new StudentM({
    firstName: "Alice",
    lastName: "Stark",
    dateOfBirth: "",
    gender: "Female",
    email: "astark@spruceaca.edu",
    phone: ["12345678", "87654321"],
    address: "aaa",
    profilePic: "",
    sections: [g1_id, g2_id],
    schools: [s1_id],
    exams: [e1_id],
    errata: [ert1_id],
    comments: "big"
});
tempstudent.save();
var stu1_id = tempstudent._id;

tempstudent = new StudentM({
    firstName: "Bob",
    lastName: "Smith",
    dateOfBirth: "",
    gender: "Male",
    email: "bsmith@spruceaca.edu",
    phone: ["12345678", "87654321"],
    address: "bbb",
    profilePic: "",
    sections: [g1_id, g3_id],
    schools: [s1_id],
    exams: [e1_id],
    comments: "little"
});
tempstudent.save();
var stu2_id = tempstudent._id;

tempstudent = new StudentM({
    firstName: "Charlie",
    lastName: "Thompson",
    dateOfBirth: "",
    gender: "Male",
    email: "cthompson@spruceaca.edu",
    phone: ["12345678", "87654321"],
    address: "ddd",
    profilePic: "",
    sections: [g4_id],
    schools: [s2_id],
    exams: [e1_id],
    comments: ""
});
tempstudent.save();
var stu3_id = tempstudent._id;


// Initialization of Parent data
var ParentM = require('./SchemaModels').Parent;

var tempparent = new ParentM({
    parentName: "parentA",
    studentIds: [s1_id]
});
tempparent.save();
var prt1_id = tempparent._id;

tempparent = new ParentM({
    parentName: "parentB",
    studentIds: [s1_id]
});
tempparent.save();
var prt2_id = tempparent._id;

tempparent = new ParentM({
    parentName: "parentC",
    studentIds: [s2_id]
});
tempparent.save();
var prt3_id = tempparent._id;


// Initialization of Teacher data
var TeacherM = require('./SchemaModels').Teacher;

var tempteacher = new TeacherM({
    teacherName: "TeacherA",
    sections: [g1_id],
    schools: [s1_id]
});
tempteacher.save();
var tchr1_id = tempteacher._id;

tempteacher = new TeacherM({
    teacherName: "TeacherB",
    sections: [g1_id, g2_id],
    schools: [s1_id]
});
tempteacher.save();
var tchr2_id = tempteacher._id;

// Initialization of Admin data
var AdminM = require('./SchemaModels').Admin;

var tempadmin = new AdminM({
    adminName: "admin",
    schools: [s1_id]
});
tempadmin.save();
var a1_id = tempadmin._id;


// Initialization of Superadmin data
var SuperadminM = require('./SchemaModels').Superadmin;

var tempsuperadmin = new SuperadminM({
    superadminName: "superadmin"
});
tempsuperadmin.save();
var sa1_id = tempsuperadmin._id;


// Initialization of User data
var UserM = require('./SchemaModels').User;

var tempuser = new UserM({
    username: "student1",
    password: "123",
    role: userRoles.student,
    userId: stu1_id
});
tempuser.save();

tempuser = new UserM({
    username: "student2",
    password: "123",
    role: userRoles.student,
    userId: stu2_id
});
tempuser.save();

tempuser = new UserM({
    username: "student3",
    password: "123",
    role: userRoles.student,
    userId: stu3_id
});
tempuser.save();

tempuser = new UserM({
    username: "parent1",
    password: "123",
    role: userRoles.parent,
    userId: prt1_id
});
tempuser.save();

tempuser = new UserM({
    username: "parent2",
    password: "123",
    role: userRoles.parent,
    userId: prt2_id
});
tempuser.save();

tempuser = new UserM({
    username: "parent3",
    password: "123",
    role: userRoles.parent,
    userId: prt3_id
});
tempuser.save();

tempuser = new UserM({
    username: "teacher1",
    password: "123",
    role: userRoles.teacher,
    userId: tchr1_id
});
tempuser.save();

tempuser = new UserM({
    username: "teacher2",
    password: "123",
    role: userRoles.teacher,
    userId: tchr2_id
});
tempuser.save();

tempuser = new UserM({
    username: "admin",
    password: "123",
    role: userRoles.admin,
    userId: a1_id
});
tempuser.save();

tempuser = new UserM({
    username: "superadmin",
    password: "123",
    role: userRoles.superadmin,
    userId: sa1_id
});
tempuser.save();


// Initialization of Quiz data
var QuizM = require('./SchemaModels').Quiz;

var tempquiz = new QuizM({
    quizTitle: "Quiz template",
    quizDate: "",
    quizTopics: ["math", "geometry", "algebra"],
    totalScore: 100,
    quizProblems: [
        {
            problemId: p2_id,
            weight: 30
        },
        {
            problemUUID: p1_id,
            weight: 70
        }
    ]
});
tempquiz.save();
var q1_id = tempquiz._id;


// Initialization of Feed data
var FeedM = require('./SchemaModels').Feed;

var tempfeed = new FeedM({
    userId: stu1_id,
    groupId: g1_id,
    type: "Posted blog",
    feedData: "写了一篇新的博客文章",
    createdDate: new Date,
    archived: [false]
});
tempfeed.save();
var f1_id = tempfeed._id;

tempfeed = new FeedM({
    userId: stu2_id,
    groupUUID: g1_id,
    type: "Record",
    feedData: "突破了新的速度记录",
    createdDate: new Date,
    archived: [false]
});
tempfeed.save();
var f2_id = tempfeed._id;

tempfeed = new FeedM({
    userUUID: stu1_id,
    groupUUID: g2_id,
    type: "Comment",
    feedData: "留言：这篇文章写的真好啊！收藏了！",
    createdDate: new Date,
    archived: [false]
});
tempfeed.save();
var f3_id = tempfeed._id;

tempfeed = new FeedM({
    userUUID: stu3_id,
    groupUUID: g1_id,
    type: "Share",
    feedData: "分享了维基百科页面：宇宙大爆炸",
    createdDate: new Date,
    archived: [true]
});
tempfeed.save();
var f4_id = tempfeed._id;


//

// End of temporary initilization


