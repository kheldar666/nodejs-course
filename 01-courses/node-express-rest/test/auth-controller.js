const expect = require("chai").expect;
const sinon = require("sinon");

const User = require("../models/user");
const authController = require("../controllers/auth");

describe("Auth Controller - Login", function () {
  // The "done" argument is used to tell mocha we work async
  it("should throw a 500 error if accessing the DB fails", function (done) {
    sinon.stub(User, "findOne");
    User.findOne.throws();
    const req = {
      body: {
        email: "test@test.com",
        password: "test123",
      },
    };
    authController
      .login(req, {}, () => {})
      .then((result) => {
        expect(result).to.be.an("error");
        expect(result).to.have.property("statusCode", 500);
        done();
      })
      .catch((err) => {
        done(err);
      });
    User.findOne.restore();
  });
});
