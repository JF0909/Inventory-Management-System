const chai = require('chai');
const chaiHttp = require('chai-http');
const http = require('http');
const app = require('../server'); 
const connectDB = require('../config/db');
const sinon = require('sinon');
const mongoose = require('mongoose');
//import model
const Stock = require('../models/Stock');
//import stock controller
const {createStockLevel, updateStockLevel, getStockLevels, getStockByProductId, deleteStock } = require('../controllers/stockController');


chai.use(chaiHttp);
const { expect } = chai;

let server;
let port;

// test add stocklevel
describe('Create Stock Function Test', () => {
  let createStockStub;

  beforeEach(() => {
    createStockStub = sinon.stub(Stock.prototype, 'save');
  });

  afterEach(() => {
    createStockStub.restore(); 
  });

  it('should create a new stock successfully', async () => {
    const req = {
      body: {
        productId: new mongoose.Types.ObjectId(), 
        supplier: new mongoose.Types.ObjectId(),
        quantity: 100,                            
        reorderLevel: 10                           
      }
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    console.log('Creating stock with body:', req.body);

    // Stub the save function of Stock model to resolve
    createStockStub.resolves();

    console.log('Before calling createStockLevel');

    await createStockLevel(req, res);

    expect(createStockStub.calledOnce).to.be.true;
    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'Stock created successfully' })).to.be.true;
  });

  it('should return 500 if an error occurs during stock creation', async () => {
    const req = {
      body: {
        product: new mongoose.Types.ObjectId(),
        supplier: new mongoose.Types.ObjectId(),
        quantity: 100,
        reorderLevel: 10
      }
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    console.log('Creating stock with body:', req.body);


    // Stub the save function of Stock model to reject with an error
    createStockStub.rejects(new Error('Database error'));

    console.log('Before calling createStockLevel');

    await createStockLevel(req, res);

    console.log('After calling createStockLevel');

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'Database error' })).to.be.true;

  });
});


  //test update stock 
  describe('Update Function Test', () => {

    let updatestockStub;

    beforeEach(() => {
      updatestockStub = sinon.stub(Stock, 'findById');
    });

    afterEach(() => {
      updatestockStub.restore(); 
    });

    it('should update stock successfully', async () => {
      const stockId = new mongoose.Types.ObjectId();
      const existingStock = {
        _id: stockId,
        product: new mongoose.Types.ObjectId(),
        supplier: new mongoose.Types.ObjectId(),
        quantity: 100,
        reorderLevel: 10,

        save: sinon.stub().resolvesThis(),
      };
  
      updatestockStub.resolves(existingStock);
  
      const req = {
        params: { id: stockId },
        body: {
          product: new mongoose.Types.ObjectId(),
          supplier: new mongoose.Types.ObjectId(),
          quantity: 120,
          reorderLevel: 15,
        },
      };
  
      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis(),
      };
  
      await updateStockLevel(req, res);
  
      expect(updatestockStub.calledOnceWith(stockId)).to.be.true;
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({ message: 'Stock updated successfully' })).to.be.true;
    });
  });
  
  

  //test get stocklevel 
  describe('GetStockLevels Function Test', () => {
    let getstocksStub;
  
      beforeEach(() => {
        getstocksStub= sinon.stub(Stock, 'findOne');
        });
      
        afterEach(() => {
          getstocksStub.restore();
        });

    it('should return stock levels successfully', async () => {

      // mock the data from stocklevel
      const mockStockLevels = {
        product: new mongoose.Types.ObjectId(), 
        supplier: new mongoose.Types.ObjectId(), 
        quantity: 10,
        reorderLevel: 5,
      };

      //return mock stock use findone
      getstocksStub.resolves(mockStockLevels);
      
      //pass id as param
      const req = { params: { product: new mongoose.Types.ObjectId() } }; 
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      //call function
      await getStockLevels(req, res);

      expect(getstocksStub.calledOnce).to.be.true;
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(mockStockLevels)).to.be.true;
    });
  });

  //test get stock levels by id
  describe('GetStockByProductId Function Test', () => {
    
      let stockfindIdStub;
  
      beforeEach(() => {
        stockfindIdStub= sinon.stub(Stock, 'findOne');
        });
      
        afterEach(() => {
          stockfindIdStub.restore();
        });
  

    it('should return stock for a given product', async () => {
      const mockStock = {
        product: new mongoose.Types.ObjectId(),
        supplier: new mongoose.Types.ObjectId(),
        quantity: 10,
        reorderLevel: 10,
      };
  
      stockfindIdStub.resolves(mockStock);
  
      const req = { params: { product: new mongoose.Types.ObjectId() } };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };
  
      await getStockByProductId(req, res);
  
      expect(stockfindIdStub.calledOnceWith({ product: req.params.product })).to.be.true;
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(mockStock)).to.be.true;
    });
  });
  
  


  //test delete stocklevel
  describe('DeleteStock Function Test', () => {
    let deletestockfindByIdStub;

    beforeEach(() => {
      deletestockfindByIdStub= sinon.stub(Stock, 'findById');
      });
    
      afterEach(() => {
        deletestockfindByIdStub.restore();
      });

    it('should delete stock successfully', async () => {
      const req = { params: { id: new mongoose.Types.ObjectId().toString() } };
      const stock = { remove: sinon.stub().resolves() };
      deletestockfindByIdStub.resolves(stock);
      
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      await deleteStock(req, res);

      expect(deletestockfindByIdStub.calledOnceWith(req.params.id)).to.be.true;
      expect(stock.remove.calledOnce).to.be.true;
      expect(res.json.calledWith({ message: 'Stock deleted' })).to.be.true;
      
    });

    it('should return 404 if stock is not found', async () => {
       deletestockfindByIdStub.resolves(null);
      
      const req = { params: { id: new mongoose.Types.ObjectId().toString() } };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      await deleteStock(req, res);

      expect(deletestockfindByIdStub.calledOnceWith(req.params.id)).to.be.true;
      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ message: 'Stock not found' })).to.be.true;
    });
  });
