const chai = require('chai');
const chaiHttp = require('chai-http');
const http = require('http');
const sinon = require('sinon');
const app = require('../server'); 
const connectDB = require('../config/db');
const mongoose = require('mongoose');
//import product model
const Product = require('../models/Product'); 
//import productController
const { updateProduct,getProducts,getProductById,addProduct,deleteProduct } = require('../controllers/productController'); 
const { expect } = chai;

chai.use(chaiHttp);


describe('AddProduct Function Test', () => {

    it('should create a new product successfully', async () => {
      // Mock request data
      const req = {
        user: { id: new mongoose.Types.ObjectId() },
        body: { name: "New Product", category: "Category", price: 100, stockLevel: 10 }
      };
  
      // Mock task that would be created
      const createdProduct = { _id: new mongoose.Types.ObjectId(), ...req.body, userId: req.user.id };
  
      // Stub Task.create to return the createdTask
      const createStub = sinon.stub(Product, 'create').resolves(createdProduct);
  
      // Mock response object
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };
  
      // Call function
      await addProduct(req, res);
  
      // Assertions
      expect(createStub.calledOnceWith({ userId: req.user.id, ...req.body })).to.be.true;
      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith(createdProduct)).to.be.true;
  
      // Restore stubbed methods
      createStub.restore();
    });
  
    it('should return 500 if an error occurs', async () => {
      // Stub Task.create to throw an error
      const createStub = sinon.stub(Product, 'create').throws(new Error('DB Error'));
  
      // Mock request data
      const req = {
        user: { id: new mongoose.Types.ObjectId() },
        body: { name: "New Product", category: "Category", price: 100, stockLevel: 10 }
      };
  
      // Mock response object
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };
  
      // Call function
      await addProduct(req, res);
  
      // Assertions
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
  
      // Restore stubbed methods
      createStub.restore();
    });
  
  });
  
  //test update product 
  describe('Update Function Test', () => {
  
    it('should update product successfully', async () => {
      // Mock task data
      const productId = new mongoose.Types.ObjectId();
      const existingProduct = {
        _id: productId,
        name: "Old Product",
        category: "Old Category",
        price: 100,
        stockLevel: 50,
        save: sinon.stub().resolvesThis(), // Mock save method
      };
      // Stub Task.findById to return mock task
      const findByIdStub = sinon.stub(Product, 'findById').resolves(existingProduct);
  
      // Mock request & response
      const req = {
        params: { id: productId },
        body: { name: "Updated Product", category: "updated category", price: 120, stockLevel: 60 }
      };
      const res = {
        json: sinon.spy(), 
        status: sinon.stub().returnsThis()
      };
  
      // Call function
      await updateProduct(req, res);
  
      // Assertions
      expect(existingProduct.name).to.equal("Updated Product");
      expect(existingProduct.category).to.equal("Updated Category");
      expect(existingProduct.price).to.equal(120);
      expect(existingProduct.stockLevel).to.equal(60);

      expect(res.status.called).to.be.false; 
      expect(res.json.calledOnce).to.be.true;
      //check
      expect(res.json.calledWith(existingProduct)).to.be.true;
  
      // Restore stubbed methods
      findByIdStub.restore();
    });
  
    it('should return 404 if task is not found', async () => {
      const findByIdStub = sinon.stub(Product, 'findById').resolves(null);
  
      const req = { 
        params: { id: new mongoose.Types.ObjectId() }, 
        body: { name: "Non-Existent Product"} 
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };
  
      await updateProduct(req, res);
  
      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ message: 'Product not found' })).to.be.true;
  
      findByIdStub.restore();
    });
  
    it('should return 500 on error', async () => {
      const findByIdStub = sinon.stub(Product, 'findById').throws(new Error('DB Error'));
  
      const req = { params: { id: new mongoose.Types.ObjectId() }, body: {name: "Product with Error"} };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };
  
      await updateProduct(req, res);
  
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.called).to.be.true;
  
      findByIdStub.restore();
    });
  
  });
  

  //test get all product
  describe('GetProduct Function Test', () => {
  
    it('should return products for the given user', async () => {
      // Mock user ID
      const userId = new mongoose.Types.ObjectId();
  
      // Mock task data
      const products = [
        { _id: new mongoose.Types.ObjectId(), name: "Product 1", category: "Category 1", price: 100, stockLevel: 50, userId },
        { _id: new mongoose.Types.ObjectId(), name: "Product 2", category: "Category 2", price: 200, stockLevel: 30, userId }
      ];
  
      // Stub Task.find to return mock tasks
      const findStub = sinon.stub(Product, 'find').resolves(products);
  
      // Mock request & response
      const req = { user: { id: userId } };
      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis()
      };
  
      // Call function
      await getProducts(req, res);
  
      // Assertions
      expect(findStub.calledOnceWith({ userId })).to.be.true;
      expect(res.json.calledWith(products)).to.be.true;
      expect(res.status.called).to.be.false; // No error status should be set
  
      // Restore stubbed methods
      findStub.restore();
    });
  
    it('should return 500 on error', async () => {
      // Stub Task.find to throw an error
      const findStub = sinon.stub(Product, 'find').throws(new Error('DB Error'));
  
      // Mock request & response
      const req = { user: { id: new mongoose.Types.ObjectId() } };
      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis()
      };
  
      // Call function
      await getProducts(req, res);
  
      // Assertions
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
  
      // Restore stubbed methods
      findStub.restore();
    });
  
  });

  //test get by ID
  describe("GetProductById Function Test", () => {
  
    it("should return a product successfully", async () => {
      // Mock request data
      const req = { params: { id: new mongoose.Types.ObjectId().toString() } };
  
      // Mock product found in the database
      const mockProduct = { _id: req.params.id, name: "Test Product", category: "Category 2", price: 200, stockLevel: 30 };
  
      // Stub Product.findById to return the mock product
      const findByIdStub = sinon.stub(Product, "findById").resolves(mockProduct);
  
      // Mock response object
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };
  
      // Call function
      await getProductById(req, res);
  
      // Assertions
      expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(mockProduct)).to.be.true;
  
      // Restore stubbed methods
      findByIdStub.restore();
    });
  
    it("should return 404 if product is not found", async () => {
      // Stub Product.findById to return null
      const findByIdStub = sinon.stub(Product, "findById").resolves(null);
  
      // Mock request data
      const req = { params: { id: new mongoose.Types.ObjectId().toString() } };
  
      // Mock response object
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };
  
      // Call function
      await getProductById(req, res);
  
      // Assertions
      expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ message: "Product not found" })).to.be.true;
  
      // Restore stubbed methods
      findByIdStub.restore();
    });
  
    it("should return 500 if an error occurs", async () => {
      // Stub Product.findById to throw an error
      const findByIdStub = sinon.stub(Product, "findById").throws(new Error("DB Error"));
  
      // Mock request data
      const req = { params: { id: new mongoose.Types.ObjectId().toString() } };
  
      // Mock response object
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };
  
      // Call function
      await getProductById(req, res);
  
      // Assertions
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWithMatch({ message: "Error: DB Error" })).to.be.true;
  
      // Restore stubbed methods
      findByIdStub.restore();
    });
  
  });
  
  //test delete product
  
  describe('DeleteProduct Function Test', () => {
  
    it('should delete a product successfully', async () => {
      // Mock request data
      const req = { params: { id: new mongoose.Types.ObjectId().toString() } };
  
      // Mock task found in the database
      const product = { remove: sinon.stub().resolves() };
  
      // Stub Task.findById to return the mock task
      const findByIdStub = sinon.stub(Product, 'findById').resolves(product);
  
      // Mock response object
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };
  
      // Call function
      await deleteProduct(req, res);
  
      // Assertions
      expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
      expect(Product.remove.calledOnce).to.be.true;
      expect(res.json.calledWith({ message: 'Product deleted' })).to.be.true;
  
      // Restore stubbed methods
      findByIdStub.restore();
    });
  
    it('should return 404 if task is not found', async () => {
      // Stub Task.findById to return null
      const findByIdStub = sinon.stub(Product, 'findById').resolves(null);
  
      // Mock request data
      const req = { params: { id: new mongoose.Types.ObjectId().toString() } };
  
      // Mock response object
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };
  
      // Call function
      await deleteProduct(req, res);
  
      // Assertions
      expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ message: 'Task not found' })).to.be.true;
  
      // Restore stubbed methods
      findByIdStub.restore();
    });
  
    it('should return 500 if an error occurs', async () => {
      // Stub Task.findById to throw an error
      const findByIdStub = sinon.stub(Product, 'findById').throws(new Error('DB Error'));
  
      // Mock request data
      const req = { params: { id: new mongoose.Types.ObjectId().toString() } };
  
      // Mock response object
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };
  
      // Call function
      await deleteProduct(req, res);
  
      // Assertions
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
  
      // Restore stubbed methods
      findByIdStub.restore();
    });
  
  });