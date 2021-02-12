'use strict';

import { expect } from 'chai';
import { SplitFactory } from '@splitsoftware/splitio';

function getSplitManager(authorizationKey) {
  const factory = SplitFactory({
    core: {
      authorizationKey
    },
    startup: {
      readyTimeout: 15
    }
  })
  return factory.manager();
}

describe('manager .ready() promise', () => {
  it('should hang indefinitely with 10.15.3', async function () {
    // With 10.15.3, the ready call will not timeout at 15s.
    // If we're still waiting after 16s, this test will pass.
    const timeoutPromise = new Promise((resolve) => {
      setTimeout(resolve, 16000, 'ready is hanging');
    });

    const readyPromise = new Promise(async (resolve) => {
      const splitManager = getSplitManager('fake-api-key');
      try {
        await splitManager.ready();
      } catch (e) {
        expect.fail('We will never throw an error in either SDK version');
      }
      resolve('ready returned');
    });

    const result = await Promise.race([timeoutPromise, readyPromise]);

    expect(result).to.equal('ready is hanging');
  }).timeout(20000);

  it('should silently resolve with 10.12.1', async function () {
    // With 10.12.1, the ready call will return when the SDK times out at 15s,
    // but will not throw an error. If we're still waiting after 16s, this test will fail.
    const timeoutPromise = new Promise((resolve) => {
      setTimeout(resolve, 16000, 'ready is hanging');
    });

    const readyPromise = new Promise(async (resolve) => {
      const splitManager = getSplitManager('fake-api-key');
      try {
        await splitManager.ready();
      } catch (e) {
        expect.fail('We will never throw an error in either SDK version');
      }
      resolve('ready returned');
    });

    const result = await Promise.race([timeoutPromise, readyPromise]);

    expect(result).to.equal('ready returned');
  }).timeout(20000);
});
