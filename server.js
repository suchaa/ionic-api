// Set up
var express = require('express');
var app = express();                               // create our app w/ express
var mongoose = require('mongoose');                     // mongoose for mongodb
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var cors = require('cors');

// Configuration
mongoose.connect('mongodb://localhost/reviewking');

app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({ 'extended': 'true' }));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());
app.use(cors());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'DELETE, PUT');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Models
var Review = mongoose.model('reviews', {
    fullName: String,
    nickName: String,
    social: String,
    tel: String
});

// Routes

// Get reviews
app.get('/api/reviews', function (req, res) {

    console.log("fetching reviews");

    // use mongoose to get all reviews in the database
    Review.find(function (err, reviews) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err)
            res.send(err)

        res.json(reviews); // return all reviews in JSON format
    });
});

// create review and send back all reviews after creation
app.post('/api/reviews', function (req, res) {

    var data = {
        fullName: req.body.fullName,
        nickName: req.body.nickName,
        social: req.body.social,
        tel: req.body.tel
    }

    console.log(data);

    // create a review, information comes from request from Ionic
    Review.collection.insert(data).then(function (err, success) {
        if (err)
            res.json(err);

        console.log(success);

        // get and return all the reviews after you create another
      /*   Review.find(function (err, dataselect) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)

            res.json(dataselect); // return all reviews in JSON format
        }); */
    });

});

// delete a review
app.delete('/api/reviews/:review_id', function (req, res) {
    Review.remove({
        _id: req.params.review_id
    }, function (err, success) {
        if (err)
            res.json(err);
        console.log(success);
        res.json(success);
    });
});


// listen (start app with node server.js) ======================================
app.listen(8080);
console.log("App listening on port 8080");