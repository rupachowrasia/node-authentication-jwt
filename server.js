const express = require('express');
const app = express();
const logger = require('morgan');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const config = require('./config');
const User = require('./models/user');
const port = process.env.PORT || 3000;
const routes = express.Router();

// connect to database
mongoose.connect(config.dbPath, { useMongoClient : true });
app.set('superSecret', config.secret);

// express middleware
app.use(bodyParser.urlencoded({ extended : true }));
app.use(logger('dev'));
app.use('/api', routes);

// route middleware to authenticate user
routes.use((req, res, next) => {
	let token = req.body.token || req.query.token || req.headers['x-access-token'];
	if(token){
		jwt.verify(token, app.get('superSecret'), (err, decode) => {
			if(err){
				return res.json({ success : false, message : "Failed to authenticate!" });
			}else{
				req.decode = decode;
				next();
			}
		});

	}else {
		return res.status(403).send({ success : false, message : "Token is not provided!" });
	}
});

// homepage route
routes.get('/', (req, res) => {
	res.send(`Hello the api is at ${port} api`);
});

// route to create new user
routes.get('/setup', (req, res) => {
	let newUser = new User();
	newUser.name = "tester";
	newUser.password = "tester";
	newUser.admin = true;

	newUser.save((err) => {
		if(err) return err;
		console.log(`User saved sucessfully!!`);
		res.json({ sucess : true });
	});
});

// route to get all user
routes.get('/users', (req, res) => {
	User.find((err, user) => {
		res.json(user);
	});
});

// route to authenticate user
routes.post('/authenticate', (req, res) => {
	User.findOne({ name : req.body.name }, (err, user) => {
		if(err){
			throw err;
		}

		if(!user){
			res.json({ success : false, message : "User doen not exist!" });
		} else {
			if(user.password != req.body.password){
				res.json({ success : false, message : "Password doen not match!" });
			} else {
				//let token = jwt.sign(user, app.get('superSecret'), { expiresInMinutes : 1440 });
				let token = jwt.sign(user, app.get('superSecret'));
				res.json({ success : true, message : "Success!", token : token });
			}
		}
	});
});

app.listen(port, () => {
	console.log(`Server is up!!`);
});