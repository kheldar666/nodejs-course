const expect = require("chai").expect;
const jwt = require("jsonwebtoken");
const sinon = require("sinon");

const authMiddleWare = require("../middleware/is-auth");

describe("Testing Auth Middleware", function () {
  it("should throw an error if no Authorization Header is present", function () {
    const req = {
      get: function () {
        return null;
      },
    };
    expect(authMiddleWare.bind(this, req, {}, () => {}))
      .to.throw("Not Authenticated")
      .with.property("statusCode", 401);
  });

  it("throw an error if the Authorization Header is only one string", function () {
    const req = {
      get: function () {
        return "wrong_header_value";
      },
    };
    expect(authMiddleWare.bind(this, req, {}, () => {})).to.throw();
  });

  it("should throw an error if the Token cannot be verified", function () {
    const req = {
      get: function () {
        return "Bearer a_valid_token";
      },
    };
    //Using a Stub to override with our dummy function
    sinon.stub(jwt, "verify");
    jwt.verify.returns({
      userId: "a_user_id",
    });

    authMiddleWare(req, {}, () => {});
    expect(req).to.have.property("userId", "a_user_id");
    expect(jwt.verify.called).to.be.true;
    //Don't forget to restore the original function
    jwt.verify.restore();
  });

  it("should throw an error if the Token cannot be verified", function () {
    const req = {
      get: function () {
        return "Bearer invalid_token";
      },
    };
    expect(authMiddleWare.bind(this, req, {}, () => {})).to.throw();
  });
});
