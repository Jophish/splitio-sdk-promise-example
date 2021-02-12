# splitio-sdk-promise-example

This repository contains a minimal working example of some strange undocumented change in behavior with the Split.io Javascript SDK's `SplitManager`'s (and `SplitClient`'s) `.ready()` methods. Somewhere between SDK versions `10.12.1` and `10.15.3`, the behavior of these `ready` promises changed, causing our integration to break in an unexpected way while trying to update to the latest Split SDK version.

Long story short, with version `10.12.1` of the Split SDK, we were able to wrap an `await splitManager.ready()` call in a try/catch, and a promise rejection would be successfully caught by the `catch` block. With `10.15.3`, a promise "rejection" seemingly does not do anything; the program hangs on the `await splitManager.ready()` indefinitely, even after e.g., a `SDK_READY_TIMED_OUT` event is emitted internally within the SDK. `.ready()` promise resolution works as expected in both SDK versions.

One workaround we discovered was by replacing try/catch blocks with, e.g. `await splitManager.ready().then(onResolution, onRejection)`, although we consider this somewhat hacky and less than ideal. This repo contains tests for the behavior of the `SplitManager`'s `.ready()` promise on both resolution and rejection for both the try/catch setup and using `.then()`.

## Running the tests

By default, version `10.15.3` of the Split SDK is used. The tests require a valid Split API key to test the case of promise resolution.

```
npm i
SPLIT_API_KEY=<split-api-key> npm run test
```

With version `10.15.3`, all tests should pass except `should be able to be caught with await & try/catch`. To test with version `10.12.1`:

```
npm i @splitsoftware/splitio@10.12.1
SPLIT_API_KEY=<split-api-key> npm run test
```

With version `10.12.1`, all tests should pass.

To re-test with `10.15.3`, re-install the correct version with

```
npm i @splitsoftware/splitio@10.15.3
```
