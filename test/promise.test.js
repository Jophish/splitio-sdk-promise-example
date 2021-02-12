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
  describe('rejection', () => {
    it('should be able to be caught with await & try/catch', async () => {
      const splitManager = getSplitManager('fake-api-key')
      let shouldBeTrue = false;

      try {
        await splitManager.ready();
      } catch (e) {
        console.log(e);
        shouldBeTrue = true;
      }

      expect(shouldBeTrue).to.be.true;
    }).timeout(16000);

    it('should be able to be handled with await and promise .catch', async () => {
      const splitManager = getSplitManager('fake-api-key')
      let shouldBeTrue = false;

      await splitManager.ready().catch((e) => {
        console.log(e);
        shouldBeTrue = true;
      });

      expect(shouldBeTrue).to.be.true;
    }).timeout(16000);
  });

  describe('resolution', () => {
    it('should resolve with await', async () => {
      const splitManager = getSplitManager(process.env.SPLIT_API_KEY)
      let shouldBeTrue = false;

      try {
        await splitManager.ready()
        shouldBeTrue = true;
      } catch (e) {
        console.log(e);
      }

      expect(shouldBeTrue).to.be.true;
    }).timeout(16000);

    it('should resolve with await and promise .then', async () => {
      const splitManager = getSplitManager(process.env.SPLIT_API_KEY)
      let shouldBeTrue = false;

      await splitManager.ready().then(
        () => {
          shouldBeTrue = true;
        },
        (e) => {
          console.log(e);
      });

      expect(shouldBeTrue).to.be.true;
    }).timeout(16000);
  });
});
