conn = new Mongo();
db = conn.getDB("nantijiazidb");

var questionCursor = db.question.find({author: {username: 'ge'}});

questionCursor.forEach(function (question) {
        printjson(question.author)
    }
)

db.question.update(
    {author: {username: 'ge'}}, 
    {$set: {author: {username: 'yang.ge'}}},
    {multi: true}
    )

