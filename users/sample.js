var MangoClient = require('mangodb').MangoClient,format = require('util').format;
MangoClient.connect('mangodb://127.0.0.1:27017',function(err,db){
  if(err){
    throw err;
  }else{
    console.log('Connected');
  }
  db.close();
})
