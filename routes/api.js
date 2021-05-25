'use strict';
const https = require('https');
const mongoose = require("mongoose");
const Stock = require('../model.js').Stock;

module.exports = function (app) {
  // database connection
  mongoose.connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    }, function(error){
    if (error) {
      console.log(error);
    } else {
      console.log("connection successful");
    }
  });

  app.route('/api/stock-prices')
    .get(function (req, res){
      let ip = req.ip;
      let symbol = req.query.stock;
      let liked = (req.query.like == 'true') ? true : false;
      console.log(ip)
      console.log(symbol)

      const findStockOrCreate = async (symbol) => {
        try {
          let doc = await Stock.findOne({symbol: symbol});
          if (doc == null) {
            doc = new Stock({symbol: symbol, likes: 0});
            await doc.save({runValidators: true});
          }
          return doc
        } catch(err) {
          console.log(err)
        }
      }
      
      const getLikes = async (symbol, liked, ip) => {
        let doc = await findStockOrCreate(symbol);
        return new Promise((resolve, reject) => {
          try {
            if ((liked) && (! doc.ip.includes(ip))){
              Stock.findOneAndUpdate(
                { symbol: symbol }, 
                {$inc: {likes: 1}, $push: {ip: ip}}, 
                {runValidators: true, upsert: true, new: true},
                (err, data)=> {
                  if (err) { 
                    reject(err)
                  } else {
                    resolve(data.likes)
                  }
              })
            } else {
              resolve(doc.likes);
            }
          } catch(err) {
            reject(err)
          }
        })
        
      }
      
      // https://nodejs.dev/learn/making-http-requests-with-nodejs
      const getStockPrice = async (symbol) => {
        const path = '/v1/stock/' + symbol + '/quote'
        const options = {
          hostname: 'stock-price-checker-proxy.freecodecamp.rocks',
          port: 443,
          path: path,
          method: 'GET',
        }

        return new Promise((resolve, reject) => {
          const req = https.request(options, res => {
            let data = '';
            res.on('data', d => {
              data += d;
            })
            res.on('end', d => {
              try {
                let body = JSON.parse(data)
                let stock = {
                  'stock': body.symbol,
                  'price': body.latestPrice,
                }
                resolve(stock)
              } catch(err) {
                console.log(err)
              }
            })
          })

          req.on('error', error => {
            reject(error);
          })
          req.end();
        })
        // https://stackoverflow.com/a/41471647/14915561
        // return new Promise ((resolve, reject) => {
        //   let req = https.request(options);

        //   req.on('response', res => {
        //     resolve(res);
        //   });

        //   req.on('error', err => {
        //     reject(err);
        //   });
        // }); 
        // const req = https.request(options, res => {
        //   console.log(`statusCode: ${res.statusCode}`)

        //   res.on('data', d => {
        //     try {
        //       const price = JSON.parse(d).latestPrice
        //       console.log(price)
        //     } catch(err) {
        //       console.log(err)
        //     }
        //   })
        // })

        // req.on('error', error => {
        //   console.error(error)
        // })

        // req.end()
      }
      
      const getStock = async (symbol, liked, ip) => {
        let stock = await getStockPrice(symbol);
        let likes = await getLikes(symbol, liked, ip);
        
        stock['likes'] = likes;
        let result = {
          'stockData': stock, 
        }
        return result 
      }

      const getTwoStocks = async (symbols, liked, ip) => {
        let stockA = await getStockPrice(symbols[0]);
        let likesA = await getLikes(symbols[0], liked, ip);

        let stockB = await getStockPrice(symbols[1]);
        let likesB = await getLikes(symbols[1], liked, ip);

        stockA['rel_likes'] = likesA - likesB;
        stockB['rel_likes'] = likesB - likesA;

        let result = {
          'stockData': [stockA, stockB]
        }
        return result;
      }

      // process the request
      if (symbol) {
        // Get request for ONE stock
        if (!Array.isArray(symbol)) {
          getStock(symbol, liked, ip).then((data) => {
            res.json(data)
          });
        } else {
        // Get request for TWO stocks
          getTwoStocks(symbol, liked, ip).then((data) => {
            res.json(data)
          })
        }
      }
    });
    
};
