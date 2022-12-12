var express = require('express');
var router = express.Router();
const fetch = require('node-fetch');
var monk=require('monk')
var db=monk('localhost:27017/Airbnb')
var collection=db.get('favourites');

/* create favourites */
router.post('/', function(req, res, next) {

    collection.insert(req.body,(err,fav)=>{
        if(err) throw err;
        res.json(fav);
    });
   });

//delete a favourite
router.delete('/:propid', function(req, res) {
	collection.remove({ property: req.params.propid }, function(err, prop){
   
		if (err) throw err;
	  	res.json(prop);
	});
});  
module.exports=router  
    
