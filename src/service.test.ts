import type {
  Challenge, EntityObjects, IoContext, IoOutput,
} from '@amnis/state';
import {
  profileSlice,
  accountsGet, agentSign, base64JsonEncode,
} from '@amnis/state';
import { contextSetup } from '@amnis/state/context';
import type { Express } from 'express';
import { processAuth, processCrud } from '@amnis/api/process';
import { schemaAuth } from '@amnis/api/schema';
import { schemaState } from '@amnis/state/schema';
import request from 'supertest';
import { serviceSetup } from './service.js';

let app: Express;
let context: IoContext;

beforeAll(async () => {
  context = await contextSetup({
    schemas: [schemaAuth, schemaState],
  });

  app = serviceSetup({
    context,
    routes: {
      auth: processAuth,
      crud: processCrud,
    },
    baseUrl: '/api',
  });
});

test('should create challenge and login with default user account and perform basic read', async () => {
  /**
   * Get default accounts.
   */
  const accountUser = (await accountsGet()).user;

  /**
   * Define the request body.
   */
  const body = {
    handle: accountUser.handle,
    credential: accountUser.credential,
    password: accountUser.password,
  };

  /**
   * Request a challenge.
   */
  const responseChallenge = await request(app)
    .post('/api/auth/challenge')
    .set('Accept', 'application/json')
    .send({});

  const responseJsonChallenge = JSON.parse(responseChallenge.text) as IoOutput<Challenge>['json'];

  const challenge = responseJsonChallenge.result;
  if (!challenge) {
    throw new Error('No challenge returned.');
  }

  const challengeEncoded = base64JsonEncode(challenge);

  /**
   * Create a sigature of the request.
   */
  const signatureEncoded = await agentSign(JSON.stringify(body));

  /**
   * Login with challenge and signature.
   */
  const responseLogin = await request(app)
    .post('/api/auth/login')
    .set('Accept', 'application/json')
    .set('Challenge', challengeEncoded)
    .set('Signature', signatureEncoded)
    .send(body);

  const cookies = responseLogin.header['set-cookie'] as string[];

  expect(cookies).toHaveLength(1);
  expect(cookies[0]).toMatch(/coreSession=[a-zA-Z0-9%_-]+; Path=\/; HttpOnly; Secure; SameSite=None/);

  const responseLoginJson = JSON.parse(responseLogin.text) as IoOutput<EntityObjects>['json'];

  expect(responseLogin.status).toBe(200);
  expect(responseLoginJson).toBeDefined();
  expect(responseLoginJson.logs.filter((l) => l.level !== 'success').length).toBe(0);

  const state = responseLoginJson.result;

  if (!state) {
    expect(state).toBeDefined();
    return;
  }

  expect(Object.keys(state).length).toBeGreaterThan(0);

  const bearerToken = responseLoginJson.bearers?.[0];
  if (!bearerToken) {
    throw new Error('No bearer token returned.');
  }

  /**
   * Read the user's profile.
   */
  const responseRead = await request(app)
    .post('/api/crud/read')
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${bearerToken}`)
    .send({
      [profileSlice.key]: {
        $query: {},
      },
    });

  const responseReadJson = JSON.parse(responseRead.text) as IoOutput<EntityObjects>['json'];

  expect(responseRead.status).toBe(200);
  expect(responseReadJson).toBeDefined();
  expect(responseReadJson.logs.filter((l) => l.level !== 'success').length).toBe(0);

  const stateRead = responseReadJson.result;
  if (!stateRead) {
    throw new Error('No state returned.');
  }
  expect(Object.keys(stateRead).length).toBeGreaterThan(0);
});
