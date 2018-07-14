'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var https = require('https');

// **********************************************
// *** Update or verify the following values. ***
// **********************************************

// Replace the accessKey string value with your valid access key.
var accessKey = '3d34c6c96d924a99beb8966f20fbbc2e';

// Replace or verify the region.

// You must use the same region in your REST API call as you used to obtain your access keys.
// For example, if you obtained your access keys from the westus region, replace
// "westcentralus" in the URI below with "westus".

// NOTE: Free trial access keys are generated in the westcentralus region, so if you are using
// a free trial access key, you should not need to change this region.
var uri = 'westcentralus.api.cognitive.microsoft.com';
var sentPath = '/text/analytics/v2.0/sentiment';
var phrasePath = '/text/analytics/v2.0/keyPhrases';


var sentiment_response_handler = function sentiment_response_handler(response, callback) {
  var body = '';
  response.on('data', function (d) {
      body += d;
  });
  response.on('end', function () {
      var body_ = JSON.parse(body);
      // let body__ = JSON.stringify (body_, null, '  ');
      callback(body_.documents[0].score)
  });
  response.on('error', function (e) {
      console.log('Error: ' + e.message);
  });
};

var phrase_response_handler = function phrase_response_handler(response) {
    var body = '';
    response.on('data', function (d) {
        body += d;
    });
    response.on('end', function () {
        var body_ = JSON.parse(body);
        // let body__ = JSON.stringify (body_, null, '  ');
        console.log(body_.documents[0].keyPhrases);
    });
    response.on('error', function (e) {
        console.log('Error: ' + e.message);
    });
};


var get_sentiments = function get_sentiments(documents, callback) {

    var body = JSON.stringify(documents);

    var request_params = {
        method: 'POST',
        hostname: uri,
        path: sentPath,
        headers: {
            'Ocp-Apim-Subscription-Key': accessKey
        }
    };

    var req = https.request(request_params, (response) => sentiment_response_handler(response, callback));
    req.write(body);
    req.end();
};

var get_key_phrases = function get_key_phrases(documents) {
    var body = JSON.stringify(documents);

    var request_params = {
        method: 'POST',
        hostname: uri,
        path: phrasePath,
        headers: {
            'Ocp-Apim-Subscription-Key': accessKey
        }
    };

    var req = https.request(request_params, phrase_response_handler);
    req.write(body);
    req.end();
};

exports.get_sentiments = get_sentiments;
exports.get_key_phrases = get_key_phrases;
