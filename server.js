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

// create application/x-www-form-urlencoded parser
app.use( bodyParser.urlencoded({extended: true}))

app.use(expressValidator());
app.set('view engine', 'ejs'); //to request templates
app.use('/assets', express.static('assets')); //any request to assets route is entered it will serve the request if you type in style.css file


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
        res.redirect('/'); //query data to contact
    }
    else{
        bcrypt.genSalt(10, function(err, salt) {
            // res.send(salt);
            bcrypt.hash(req.body.password, salt, function(err, p_hash) { 
    
                // res.send(p_hash);
                //console.log(req.body.password);
                connection.query('INSERT INTO users (username,email,password_hash) VALUES (?, ?,?)', [req.body.username,req.body.email, p_hash],function (error, results, fields) {
                  
                  //var what_user_sees = "";
                  if (error){
                      //what_user_sees = 'you need to use a unique email';
                      res.redirect('/'); //query data to contact
    
                  }else{
                      //what_user_sees = 'you have signed up - please go login at the login route';
                      res.redirect('/'); //query data to contact
                    }
    
                 // res.send(what_user_sees);
                  
                });
            });
        });
    };
	
});

app.get('/login', function(req, res){
    //res.send('this is the contact page');
    //res.sendFile(__dirname + '/contact'); 
    //res.render('contact'); //since we are using partial templates in the view engine we must change it to render instead of send.
    res.render('login', {qs: req.query}); //query data to contact
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
    //res.send('this is the contact page');
    //res.sendFile(__dirname + '/contact'); 
    //res.render('contact'); //since we are using partial templates in the view engine we must change it to render instead of send.
    res.render('contact', {qs: req.query}); //query data to contact
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
    //res.send('this is the contact page');
    //res.sendFile(__dirname + '/contact'); 
    //res.render('contact'); //since we are using partial templates in the view engine we must change it to render instead of send.
    res.render('signup', {qs: req.query}); //query data to contact
});


app.get('/comment', function(req, res){
    //res.send('this is the contact page');
    //res.sendFile(__dirname + '/contact'); 
    //res.render('contact'); //since we are using partial templates in the view engine we must change it to render instead of send.
    res.render('comment', {qs: req.query}); //query data to contact
});
//set up a post for the form in contact.ejs, urlencodeparser will enable you to use .body
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


//route params for dynamic routes, by using ex: :anything_you_want after the semicolor 
app.get('/profile', function(req,res){
   // res.send('You requested to see a profile with the id of ' + req.params.id); // this will concatenate other routes since you used a param of Id that you assigned to app.get, you can type anything in the url as the ID
   res.render('profile', {qs: req.query}); //query data to contact
   // uses the profile file to provide html for the route, the person object will receive the request from the client entering a route with their name
// data is there to show we can add multiple properties to show more data 
// person: and data: are the property we will call in are profile ejs file
});

app.listen(3000, function(){
    console.log('server listening on port 3000');
}); // give it a port number to use to respond to request

/* http methods are request we make such as get- when we type in a url, post to post data on server or web, delete request, put request

    responding to request:
    get - app.get('route, fn) 

    post- app.post('route', fn)

    delete - app.delete('route', fn)
*/

