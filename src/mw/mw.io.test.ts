import express from 'express';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import type { IoContext } from '@amnis/state';
import { ioOutput } from '@amnis/state';
import { contextSetup } from '@amnis/state/context';
import { mwIo } from './mw.io.js';

let context: IoContext;
const app = express();

beforeAll(async () => {
  context = await contextSetup();

  app.use(express.json());
  app.use(cookieParser());
  app.use(mwIo(context));

  app.get('/input-basic', (req, res) => {
    expect(req.input).toBeDefined();
    expect(req.input.body).toEqual({});
    expect(req.input.accessEncoded).toBeUndefined();
    expect(req.input.challengeEncoded).toBeUndefined();
    expect(req.input.signatureEncoded).toBeUndefined();
    expect(req.input.otpEncoded).toBeUndefined();

    res.status(200).json({});
  });

  app.get('/input-headers', (req, res) => {
    expect(req.input).toBeDefined();
    expect(req.input.body).toEqual({});
    expect(req.input.accessEncoded).toBe('access_encoded');
    expect(req.input.challengeEncoded).toBe('challenge_encoded');
    expect(req.input.signatureEncoded).toBe('signature_encoded');
    expect(req.input.otpEncoded).toBe('otp_encoded');

    res.status(200).json({});
  });

  app.get('/output-cookie', (req, res) => {
    const output = ioOutput();
    output.cookies.myCookie = 'yum';
    res.out(output);
  });

  app.get('/output-param/:param', (req, res) => {
    expect(req.input);
    expect(req.params.param).toBeDefined();
    req.input.param = req.params.param;
    expect(req.input.param).toEqual('my_parameter');
    res.status(200).json({});
  });

  app.get('/output-query', (req, res) => {
    expect(req.input);
    expect(req.input.query).toBeTypeOf('object');
    expect(req.input.query).toEqual({
      myQuery: 'my_value',
    });

    res.status(200).json({});
  });
});

describe('I/O Middleware', () => {
  test('should respond successfully', async () => {
    const response = await request(app)
      .get('/input-basic')
      .send({})
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
  });

  test('should set headers on input and respond successfully', async () => {
    const response = await request(app)
      .get('/input-headers')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer access_encoded')
      .set('Challenge', 'challenge_encoded')
      .set('Signature', 'signature_encoded')
      .set('Otp', 'otp_encoded')
      .set('Accept', 'application/json')
      .send({});

    expect(response.status).toBe(200);
  });

  test('should set cookie on output and respond successfuly', async () => {
    const response = await request(app)
      .get('/output-cookie')
      .set('Accept', 'application/json')
      .send({});

    expect(response.status).toBe(200);

    const cookies = response.header['set-cookie'] as string[];

    expect(cookies).toHaveLength(1);
    expect(cookies[0]).toBe('myCookie=yum; Path=/; HttpOnly; Secure; SameSite=None');
  });

  test('should set param on input and respond successfully', async () => {
    const response = await request(app)
      .get('/output-param/my_parameter')
      .set('Accept', 'application/json')
      .send({});

    expect(response.status).toBe(200);
  });

  test('should set query on input and respond successfully', async () => {
    const response = await request(app)
      .get('/output-query?myQuery=my_value')
      .set('Accept', 'application/json')
      .send({});

    expect(response.status).toBe(200);
  });
});
