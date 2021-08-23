const expect = require("chai").expect;

const mongoose = require("mongoose");

const User = require("../models/user");
const statusController = require("../controllers/status");

describe("Status Controller", function () {
  //Runs before first Tests
  before(function (done) {
    mongoose
      .connect(process.env.MONGODB_CONNECTION_STRING_TEST, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      })
      .then(() => {
        //First let's create a dummy user
        const user = new User({
          email: "test@test.com",
          password: "test123",
          name: "Test account",
          status: "Test Status",
          posts: [],
          _id: "611626be6184055cfddea4fc",
        });
        return user.save();
      })
      .then(() => {
        done();
      })
      .catch((err) => done(err));
  });

  it("should send a response with valid user status for an existing user", function (done) {
    // Increase default timeout for the test case.
    // With an arrow function that would not work. Must do => it("blah blah", (done) => {... tests...}).timeout(5000)
    // Also can add to the mocha launch params :  mocha --timeout 5000 ...
    // this.timeout(5000);
    let req;
    let res;

    //Now let's retrieve the dummy user and check the logic
    req = { userId: "611626be6184055cfddea4fc" };
    res = {
      statusCode: 500,
      userStatus: null,
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        this.userStatus = data.status;
      },
    };

    statusController
      .getUserStatus(req, res, () => {})
      .then(() => {
        expect(res.statusCode).to.be.equal(200);
        expect(res.userStatus).to.be.equal("Test Status");
      })
      .then(() => {
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  after(function (done) {
    //Clean up all data and shutdown connection.
    User.deleteMany({})
      .then(() => {
        return mongoose.disconnect();
      })
      .then(() => {
        done();
      })
      .catch((err) => done(err));
  });
});
