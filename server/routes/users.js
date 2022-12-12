var express = require('express');
var router = express.Router();

const jwt = require('jsonwebtoken');
var monk = require('monk');
const { response } = require('express');
var db = monk('localhost:27017/Airbnb');
var collection = db.get('Users');


const bcrypt = require("bcrypt");
router.post('/register', function (req, res) {

  var { first_name, last_name, email, phone_no, password } = req.body;
  if (!(first_name && last_name && email && phone_no && password)) {

    res.json({ error: "All fields are required!" });
  }
  else {

    bcrypt.hash(password.toString(), 10).then(function (password) {
      collection.findOne({ email: email }, function (err, user) {
        if (err) throw err;

        if (user) {
          res.json({ error: "User already exists. Please login!" });

        }
        else {

          let newUser = {
            first_name,
            last_name,
            email,
            phone_no,
            password,
            isHost: false

          }
          collection.insert(newUser, function (err, user) {

            if (err) throw err;
            res.json(user);

          })

        }
      });
    });
  }



});
///////////////////////////////////////////////////////////
router.post('/login', function (req, res) {
  const { email, password } = req.body;

  if (!(email && password)) {

    res.json({ error: "All fields are required!" });
  }
  else {

    collection.findOne({ email: email }, function (err, user) {
      if (err) throw err;
      if (user == null) {

        res.json({ error: "User doesn't exist" });

      }
      else {
        bcrypt.compare(password,user.password,(err,result)=>{
          if (result) {
            var token = jwt.sign({ user_id: user._id, email }, 'secretkey');
            user.token = token;
            res.json(user);
  
          }
          else {
            res.json({ error: "User email or password is incorrect!" });
  
          }
        })
        
      }

    });

  }

});
router.put('/becomehost', function (req, res, next) {

  collection.update({ _id: req.body.id },
    {
      $set: { isHost: true }
    }, function (err, prop) {
      if (err) throw err;
      // if update is successfull, it will return updated object
      res.json(prop);
    });
});

router.get("/:id",(req,res,next)=>{
  collection.findOne({_id:req.params.id},(err,user)=>{
if(err) throw err
res.json(user)
  })
})




module.exports = router;