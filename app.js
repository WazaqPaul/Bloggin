var express        = require("express");
var app            = express();
var bodyParser     = require("body-parser");
var mongoose       = require("mongoose");
var methodOverride = require("method-override");

// connecting and confguring mongoose
mongoose.connect("mongodb://Localhost/blog");
app.set("view engine", "ejs");
// using static files from public directory
app.use(express.static("public"));
// using the body parser
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));

//==================================
/*
Creating the blog schema 
*/
//==================================
var blogSchema = new mongoose.Schema({
    title:   String,
    image:   String, 
    body:    String,
    created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

//===============================
/*
RESTFUL ROUTES 
*/
//===============================
app.get("/", function(req, res){
    res.redirect("/blogs");
});
// INDEX ROUTE
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log("ERROR!");
        } else {
            res.render("index", {blogs: blogs});
        }
    });
   
});

// NEW ROUTE 
app.get("/blogs/new", function(req, res){
    res.render("new");
});

// CREATE ROUTE
app.post("/blogs", function(req, res){
    // Create the blog 
    Blog.create(req.body.blog, function(err, blogs){
        if(err){
            res.redirect("/new");
        } else{
            res.redirect("/blogs");
        }
    });
    
});

// SHOW ROUTE
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, blogs){
      if(err) {
          res.redirect("/blogs");
      } else {
        res.render("show", {blog:blogs});
      }
    });
    
});

// EDIT ROUTES
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, blogs){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("edit", {blog:blogs});
        }
    });
    
});

// UPDATE ROUTE 
app.put("/blogs/:id", function(req, res){
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, blogs){
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);   
        }
    });
   
});

// DELETE ROUTE
app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
       if(err) {
           res.redirect("/blogs");
       } else {
           res.redirect("/blogs");
       }
    });
    
});

// Port for app 
app.listen(process.env.PORT, function(){
    console.log("Blog server blasting off !!!");
});