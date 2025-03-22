const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');
const User = require('../models/user');

const { expect } = chai;
chai.use(chaiHttp);

describe('Auth API', () => {
    let token = '';

    before(async () => {
        // Clear the users 
        await User.deleteMany({});
    });

    it('should sign up a new user', async () => {
        const res = await chai.request(app)
            .post('/api/auth/signup')
            .send({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123'
            });

        expect(res).to.have.status(201);
        expect(res.body).to.have.property('token');
        token = res.body.token;
    });

    it('should log in a user', async () => {
        const res = await chai.request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@example.com',
                password: 'password123'
            });

        expect(res).to.have.status(200);
        expect(res.body).to.have.property('token');
    });

    it('should deny access to a protected route without a token', async () => {
        const res = await chai.request(app)
            .get('/api/products')
            .send();

        expect(res).to.have.status(401);
        expect(res.body.message).to.equal('Not authorized, no token');
    });
});
