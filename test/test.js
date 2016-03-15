var supertest = require("supertest");
var should = require("should");
var qs = require("qs");

var util = require("../lib/util")

// This agent refers to PORT where program is runninng.

var server = supertest.agent("http://localhost:3001");

// UNIT test begin
describe("API test",function(){

  it("should create next generation",function(done){
    var data = {
      'M': 5,
      'N': 5,
      'liveCells' : [[2,1],[2,2],[2,3]]
    };

    server
      .get("/?" + qs.stringify(data))
      .expect("Content-type",/json/)
      .expect(200) // THis is HTTP response
      
      .end(function(err,res){
        res.status.should.equal(200);
        // Error key should be false.

        var bodySet = util.toSet(res.body);

        bodySet[[1,2]].should.equal(true);
        bodySet[[2,2]].should.equal(true);
        bodySet[[3,2]].should.equal(true);
        done();
    });
  });

  it("should not return values outside of range",function(done){
    var data = {
      'M': 3,
      'N': 5,
      'liveCells' : [[2,1],[2,2],[2,3]]
    };

    server
      .get("/?" + qs.stringify(data))
      .expect("Content-type",/json/)
      .expect(200) // THis is HTTP response
      
      .end(function(err,res){
        
        res.status.should.equal(200);
        // Error key should be false.

        var bodySet = util.toSet(res.body);

        bodySet[[1,2]].should.equal(true);
        bodySet[[2,2]].should.equal(true);
        should.not.exist(bodySet[[3,2]])
        done();
    });
  });

  it("should not accept bad N value",function(done){
    var data = {
      'M': 3,
      'N': "hello",
      'liveCells' : [[2,1],[2,2],[2,3]]
    };

    server
      .get("/?" + qs.stringify(data))
      .expect(500, "N is not a number", done);
  });

  it("should not accept bad M value",function(done){
    var data = {
      'M': "foo",
      'N': 5,
      'liveCells' : [[2,1],[2,2],[2,3]]
    };

    server
      .get("/?" + qs.stringify(data))
      .expect(500, "M is not a number", done);
  });

  it("should not accept non array liveCells",function(done){
    var data = {
      'M': 3,
      'N': 5,
      'liveCells' : "string not array"
    };

    server
      .get("/?" + qs.stringify(data))
      .expect(500, "Cells are not an array", done);
  });

});
