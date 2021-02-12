# splitio-sdk-promise-example

This repository contains a minimal working example of some strange undocumented change in behavior with the Split.io Javascript SDK's `SplitManager`'s (and `SplitClient`'s) `.ready()` methods. Somewhere between SDK versions `10.12.1` and `10.15.3`, the behavior of these `ready` promises changed when using `await/async`, causing our integration to break in an unexpected way while trying to update to the latest Split SDK version.

Long story short, with version `10.12.1` of the Split SDK, `await splitManager.ready()` will never reject or throw; it only ever resolves, even when an `SDK_READY_TIMED_OUT` event is emitted internally within the SDK. With `10.15.3`, a promise "rejection" seemingly does not do anything; the program hangs on the `await splitManager.ready()` indefinitely, even after an internal timeout event. In either case, `await`ing on the `.ready()` call is unsuitable for catching promise rejections.

In both Split SDK versions, chaining a `.then()` or `.catch()` on the `.ready()` call (without using `await`) works as expected, but the inconsistent behavior when using `await` is confusing, and seemingly renders e.g., `await splitManager.ready()` unuseable if a timeout is ever expected to occur.

We were previously `await`ing the `.ready()` calls, and attempting to catch promise rejections in a `try/catch` block, but while updating the Split SDK, discovered that our `catch` blocks were actually never being reached, even on timeouts. Our main question is how should `.ready()` be called? It presents as if it's safe to use `await/async` syntax with, but it seems like we should only ever be chaining it with `.then()` and `.catch()`. (Is this documented somewhere?)

## Running the tests

By default, version `10.15.3` of the Split SDK is used. These tests were developed using Node version `12.14.1`, but should also work with Node 14.

```
npm i
npm run test
```

With version `10.15.3`, the first test should pass and the second should fail. To test with version `10.12.1`:

```
npm i @splitsoftware/splitio@10.12.1
npm run test
```

With version `10.12.1`, the first test should fail and the second should pass.

To re-test with `10.15.3`, re-install the correct version with

```
npm i @splitsoftware/splitio@10.15.3
```
