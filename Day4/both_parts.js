var sprintf = require('sprintf-js').sprintf;
var md5 = require('js-md5');

var secret = 'bgvyzdsv';
var number = 0;
var hash;

do {
	number++;
	hash = md5(secret + number);
} while(hash.indexOf('00000') !== 0);

console.log(sprintf('Secret number: %d, Hash: %s ', number, hash));

while(hash.indexOf('000000') !== 0) {
	number++;
	hash = md5(secret + number);
}

console.log(sprintf('Secret number: %d, Hash: %s ', number, hash));
