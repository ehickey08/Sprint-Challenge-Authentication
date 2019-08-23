const request = require('supertest');
const db = require('../database/dbConfig');
const server = require('../api/server');

describe('jokes router', () => {
    beforeAll(async () => {
        await db.seed.run();
        return loginResponse = await request(server)
            .post('/api/auth/login')
            .send({ username: 'Bill', password: '1234' });
    });

    it('should return list of jokes in json', async () => {
        const response = await request(server).get('/api/jokes');
        expect(response.type).toMatch(/json/);
    });

    it('should require valid json token to get jokes', async () => {
        const response = await request(server)
            .get('/api/jokes')
            .set({ Authorization: loginResponse.body.token });
        expect(response.body).toHaveLength(20);
    });
});
