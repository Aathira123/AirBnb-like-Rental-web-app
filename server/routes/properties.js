var express = require('express');
var router = express.Router();
const multer = require("multer");
var monk=require('monk')
const path = require("path");


var db=monk('localhost:27017/Airbnb')
var collection=db.get('properties');
var storage = multer.diskStorage({
   destination: function (req, file, callback) {
      
      callback(null, 'public');
  },
   filename: function (req, file, cb) {
     cb(null, file.originalname)
   }
})
var upload = multer({ storage: storage })

/* List all properties */
router.get('/', function(req, res, next) {

 collection.find({},(err,props)=>{
   var fileNames = [];

   props.map((p)=>{
      const files = p.images.map(function (filedetails) {
         //filepath = path.join(__dirname, './uploads') + '/' + filedetails.filename;
         fileNames.push(filedetails.filename)
     });
    
     p.images=fileNames
     fileNames = [];
   })
    
 
    if(err) throw err;

    res.json(props);
 })
});

router.get('/fetchImage',function(req, res, next) {

   
     var fileNames = [];
  
     props.map((p)=>{
        const files = p.images.map(function (filedetails) {
           //filepath = path.join(__dirname, './uploads') + '/' + filedetails.filename;
           fileNames.push(filedetails.filename)
       });
       p.images=fileNames
     })
      
   
      if(err) throw err;
  
      res.json(props);
   
  });

/* Display a  particular property */
router.get('/:id', function(req, res, next) {
    collection.findOne({_id:req.params.id},(err,prop)=>{
       if(err) throw err;
       res.json(prop);
    })
   });

/* Add a new property */
router.post('/' ,upload.array('files', 12),function(req, res, next) {

   req.body.images=req.files
   req.body.zipcode=parseInt(req.body.zipcode)
   req.body.beds=parseInt(req.body.beds)
   req.body.baths=parseInt(req.body.baths)
   req.body.guests=parseInt(req.body.guests)
   req.body.cleaningFee=parseInt(req.body.cleaningFee)
   req.body.price=parseInt(req.body.price)
   var y=req.body.amenities.split(",")
   req.body.rating=[]
   req.body.isAvailable=true
   req.body.amenities=y
   req.body.comments=[]
    collection.insert(req.body,(err,prop)=>{
      
        if(err) throw err;
        res.json(prop);
    });
   });

   /* Update an existing property */
router.put('/:id', function(req, res, next) {

    collection.update({_id: req.params.id },
		{ $set: req.body
	}, function(err, prop){
		if (err) throw err;
		// if update is successfull, it will return updated object
	  	res.json(prop);
	});
   });
 
   //delete a property
router.delete('/:id', function(req, res) {
	collection.remove({ _id: req.params.id }, function(err, prop){
   
		if (err) throw err;
	  	res.json(prop);
	});
});
   
   

module.exports = router;
