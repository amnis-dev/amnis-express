import express from 'express';
import request from 'supertest';

import { contextSetup } from '@amnis/state/context';
import { schemaState } from '@amnis/state/schema';
import { schemaAuth } from '@amnis/api/schema';
import type {
  Challenge,
  EntityObjects,
  IoContext,
  IoOutput,
} from '@amnis/state';
import {
  agentSign,

  base64JsonEncode,
  accountsGet,
} from '@amnis/state';
import { processAuth } from '@amnis/api/process';
import { routerCreate } from './router.js';

let context: IoContext;
const app = express();

beforeAll(async () => {
  context = await contextSetup({
    schemas: [schemaState, schemaAuth],
  });

  app.use('/auth', routerCreate(context, processAuth));
});

describe('Auth Router', () => {
  test('should create challenge and login with default user account', async () => {
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
      .post('/auth/challenge')
      .set('Accept', 'application/json')
      .send({});

    const responseJsonChallenge = JSON.parse(responseChallenge.text) as IoOutput<Challenge>['json'];

    const challenge = responseJsonChallenge.result;
    if (!challenge) {
      expect(challenge).toBeDefined();
      return;
    }

    const challengeEncoded = base64JsonEncode(challenge);

    /**
     * Create a sigature of the request.
     */
    const signatureEncoded = await agentSign(JSON.stringify(body));

    const response = await request(app)
      .post('/auth/login')
      .set('Accept', 'application/json')
      .set('Challenge', challengeEncoded)
      .set('Signature', signatureEncoded)
      .send(body);

    const cookies = response.header['set-cookie'] as string[];

    expect(cookies).toHaveLength(1);
    expect(cookies[0]).toMatch(/coreSession=[a-zA-Z0-9%_-]+; Path=\/; HttpOnly; Secure; SameSite=None/);

    const responseJson = JSON.parse(response.text) as IoOutput<EntityObjects>['json'];

    expect(response.status).toBe(200);
    expect(responseJson).toBeDefined();
    expect(responseJson.logs.filter((l) => l.level !== 'success').length).toBe(0);

    const state = responseJson.result;

    if (!state) {
      expect(state).toBeDefined();
      return;
    }

    expect(Object.keys(state).length).toBeGreaterThan(0);
  });
});
