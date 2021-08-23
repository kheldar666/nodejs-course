const expect = require("chai").expect;
const sinon = require("sinon");
const mongoose = require("mongoose");
const io = require("../socket");

const Post = require("../models/post");
const User = require("../models/user");

const feedController = require("../controllers/feed");

describe("Feed Controller", function () {
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

  it("should add a created post to the posts of the creator", function (done) {
    let req;
    let res;

    //Now let's retrieve the dummy user and check the logic
    req = {
      userId: "611626be6184055cfddea4fc",
      body: {
        title: "A Test Title",
        content: "A test content for the post",
      },
      file: {
        path: "path/to/image",
      },
    };
    res = {
      statusCode: 500,
      message: null,
      post: null,
      creator: null,
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        this.message = data.message;
        this.post = data.post;
        this.creator = data.creator;
      },
    };

    //Create a Stub to bypass Socket.io
    const IoStub = sinon.stub(io, "getIO").callsFake(() => {
      return {
        emit: () => {
          return true;
        },
      };
    });

    feedController
      .createPost(req, res, () => {})
      .then((creator) => {
        expect(res.statusCode).to.be.equal(201);
        expect(res.message).to.be.equal("Post created successfully.");
        expect(res.post).to.not.be.null;
        expect(res.creator).to.have.property("name", "Test account");
        expect(creator).to.have.property("posts");
        expect(creator.posts).to.have.length(1);
      })
      .then(() => {
        IoStub.restore();
        done();
      })
      .catch((err) => {
        console.log(err);
        done(err);
      });
  });

  after(function (done) {
    //Clean up all data and shutdown connection.
    Post.deleteMany({})
      .then(() => {
        return User.deleteMany({});
      })
      .then(() => {
        return mongoose.disconnect();
      })
      .then(() => {
        done();
      })
      .catch((err) => done(err));
  });
});
