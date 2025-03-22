//test product CRUD
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');
const Product = require('../models/productModel');
const { protect } = require('../middleware/authMiddleware');

const { expect } = chai;
chai.use(chaiHttp);

describe('Product API', () => {
    let token = '';

    before(async () => {
        await Product.deleteMany({}); // Clear database before test
        const authRes = await chai.request(app)
            .post('/api/auth/signup')
            .send({ name: 'User', email: 'user@example.com', password: 'password123' });

        token = authRes.body.token;
    });

    it('should create a product', async () => {
        const res = await chai.request(app)
            .post('/api/products')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Product1', price: 100, stock: 10 });

        expect(res).to.have.status(201);
        expect(res.body).to.have.property('_id');
    });

    it('should fetch all products', async () => {
        const res = await chai.request(app)
            .get('/api/products')
            .set('Authorization', `Bearer ${token}`);

        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
    });
});
