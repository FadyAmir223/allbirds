import request from 'supertest';
import { v4 as uuidv4 } from 'uuid';

import app from '../../app.js';
import User from '../../models/user/user.mongo.js';
import { server } from '../../test/test.utils.js';
import { loginData, userData } from '../../test/test.data.js';

describe('/auth', () => {
  beforeAll(async () => {
    await server.post('/api/auth/local/signup').send(userData);
  });

  describe('/local', () => {
    describe('POST /signup', () => {
      test('create account', async () => {
        await server
          .post('/api/auth/local/signup')
          .send({ ...userData, email: 'fadyamir223@gmail.com' })
          .expect(201)
          .expect('Content-Type', /json/)
          .expect({ message: 'user created' });
      });

      test('some fields are empty', async () => {
        await server
          .post('/api/auth/local/signup')
          .send({ ...userData, lastName: '' })
          .expect(400)
          .expect('Content-Type', /json/)
          .expect({ message: 'some fields are empty' });
      });

      test('non matched passwords', async () => {
        await server
          .post('/api/auth/local/signup')
          .send({ ...userData, password: 'non-match' })
          .expect(400)
          .expect('Content-Type', /json/)
          .expect({ message: 'non matched passwords' });
      });

      test('password not complex enough', async () => {
        await server
          .post('/api/auth/local/signup')
          .send({ ...userData, password: '1234', confirmPassword: '1234' })
          .expect(400)
          .expect('Content-Type', /json/)
          .expect({ message: 'password not complex enough' });
      });

      test('email already used', async () => {
        await server
          .post('/api/auth/local/signup')
          .send(userData)
          .expect(409)
          .expect('Content-Type', /json/)
          .expect({ message: 'email already used' });
      });

      test('already logged in', async () => {
        const agent = request.agent(app);

        await agent.post('/api/auth/local/login').send(loginData);

        await agent
          .post('/api/auth/local/signup')
          .expect(401)
          .expect('Content-Type', /json/)
          .expect({ message: 'you must logout first' });
      });
    });

    describe('/login', () => {
      test('login', async () => {
        await server
          .post('/api/auth/local/login')
          .send(loginData)
          .expect(200)
          .expect('Content-Type', /json/)
          .expect({ login: true });
      });

      test('wrong user', async () => {
        await server
          .post('/api/auth/local/login')
          .send({ username: 'not-exist', password: '1234' })
          .expect(401);
      });
    });

    describe('/logout', () => {
      test('logout', async () => {
        const agent = request.agent(app);

        await agent.post('/api/auth/local/login').send(loginData);

        await agent
          .post('/api/auth/logout')
          .expect(200)
          .expect('Content-Type', /json/)
          .expect({ logout: true });
      });

      test('already logged out', async () => {
        await server
          .post('/api/auth/logout')
          .expect(401)
          .expect('Content-Type', /json/)
          .expect({ message: 'you must login first' });
      });
    });
  });

  describe('/verify/:verifyToken', () => {
    test('valid token for email', async () => {
      const { verifyToken } = await User.findOne(
        { email: userData.email },
        'verifyToken'
      ).lean();

      const { body } = await server
        .get(`/api/auth/verify/${verifyToken}`)
        .expect(200)
        .expect('Content-Type', /json/);

      expect(body.verified).toBeTruthy();
    });

    test('short token', async () => {
      await server
        .get('/api/auth/verify/short-token')
        .expect(400)
        .expect('Content-Type', /json/)
        .expect({ message: 'invalid verification id' });
    });

    test('wrong token', async () => {
      const wrongToken = uuidv4();

      const { body } = await server
        .get(`/api/auth/verify/${wrongToken}`)
        .expect(401)
        .expect('Content-Type', /json/);

      expect(body.verified).toBeFalsy();
    });
  });

  describe('/password', () => {
    describe('/request-reset-token', () => {
      test('no email provided', async () => {
        await server
          .post('/api/auth/password/request-reset-token')
          .expect(400)
          .expect('Content-Type', /json/)
          .expect({ message: 'no email provided' });
      });

      test('email not verified', async () => {
        const email = 'notverfied@gmail.com';

        await server
          .post('/api/auth/local/signup')
          .send({ ...userData, email });

        await server
          .post('/api/auth/password/request-reset-token')
          .send({ email })
          .expect(401);
      });

      test('email verified', async () => {
        const email = 'verified@gmail.com';

        await server
          .post('/api/auth/local/signup')
          .send({ ...userData, email });

        const { verifyToken } = await User.findOne(
          { email },
          'verifyToken'
        ).lean();

        await server.get(`/api/auth/verify/${verifyToken}`);

        await server
          .post('/api/auth/password/request-reset-token')
          .send({ email })
          .expect(200)
          .expect('Content-Type', /json/)
          .expect({ message: `email has been sent to ${email}` });
      });
    });

    describe('/verify-reset-token', () => {
      test('token not provided', async () => {
        await server
          .post('/api/auth/password/verify-reset-token')
          .expect(400)
          .expect('Content-Type', /json/)
          .expect({ message: 'some fields not provided' });
      });

      test('wrong token', async () => {
        const email = 'wrong_token_email@gmail.com';

        await server
          .post('/api/auth/local/signup')
          .send({ ...userData, email });

        const { _id, verifyToken } = await User.findOne(
          { email: userData.email },
          '_id verifyToken'
        ).lean();

        await server.get(`/api/auth/verify/${verifyToken}`);

        await server
          .post('/api/auth/password/verify-reset-token')
          .send({ uid: _id, token: uuidv4() })
          .expect(401)
          .expect('Content-Type', /json/)
          .expect({ verified: false });
      });
    });

    describe('/reset', () => {
      test('some fields are empty', async () => {
        await server
          .post('/api/auth/password/reset')
          .expect(400)
          .expect('Content-Type', /json/)
          .expect({ message: 'some fields are empty' });
      });

      test('non matched passwords', async () => {
        await server
          .post('/api/auth/password/reset')
          .send({
            uid: '000000000000000000000000',
            token: 'token',
            password: 'password',
            confirmPassword: 'non-match',
          })
          .expect(400)
          .expect('Content-Type', /json/)
          .expect({ message: 'non matched passwords' });
      });

      test('password not complex enough', async () => {
        await server
          .post('/api/auth/password/reset')
          .send({
            uid: '000000000000000000000000',
            token: 'token',
            password: '1234',
            confirmPassword: '1234',
          })
          .expect(400)
          .expect('Content-Type', /json/)
          .expect({ message: 'password not complex enough' });
      });

      test('invalid token length', async () => {
        await server
          .post('/api/auth/password/reset')
          .send({
            uid: '000000000000000000000000',
            token: 'token',
            password: 'P@ssw0rd',
            confirmPassword: 'P@ssw0rd',
          })
          .expect(400)
          .expect('Content-Type', /json/)
          .expect({ message: 'invalid token' });
      });

      test('invalid token', async () => {
        const email = 'wrong_token_reset@gmail.com';

        await server
          .post('/api/auth/local/signup')
          .send({ ...userData, email });

        const { _id, verifyToken } = await User.findOne(
          { email },
          '_id verifyToken'
        ).lean();

        await server.get(`/api/auth/verify/${verifyToken}`);

        await server
          .post('/api/auth/password/request-reset-token')
          .send({ email });

        const data = {
          uid: String(_id),
          token: uuidv4(),
          password: 'P@ssw0rd',
          confirmPassword: 'P@ssw0rd',
        };

        await server
          .post('/api/auth/password/reset')
          .send(data)
          .expect(401)
          .expect('Content-Type', /json/)
          .expect({ message: 'invalid token' });
      });
    });
  });
});
