const chai = require('chai');
const chaiHttp = require('chai-http');
const http = require('http');
const app = require('../server'); 
const connectDB = require('../config/db');
const sinon = require('sinon');
const mongoose = require('mongoose');
//import model
const Supplier = require('../models/Supplier');
//import supplier controller
const { addSupplier, updateSupplier, deleteSupplier } = require('../controllers/supplierController');
const { expect } = chai;

chai.use(chaiHttp);
let server;
let port;

describe('AddSupplier Function Test', () => {

    it('should create a new supplier successfully', async () => {
      const req = {
        user: { id: new mongoose.Types.ObjectId() },
        body: { name: "Supplier Name", contact: "Contact Info",address:"address info" }
      };
  
      const createdSupplier = { _id: new mongoose.Types.ObjectId(), ...req.body, userId: req.user.id };
      const createStub = sinon.stub(Supplier, 'create').resolves(createdSupplier);
  
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };
  
      await addSupplier(req, res);
  
      expect(createStub.calledOnceWith({ userId: req.user.id, ...req.body })).to.be.true;
      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith(createdSupplier)).to.be.true;
  
      createStub.restore();
    });
  
    it('should return 500 if an error occurs', async () => {
      const createStub = sinon.stub(Supplier, 'create').throws(new Error('DB Error'));
  
      const req = {
        user: { id: new mongoose.Types.ObjectId() },
        body: { name: "Supplier Name", contact: "Contact Info", address:"address info" }
      };
  
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };
  
      await addSupplier(req, res);
  
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
  
      createStub.restore();
    });
  });

  //test update supplier
  describe('Update Function Test', () => {
  
    it('should update supplier successfully', async () => {
      // Mock supplier data
      const supplierId = new mongoose.Types.ObjectId();
      const existingSupplier = {
        _id: supplierId,
        name: "Old Product",
        contact: "old contact",
        address:"old address",

        save: sinon.stub().resolvesThis(), // Mock save method
      };
      // Stub Task.findById to return mock task
      const findByIdStub = sinon.stub(Supplier, 'findById').resolves(existingSupplier);
  
      // Mock request & response
      const req = {
        params: { id: supplierId },
        body: { name: "Updated Supplier", contact: "updated contact", address:"updated address"}
      };
      const res = {
        json: sinon.spy(), 
        status: sinon.stub().returnsThis()
      };
  
      // Call function
      await updateSupplier(req, res);
  
      // Assertions
      expect(existingSupplier.name).to.equal("Updated Supplier");
      expect(existingSupplier.contact).to.equal("Updated Contact");
      expect(existingSupplier.address).to.equal('updated address');
      
      //check
      expect(res.status.called).to.be.false; 
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.calledWith(existingProduct)).to.be.true;
  
      // Restore stubbed methods
      findByIdStub.restore();
    });
  
    it('should return 404 if supplier is not found', async () => {
      const findByIdStub = sinon.stub(Supplier, 'findById').resolves(null);
  
      const req = { 
        params: { id: new mongoose.Types.ObjectId() }, 
        body: { name: "Non-Existent Supplier"} 
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };
  
      await updateSupplier(req, res);
  
      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ message: 'Supplier not found' })).to.be.true;
  
      findByIdStub.restore();
    });
  
    it('should return 500 on error', async () => {
      const findByIdStub = sinon.stub(Supplier, 'findById').throws(new Error('DB Error'));
  
      const req = { params: { id: new mongoose.Types.ObjectId() }, body: {name: "Supplier with Error"} };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };
  
      await updateSupplier(req, res);
  
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.called).to.be.true;
  
      findByIdStub.restore();
    });
  
  });

  //test delete supplier
  
  describe('DeleteSupplier Function Test', () => {
  
    it('should delete a supplier successfully', async () => {
      // Mock request data
      const req = { params: { id: new mongoose.Types.ObjectId().toString() } };
  
      // Mock task found in the database
      const supplier = { remove: sinon.stub().resolves() };
  
      // Stub Task.findById to return the mock task
      const findByIdStub = sinon.stub(Supplier, 'findById').resolves(supplier);
  
      // Mock response object
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };
  
      // Call function
      await deleteSupplier(req, res);
  
      // Assertions
      expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
      expect(supplier.remove.calledOnce).to.be.true;
      expect(res.json.calledWith({ message: 'supplier deleted' })).to.be.true;
  
      // Restore stubbed methods
      findByIdStub.restore();
    });
  
    it('should return 404 if supplier is not found', async () => {
      // Stub Task.findById to return null
      const findByIdStub = sinon.stub(Supplier, 'findById').resolves(null);
  
      // Mock request data
      const req = { params: { id: new mongoose.Types.ObjectId().toString() } };
  
      // Mock response object
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };
  
      // Call function
      await deleteSupplier(req, res);
  
      // Assertions
      expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ message: 'Supplier not found' })).to.be.true;
  
      // Restore stubbed methods
      findByIdStub.restore();
    });
  
    it('should return 500 if an error occurs', async () => {
      // Stub Task.findById to throw an error
      const findByIdStub = sinon.stub(Supplier, 'findById').throws(new Error('DB Error'));
  
      // Mock request data
      const req = { params: { id: new mongoose.Types.ObjectId().toString() } };
  
      // Mock response object
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };
  
      // Call function
      await deleteSupplier(req, res);
  
      // Assertions
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
  
      // Restore stubbed methods
      findByIdStub.restore();
    });
  
  });
  
  
  
  
