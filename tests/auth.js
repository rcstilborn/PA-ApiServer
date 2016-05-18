var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;

var auth = require('../auth.js');

describe('CartSummary', function() {
  it('getSubtotal() should return 0 if no items are passed in', function() {
    var cartSummary = new CartSummary([]);
    expect(cartSummary.getSubtotal()).to.equal(0);
  });
});
