const chai = require('chai');
const chaiHttp = require('chai-http');
const http = require('http');
const app = require('../server'); 
const connectDB = require('../config/db');
const sinon = require('sinon');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
//import user model
//const User = require('../models/User'); 
//import user controller
const { signup, login } = require('../controllers/authController');
//import product model
const Product = require('../models/Product'); 
//import productController
const { updateProduct,getProducts,getProductById,addProduct,deleteProduct } = require('../controllers/productController'); 


chai.use(chaiHttp);
const { expect } = chai;
let server;
let port;


describe('AddProduct Function Test', () => {
  let createProductStub;

  // Setup the stub before each test
  beforeEach(() => {
    createProductStub = sinon.stub(Product, 'create');
  });

  afterEach(() => {
    createProductStub.restore(); 
  });

    it('should create a new product successfully', async () => {
      // Mock request data
      const req = {
        user: { id: new mongoose.Types.ObjectId() },
        body: { name: "New Product", category: "Category", price: 100, stockLevel: 10 }
      };
  
      // Mock task that would be created
      const createdProduct = { _id: new mongoose.Types.ObjectId(), ...req.body, userId: req.user.id };
  
      // Stub Task.create to return the createdProduct
      
      createProductStub.resolves(createdProduct);
  
      // Mock response object
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };
  
      // Call function
      await addProduct(req, res);
  
      // Assertions
      expect(createProductStub.calledOnceWith({ userId: req.user.id, ...req.body })).to.be.true;
      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith(createdProduct)).to.be.true;
    });
  
    it('should return 500 if an error occurs', async () => {
      //stub create product to throw an error
      createProductStub.throws (new Error('DB Error'));
  
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
      expect(res.status.calledWithExactly(500)).to.be.true;
      expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
    });
  
  });
  


  //test update product 
  describe('Update Function Test', () => {

  let  updateProductStub;

  beforeEach(() => {
    updateProductStub = sinon.stub(Product, 'findById');
  });

  afterEach(() => {
    updateProductStub.restore(); 
  });
  
    it('should update product successfully', async () => {
      // Mock product data
      const productId = new mongoose.Types.ObjectId();
      const existingProduct = {
        _id: productId,
        name: "Old Product",
        category: "Old Category",
        price: 100,
        stockLevel: 50,
        save: sinon.stub().resolvesThis(), //mock save method
      };
      // stub product findbyid to trturn mock product
      updateProductStub.resolves(existingProduct);
  
      // Mock request & response
      const req = {
        params: { id: productId },
        body: { name: "Updated Product", category: "Updated Category" }
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
      expect(res.status.called).to.be.false; 
      expect(res.json.calledOnce).to.be.true;
    });
  
    it('should return 404 if task is not found', async () => {
     updateProductStub.resolves(null);
  
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
  
    });
  
    it('should return 500 on error', async () => {
       updateProductStub.throws(new Error('DB Error'));
  
      const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };
  
      await updateProduct(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.called).to.be.true;

    });
  
  });
  

  //test get all product
  describe('GetProduct Function Test', () => {
    let  getproductsStub;

    beforeEach(() => {
      getproductsStub = sinon.stub(Product, 'find');
    });

    afterEach(() => {
      getproductsStub.restore(); 
    });

  
    it('should return products for the given user', async () => {
      const userId = new mongoose.Types.ObjectId();
  
      // Mock task data
      const products = [
        { _id: new mongoose.Types.ObjectId(), name: "Product 1", userId },
        { _id: new mongoose.Types.ObjectId(), name: "Product 2", userId }
      ];
  
      // Stub product.find to return mock tasks
      getproductsStub.resolves(products);
  
      // Mock request & response
      const req = { user: { id: userId } };
      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis()
      };
  
      // Call function
      await getProducts(req, res);
  
      // Assertions
      expect(getproductsStub.calledOnceWith({ userId })).to.be.true;
      expect(res.json.calledWith(products)).to.be.true;
      expect(res.status.called).to.be.false; 
      
  
    });
    
    it('should return 500 on error', async () => {
      // Stub Product.find to throw an error
      getproductsStub.throws(new Error('DB Error'));
  
      // Mock request & response
      const req = { user: { id: new mongoose.Types.ObjectId().toString() } };
      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis()
      };
  
      // Call function
      await getProducts(req, res);
  
      // Assertions
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWithMatch({ message: "Error: DB Error" })).to.be.true;
    });
  
  });



  //test get product by ID
  describe("GetProductById Function Test", () => {
    let  getproductByIdStub;

    beforeEach(() => {
      getproductByIdStub = sinon.stub(Product, 'findById');
    });

    afterEach(() => {
      getproductByIdStub.restore(); 
    });
  
    it("should return a product successfully", async () => {
      // Mock request data
      const req = { params: { id: new mongoose.Types.ObjectId().toString() } };
  
      // Mock product found in the database
      const mockProduct = { _id: req.params.id, name: "Test Product", category: "Category 2", price: 200, stockLevel: 30 };
  
      // Stub Product.findById to return the mock product
      getproductByIdStub.resolves(mockProduct);
  
      // Mock response object
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };
  
      // Call function
      await getProductById(req, res);
  
      // Assertions
      expect(getproductByIdStub.calledOnceWith(req.params.id)).to.be.true;
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(mockProduct)).to.be.true;
    });
  
    it("should return 404 if product is not found", async () => {
      // Stub Product.findById to return null
      getproductByIdStub.resolves(null);
  
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
      expect(getproductByIdStub.calledOnceWith(req.params.id)).to.be.true;
      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ message: "Product not found" })).to.be.true;
    });
  
    it("should return 500 if an error occurs", async () => {
    
      getproductByIdStub.throws(new Error("DB Error"));
  
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
    });
  
  });
  
  //test delete product
  
  describe('DeleteProduct Function Test', () => {
    let  deleteproductStub;

    beforeEach(() => {
      deleteproductStub = sinon.stub(Product, 'findById');
    });

    afterEach(() => {
      deleteproductStub.restore(); 
    });

    it('should delete a product successfully', async () => {
      // Mock request data
      const req = { params: { id: new mongoose.Types.ObjectId().toString() } };
  
      // Mock product found in the database
      const product = { remove: sinon.stub().resolves() };
  
      // Stub Task.findById to return the mock task
      deleteproductStub.resolves(product);
  
      // Mock response object
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      // Call function
      await deleteProduct(req, res);

      // Assertions
      expect(deleteproductStub.calledOnceWith(req.params.id)).to.be.true;
      expect(product.remove.calledOnce).to.be.true;
      expect(res.json.calledWith({ message: 'Product deleted' })).to.be.true;
  
    });
  
    it('should return 404 if product is not found', async () => {
      //stub findbyid to return null
      deleteproductStub.resolves(null);
  
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
      expect(deleteproductStub.calledOnceWith(req.params.id)).to.be.true;
      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ message: 'Product not found' })).to.be.true;
  
    });
  
    it('should return 500 if an error occurs', async () => {
      
      deleteproductStub.throws(new Error('DB Error'));
  
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
    });
  
  });


