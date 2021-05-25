const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  let stockA = 'amd';
  let stockB = 'fb';

  test("Test viewing one stock: GET request to /api/stock-prices/", function (done) {
    chai
      .request(server)
      .get("/api/stock-prices")
      .query({ stock: stockA, like: false})
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isNotNull(res.body.stockData);
        assert.equal(res.body.stockData.likes, 0);
        done();
      });
  });

  test("Viewing one stock and liking it: GET request to /api/stock-prices/", function (done) {
    chai
      .request(server)
      .get("/api/stock-prices")
      .query({ stock: stockA, like: true })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isNotNull(res.body.stockData);
        assert.equal(res.body.stockData.likes, 1);
        done();
      });
  });

  test("Viewing the same stock and liking it again: GET request to /api/stock-prices/", function (done) {
    chai
      .request(server)
      .get("/api/stock-prices")
      .query({ stock: stockA, like: true })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isNotNull(res.body.stockData);
        assert.equal(res.body.stockData.likes, 1);
        done();
      });
  });

  test("Viewing two stocks: GET request to /api/stock-prices/", function (done) {
    chai
      .request(server)
      .get("/api/stock-prices")
      .query({ stock: [stockA, stockB], like: false })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isNotNull(res.body.stockData);
        assert.isArray(res.body.stockData);
        assert.equal(res.body.stockData[0].rel_likes, 1);
        assert.equal(res.body.stockData[1].rel_likes, -1);
        done();
      });
  });
  
  test("Viewing two stocks and liking them: GET request to /api/stock-prices/", function (done) {
    chai
      .request(server)
      .get("/api/stock-prices")
      .query({ stock: [stockA, stockB], like: true })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isNotNull(res.body.stockData);
        assert.isArray(res.body.stockData);
        assert.equal(res.body.stockData[0].rel_likes, 0);
        assert.equal(res.body.stockData[1].rel_likes, 0);
        done();
      });
  });
});
