conn = new Mongo();
db = conn.getDB("nantijiazidb");

//user = db.user.findOne({password:"kw55kw55"});
var userCursor = db.user.find();

while (userCursor.hasNext()) {
    user = userCursor.next();
    studentId = user.student

    student = db.student.findAndModify({
             query: {_id:studentId}, 
             update: { $set: {username:user.username}}
          })
    printjson(student)
}


