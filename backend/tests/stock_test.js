//test stock tracking and alert
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');
const Stock = require('../models/stockModel');

const { expect } = chai;
chai.use(chaiHttp);

describe('Stock API', () => {
    let token = '';

    before(async () => {
        await Stock.deleteMany({});
        const authRes = await chai.request(app)
            .post('/api/auth/signup')
            .send({ name: 'StockUser', email: 'stock@example.com', password: 'password123' });

        token = authRes.body.token;
    });

    it('should add stock for a product', async () => {
        const res = await chai.request(app)
            .post('/api/stock')
            .set('Authorization', `Bearer ${token}`)
            .send({ productId: '12345', quantity: 50 });

        expect(res).to.have.status(201);
    });

    it('should trigger low stock alert', async () => {
        const res = await chai.request(app)
            .post('/api/stock/alert')
            .set('Authorization', `Bearer ${token}`)
            .send({ productId: '12345', threshold: 10 });

        expect(res).to.have.status(200);
    });
});
