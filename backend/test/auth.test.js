const chai = require('chai');
const chaiHttp = require('chai-http');
const http = require('http');
const app = require('../server'); 
const connectDB = require('../config/db');
const sinon = require('sinon');
const mongoose = require('mongoose');
const User = require('../models/User'); 
const { login, Signup } = require('../controllers/authController');


chai.use(chaiHttp);
const { expect } = chai;
let server;
let port;

describe('Auth Functions Test', () => {

  // signup test
  it('should register a user successfully', async () => {
    const req = {
      body: { username: 'testuser', password: 'testpassword123' }
    };

    const newUser = { _id: new mongoose.Types.ObjectId(), ...req.body };
    const saveStub = sinon.stub(User.prototype, 'save').resolves(newUser);

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await Signup(req, res);

    expect(saveStub.calledOnce).to.be.true;
    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith(newUser)).to.be.true;

    saveStub.restore();
  });

  // login test
  it('should log in a user successfully', async () => {
    const req = {
      body: { username: 'testuser', password: 'testpassword123' }
    };

    const user = { _id: new mongoose.Types.ObjectId(), username: 'testuser', password: 'hashedPassword' };
    const findStub = sinon.stub(User, 'findOne').resolves(user);

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await login(req, res);

    expect(findStub.calledOnceWith({ username: req.body.username })).to.be.true;
    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith({ message: 'Login successful' })).to.be.true;

    findStub.restore();
  });

  // login failed test
  it('should return 401 if credentials are invalid', async () => {
    const req = {
      body: { username: 'wronguser', password: 'wrongpassword' }
    };

    const findStub = sinon.stub(User, 'findOne').resolves(null);

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await login(req, res);

    expect(res.status.calledWith(401)).to.be.true;
    expect(res.json.calledWith({ message: 'Invalid credentials' })).to.be.true;

    findStub.restore();
  });
});
