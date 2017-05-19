// TODO: Add async plugin to waterfall async calls
var path = require('path')
var mongo = require('mongodb').MongoClient
var dbUrl = process.env.IMAGE_SEARCH_DB_URI;
var express = require("express")
var app = express()

var port = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/imagesearch/*', function(req,res){

    var searchTerm = req.params[0]
    if (!searchTerm) {
        searchTerm = ""
    }
    console.log("searchTerm: "+ searchTerm)
    
    var pageLimit = 1
    var offset = Number(req.query.offset)
    if (!offset || isNaN(offset)) {
        offset = 0
    }
    
    var currentTime = new Date();
    var doc = {term : searchTerm, when : currentTime}
    
    // Insert query info
    mongo.connect(dbUrl, function(err, db) {
      if(err) throw err

      var queries = db.collection('queries');
      queries.insert(doc, function(err, data) {
          if(err) throw err
          
          var images = db.collection('images');
          var regex = new RegExp(searchTerm,"i");
          images.find({'snippet': {$regex : regex} }).skip(offset)
          .limit(pageLimit).toArray(function(err, data) {
            if(err) throw err
            db.close()
            res.send(data)
          })
      })
    })
})

app.get('/api/latest/imagesearch', function(req,res){
    mongo.connect(dbUrl, function(err, db) {
        if(err) throw err
        var queries = db.collection('queries')
        
        queries.find().sort({'when':-1}).toArray(function(err,documents){
            if(err) throw err
            db.close()
            res.send(documents)
        })
    })
})

app.get('/api/latest/addimage', function(req,res){
    var imageUrl = req.query.url
    var imageSnippet = req.query.snippet
    if(!imageUrl || !imageSnippet)
        return res.send('Invalid request')
    
    mongo.connect(dbUrl, function(err, db) {
        if(err) throw err
        var doc = {url: imageUrl,snippet: imageSnippet}
        
        var images = db.collection('images');
        images.insert(doc, function(err, data) {
            if(err) throw err
            db.close()
            res.send(data.ops[0])
        })
    })
})

app.listen(port, function(){
    console.log("Port listening on: " + port)
})