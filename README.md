# [Stock Price Checker](https://freecodecamp.org/learn/information-security/information-security-projects/stock-price-checker)

This project is an assignment project created by FCC for Information Security Certification.

#### Link to project

https://boilerplate-project-stockchecker.salstatice.repl.co

## Instructions

1. SET NODE_ENV to test without quotes and set DB to your MongoDB connection string
2. Complete the project in routes/api.js or by creating a handler/controller
3. You will add any security features to server.js
4. You will create all of the functional tests in tests/2_functional-tests.js

## User Story

1. You should set the content security policies to only allow loading of scripts and CSS from your server.

2. You can send a GET request to /api/stock-prices, passing a NASDAQ stock symbol to a stock query parameter. The returned object will contain a property named stockData.

3. The stockData property includes the stock symbol as a string, the price as a number, and likes as a number.

4. You can also pass along a like field as true (boolean) to have your like added to the stock(s). Only 1 like per IP should be accepted.

5. If you pass along 2 stocks, the returned value will be an array with information about both stocks. Instead of likes, it will display rel_likes (the difference between the likes on both stocks) for both stockData objects.

6. All 5 functional tests are complete and passing.

