var express = require('express'); // put the module you want in the require function
var bodyParser = require('body-parser'); 
var mysql = require("mysql");
var app = express(); // set app to express function then intialize it 
var bcrypt = require('bcryptjs');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var expressValidator= require('express-validator');
//var passport=require("passport");

//allow sessions
app.use(session({
    secret: 'app',
    resave: false,
    saveUninitialized: false,
    //cookie: { secure: true }
  }))
app.use(cookieParser());

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "popmedia"
});

app.use( bodyParser.urlencoded({extended: true}))

app.use(expressValidator());
app.set('view engine', 'ejs');
app.use('/assets', express.static('assets'));  


app.get('/', function(req, res) {
    connection.query("SELECT * FROM post;", function(err, data) {
      if (err) {
        return res.status(500).end();
      }
      res.render("index",{data:data});
      console.log(data[0].title);
      console.log(data)
    });
  });

  app.post('/signup', function(req, res){
    console.log(req.body);
    req.checkBody('username','username cannot be empty').notEmpty();
    req.checkBody('email','the email is invalid').isEmail();
    var error= req.validationErrors();
    if(error){
        res.redirect('/'); 
    }
    else{
        bcrypt.genSalt(10, function(err, salt) {
            // res.send(salt);
            bcrypt.hash(req.body.password, salt, function(err, p_hash) { 
    
               
                connection.query('INSERT INTO users (username,email,password_hash) VALUES (?, ?,?)', [req.body.username,req.body.email, p_hash],function (error, results, fields) {
                  
                  if (error){
                      res.redirect('/');
    
                  }else{
                      res.redirect('/'); 
                    }
    
                  
                });
            });
        });
    };
	
});

app.get('/login', function(req, res){
    res.render('login', {qs: req.query}); 
});

app.post('/login', function(req, res){
    console.log(req.body);
	connection.query('SELECT * FROM users WHERE username = ?', [req.body.username],function (error, results, fields) {

	  if (error) throw error;

	  // res.json(results);
	  console.log(results);
	  if (results.length == 0){
	  	res.redirect('/');
	  }else {
	  	bcrypt.compare(req.body.password, results[0].password_hash, function(err, result) {
	  	    
	  	    if (result == true){

	  	      req.session.user_id = results[0].id;
            req.session.username = results[0].username;
           

	  	      res.redirect('/profile');

	  	    }else{
	  	      res.send('please sign up');
	  	    }
	  	});
	  }
	});
});

app.get('/new', function(req, res){
    
    res.render('contact', {qs: req.query});
});

app.post("/new", function(req, res) {
  console.log( req.body );
    console.log("newPost Data:");
    console.log(req.body);

    var dbQuery = "INSERT INTO post (title, post, category) VALUES (?,?,?)";

    connection.query(dbQuery, [req.body.title, req.body.post, req.body.category], function(err, result) {
    if (err) throw err;
    console.log("Post Successfully Saved!");
    res.redirect('/');
     });
});


app.get('/signup', function(req, res){
    res.render('signup', {qs: req.query}); 
});


app.get('/comment', function(req, res){
    res.render('comment', {qs: req.query}); 
});
app.post('/comment', function(req,res){
    console.log("newComment Data:");
    console.log(req.body);

    var dbQuery = "INSERT INTO comments (comments) VALUES (?)";

    connection.query(dbQuery, [req.body.comments], function(err, result) {
      if (err) throw err;
      console.log("Comment Successfully Saved!");
      res.end();
    });
  });


app.get('/profile', function(req,res){
   res.render('profile', {qs: req.query});
});

app.listen(process.env.PORT || 3000, function(){
    console.log('server listening on port 3000');
});