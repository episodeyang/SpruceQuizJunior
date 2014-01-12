var superagent = require('superagent')
var expect = require('expect.js')

describe('express REST testing script', function(){
//    var id
    student1 = { username: 'student1'
        , password: '123'
        , rememberme: 'true'
    };

    it('post /login', function(done){
        var newStudent = {
            username: 'testStudent',
            password: 'password',
            role: userRoles.student,
            params:{
                schoolName: '北京景山学校',
                firstName: 'Ge',
                lastName: 'Yang',
                birthDay: new Date(2013, 12, 1, 9, 0, 0)
            }
        };
        superagent.post('http://localhost:8000/register')
            .send(newStudent)
            .end(function(e,res){
                expect(e).to.eql(null);
                expect(res.statusCode).to.eql(200);
//                console.log(res.body);
                done();
            })
    })
//    it('retrieves an object', function(done){
//        superagent.get('http://localhost:8000/collections/test/'+id)
//            .end(function(e, res){
//                // console.log(res.body)
//                expect(e).to.eql(null)
//                expect(typeof res.body).to.eql('object')
//                expect(res.body._id.length).to.eql(24)
//                expect(res.body._id).to.eql(id)
//                done()
//            })
//    })
//
//    it('retrieves a collection', function(done){
//        superagent.get('http://localhost:8000/collections/test')
//            .end(function(e, res){
//                // console.log(res.body)
//                expect(e).to.eql(null)
//                expect(res.body.length).to.be.above(0)
//                expect(res.body.map(function (item){return item._id})).to.contain(id)
//                done()
//            })
//    })
//
//    it('updates an object', function(done){
//        superagent.put('http://localhost:8000/collections/test/'+id)
//            .send({name: 'Peter'
//                , email: 'peter@yahoo.com'})
//            .end(function(e, res){
//                // console.log(res.body)
//                expect(e).to.eql(null)
//                expect(typeof res.body).to.eql('object')
//                expect(res.body.msg).to.eql('success')
//                done()
//            })
//    })
//
//    it('checks an updated object', function(done){
//        superagent.get('http://localhost:8000/collections/test/'+id)
//            .end(function(e, res){
//                // console.log(res.body)
//                expect(e).to.eql(null)
//                expect(typeof res.body).to.eql('object')
//                expect(res.body._id.length).to.eql(24)
//                expect(res.body._id).to.eql(id)
//                expect(res.body.name).to.eql('Peter')
//                done()
//            })
//    })
//    it('removes an object', function(done){
//        superagent.del('http://localhost:8000/collections/test/'+id)
//            .end(function(e, res){
//                // console.log(res.body)
//                expect(e).to.eql(null)
//                expect(typeof res.body).to.eql('object')
//                expect(res.body.msg).to.eql('success')
//                done()
//            })
//    })
})
