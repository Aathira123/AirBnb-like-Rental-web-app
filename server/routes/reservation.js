var express = require('express');
var router = express.Router();
var monk=require('monk')
var db=monk('localhost:27017/Airbnb')
var collection=db.get('reservations');
/*We have a single collection for users whether they are host or guest. But there is a field that specifies whether they are host or not*/

/* List all reservations of a user */
router.get('/', function(req, res, next) {
//Get the userid from the query
query=req.query.userId
 collection.find({guest_id:query},(err,reser)=>{
    if(err) throw err;
    res.json(reser);
 })
});

/* Display a  particular reservation */
router.get('/:id', function(req, res, next) {

    collection.findOne({_id:req.params.id},(err,reser)=>{
       if(err) throw err;
       res.json(reser);
    })
   });

/* create a reservation */
router.post('/', function(req, res, next) {

    collection.insert(req.body,(err,reser)=>{
        if(err) throw err;
        res.json(reser);
    });
   });

 
   //delete a property
router.delete('/:id', function(req, res) {
	collection.remove({ _id: req.params.id }, function(err, reser){
		if (err) throw err;
	  	res.json(reser);
	});
});
   
   

module.exports = router;
