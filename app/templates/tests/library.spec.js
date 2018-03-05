/* global <%= functionName %> */

'use strict';
describe('<%= functionName %>', function () {
  it('return true', function () {
    return expect(<%= functionName %>()).to.be.true;
  });
});
