const chai = require('chai');
const chaiHttp = require('chai-http');
const http = require('http');
const app = require('../server'); 
const connectDB = require('../config/db');
const sinon = require('sinon');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('../models/User'); 
const { signup, login } = require('../controllers/authController');


chai.use(chaiHttp);
const { expect } = chai;
let server;
let port;

describe('Auth Functions Test', () => {
 
  // signup test
  it('should signup a user successfully', async () => {
    const req = {
      body: { 
        name: 'testuser',
        email: 'testuser@test.com', 
        password: 'testpassword123' }
    };
  
    const newUser = { _id: new mongoose.Types.ObjectId(), ...req.body };
    const signupStub = sinon.stub(User, 'findOne').resolves(null);
  
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };
  
    await signup(req, res);
  
    expect(signupStub.calledOnce).to.be.true;
    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith({
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      token: sinon.match.string
    })).to.be.true;
  
    signupStub.restore();
  });


  //login
  it('should login a user successfully', async () => {
    const req = {
      body: { email: 'testuser@test.com', password: 'testpassword123' }
    };
  
    const user = { 
      _id: new mongoose.Types.ObjectId(), 
      email: 'testuser@test.com', 
      password: 'hashedPassword', 
      name: 'testuser' 
    };
  
    const finduserStub = sinon.stub(User, 'findOne').resolves(user);
    const bcryptStub = sinon.stub(bcrypt, 'compare').resolves(true);
  
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };
  
    await login(req, res);
  
    expect(finduserStub.calledOnceWith({ email: req.body.email })).to.be.true;
    expect(bcryptStub.calledOnce).to.be.true;
    
    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith({
      id: user._id,
      name: user.name,
      email: user.email,
      token: sinon.match.string
    })).to.be.true;
  
    finduserStub.restore();
    bcryptStub.restore();
  });


});
  

