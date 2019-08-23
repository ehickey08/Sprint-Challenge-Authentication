const request = require('supertest');
const db = require('../database/dbConfig');
const server = require('../api/server');
const Users = require('../database/usersModel');

describe('auth router', () => {
    beforeAll(() => {
        return db.seed.run();
    });

    describe('register route', () => {
        it('should properly add to User db', async () => {
            const newUser = { username: 'Ethan', password: '1234' };
            const user = await Users.add(newUser);
            expect(user).toEqual(
                expect.objectContaining({
                    username: 'Ethan',
                    password: '1234',
                })
            );
        });

        it('should return the new User', done => {
            return request(server)
                .post('/api/auth/register')
                .send({ username: 'Will', password: '1234' })
                .expect('Content-Type', /json/)
                .expect(201, done);
        });
    });

    describe('login route', () => {
        it('db should find by username', async () => {
            const user = await Users.findByUsername('Bill');
            expect(user).toEqual(
                expect.objectContaining({
                    username: 'Bill',
                    password: expect.any(String),
                })
            );
        });

        it('should return 401 with invalid creds', async () => {
            const res = await request(server)
                .post('/api/auth/login')
                .send({ username: 'Bill', password: '123' });
            expect(res.status).toBe(401);
        });

        it('should return message and token on valid creds', async () => {
            const res = await request(server)
                .post('/api/auth/login')
                .send({ username: 'Bill', password: '1234' });
            expect(res.status).toBe(200);
            expect(res.body).toEqual(
                expect.objectContaining({
                    message: `Welcome Bill!`,
                    token: expect.any(String),
                })
            );
        });
    });
});
