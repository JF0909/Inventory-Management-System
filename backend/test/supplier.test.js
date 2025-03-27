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


chai.use(chaiHttp);
const { expect } = chai;

let server;
let port;

//add supplier test
describe('AddSupplier Function Test', () => {
    let createSupplierStub;

    beforeEach(() => {
        createSupplierStub = sinon.stub(Supplier, 'create');
      });
    
      afterEach(() => {
        createSupplierStub.restore();
      });


    it('should create a new supplier successfully', async () => {
     createSupplierStub.throws(new Error('DB Error'));

      const req = {
        user: { id: new mongoose.Types.ObjectId() },
        body: { name: "Supplier Name", contact: "Contact Info",address:"Address Info" }
      };
  
      const createdSupplier = { _id: new mongoose.Types.ObjectId(), ...req.body, userId: req.user.id };
      createSupplierStub.resolves(createdSupplier);
  
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };
  
      await addSupplier(req, res);
  
      expect(createSupplierStub.calledOnceWith({ userId: req.user.id, ...req.body })).to.be.true;
      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith(createdSupplier)).to.be.true;
  
    });
  
    it('should return 500 if an error occurs', async () => {
      createSupplierStub.throws(new Error('DB Error'));
  
      const req = {
        user: { id: new mongoose.Types.ObjectId() },
        body: { name: "Supplier Name", contact: "Contact Info", address:"Address Info" }
      };
  
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };
  
      await addSupplier(req, res);
  
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
  
    });
  });

  //test update supplier
  describe('Update Function Test', () => {
    let SupplierfindByIdStub;

    beforeEach(()=> {
        SupplierfindByIdStub = sinon.stub(Supplier, 'findById');
    });

    afterEach(() => {
        SupplierfindByIdStub.restore();
    }

    )
  
    it('should update supplier successfully', async () => {
      // Mock supplier data
      const supplierId = new mongoose.Types.ObjectId();
      const existingSupplier = {
        _id: supplierId,
        name: "Old Supplier",
        contact: "Old Contact",
        address:"Old Address",
        //mock save method
        save: sinon.stub().resolvesThis(), 
      };

      // Stub SupplierfindById to return mock supplier
      SupplierfindByIdStub.resolves(existingSupplier);
  
      // Mock request & response
      const req = {
        params: { id: supplierId },
        body: { name: "Updated Supplier", contact: "Updated Contact", address:"Updated Address"}
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
      expect(existingSupplier.address).to.equal('Updated Address');
      
      //check
      expect(res.status.called).to.be.false; 
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.calledWith(existingProduct)).to.be.true;
  
    });
  
    it('should return 404 if supplier is not found', async () => {
    //mock cannot find supplier
      SupplierfindByIdStub.resolves(null);
  
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
    });
  
    it('should return 500 on error', async () => {
      SupplierfindByIdStub.throws(new Error('DB Error'));
  
      const req = { params: { id: new mongoose.Types.ObjectId() },
       body: {name: "Supplier with Error"} };

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };
  
      await updateSupplier(req, res);
  
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.called).to.be.true;
    });
  
  });

  //test delete supplier
  
  describe('DeleteSupplier Function Test', () => {
    let DeletefindByIdStub;

    beforeEach(() => {
        DeletefindByIdStub = sinon.stub(Supplier, 'findById');
      });
    
      afterEach(() => {
        DeletefindByIdStub.restore();
      });
  
    it('should delete a supplier successfully', async () => {
      // Mock request data
      const req = { params: { id: new mongoose.Types.ObjectId().toString() } };
  
      // Mock task found in the database
      const supplier = { remove: sinon.stub().resolves() };
  
      // Stub Task.findById to return the mock task
      DeletefindByIdStub.resolves(supplier);
  
      // Mock response object
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };
  
      // Call function
      await deleteSupplier(req, res);
  
      // Assertions
      expect(DeletefindByIdStub.calledOnceWith(req.params.id)).to.be.true;
      expect(supplier.remove.calledOnce).to.be.true;
      expect(res.json.calledWith({ message: 'supplier deleted' })).to.be.true;
  
    });
  
    it('should return 404 if supplier is not found', async () => {
      // Stub Task.findById to return null
      DeletefindByIdStub.resolves(null);
  
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
      expect(DeletefindByIdStub.calledOnceWith(req.params.id)).to.be.true;
      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ message: 'Supplier not found' })).to.be.true;
    });
  
    it('should return 500 if an error occurs', async () => {
      // Stub supplier.findById to throw an error
     DeletefindByIdStub.throws(new Error('DB Error'));
  
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
    });
  
  });
  
  
  
  
