// TODO: Add async plugin to waterfall async calls

var mongo = require('mongodb').MongoClient
var dbUrl = process.env.IMAGE_SEARCH_DB_URI;
var express = require("express")
var app = express()

var port = process.env.PORT || 8080;

app.get('/api/imagesearch/:searchterm', function(req,res){

    var searchTerm = req.params["searchterm"]
    if (!searchTerm) {
        searchTerm = ""
    }
    var offset = req.query.offset
    if (!offset) {
        offset = ""
    }
    var currentTime = new Date();
    var doc = {term : searchTerm, when : currentTime}
    
    // TODO: GET & DISPLAY ALL RELEVANT SEARCH RESULTS
    
    // Insert query info
    mongo.connect(dbUrl, function(err, db) {
      if(err) throw err

      var queries = db.collection('queries');
      queries.insert(doc, function(err, data) {
          if(err) throw err
          db.close()
          res.send(data.ops[0])
      })
    })
})

app.get('/api/latest/imagesearch', function(req,res){
    mongo.connect(dbUrl, function(err, db) {
        if(err) throw err
        var queries = db.collection('queries')
        
        queries.find().toArray(function(err,documents){
            if(err) throw err
            db.close()
            console.log(documents)
            res.send(documents)
        })
    })
})

app.listen(port, function(){
    console.log("Port listening on: " + port)
})