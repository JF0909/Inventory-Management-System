//test supplier manage
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');
const Supplier = require('../models/supplierModel');

const { expect } = chai;
chai.use(chaiHttp);

describe('Supplier API', () => {
    let token = '';

    before(async () => {
        await Supplier.deleteMany({});
        const authRes = await chai.request(app)
            .post('/api/auth/signup')
            .send({ name: 'SupplierUser', email: 'supplier@example.com', password: 'password123' });

        token = authRes.body.token;
    });

    it('should create a new supplier', async () => {
        const res = await chai.request(app)
            .post('/api/suppliers')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Supplier A', email: 'supplierA@example.com', phone: '1234567890' });

        expect(res).to.have.status(201);
    });

    it('should fetch all suppliers', async () => {
        const res = await chai.request(app)
            .get('/api/suppliers')
            .set('Authorization', `Bearer ${token}`);

        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
    });
});
