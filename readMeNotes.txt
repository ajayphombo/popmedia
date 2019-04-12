









template engines:

use npm install ejs -save to install, use save to install as a dependency

the view folder is acting as a template for the view engine ejs
you take the html you want and put it in an xxx.ejs file so you can run javascript and let the page become dynamic
this is used on various routes
you will assign an object property to the .js files and then call that object property in the view engine ejs files to inject data


Partial view Templates are so you can include templates in each view to reduce coding
if you make a change you can just go to one view and it will update all other views


servering static files and middleware

middleware is the code that runs between the request and response
the request would be typing in /contact
the response would be the server rending/locating/sendingfile 'contact'
any code between the request and response in the function is considered middleware
function (req, res, next)
next(); -- next will initilize the next middleware

express has a better way to call static files
express.static()

Query strings
additional data added on to http request in the form of nameed value pairs
a query string can be added by using a ? after the url then the named valued pair seperated by & for multiple
contact?person=ryu&dept=marketing
parse the request, and pull out the data to use in the application code


Post Requests
ask serever to accept/store dta 
often used in submitting forms

install body-parser
require body parser variable to handle middleware
view set up by searching for npm body-parser