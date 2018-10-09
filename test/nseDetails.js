let nseDetails = require('../utils/nseDetails.js')
let assert = require('assert');

describe('NSE details', function() {

  describe('constructFileName', function() {

    it('should return valid zip filename for given dates 9/9/2018', function() {
      let day = 09, month = 9, year = 2018
      let val = nseDetails.constructZipFileName(day, month, year)
      assert.equal(val , "cm09SEP2018bhav.csv.zip");
    });

    it('should return valid csv filename for given dates 3/19/2018', function(){
      let day = 19, month = 3, year = 2018
      let val = nseDetails.constructZipFileName(day, month, year, true)
      assert.equal(val , "cm19MAR2018bhav.csv");
    })

  });

  describe('constructFileURL', function(){

    it('should return valid URL for given date 2018/SEP/cm09SEP2018bhav.csv.zip', function(){
      let day = 09, month = 9, year = 2018
      let val = nseDetails.constructFileURL(day, month, year)
      assert.equal(val, "https://www.nseindia.com/content/historical/EQUITIES/2018/SEP/cm09SEP2018bhav.csv.zip")
    })

  })

});
