// jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose"); // for data persistence

const homeStartingContent = "This is your daily journal page. Start composing posts and make a clearer and fresher start everyday. Let's do this !";
const aboutContent = "Just doing stuff while learning along the way.";
const contactContent = "Write a good post and maybe we will meet.";

const app = express();
const lash = require("lodash");

// set up mongoose
mongoose.set("strictQuery", false);
mongoose.connect("mongodb://127.0.0.1:27017/blogsdb"); // blogsdb will be used here

const postSchema = new mongoose.Schema({
  title : {type : String, required : [true ,"List cannot be entered without name"]},
  contentBody :  {type : String, required : [true ,"List cannot be entered without name"]}
});

const Post = mongoose.model("posts",postSchema); // posts is the name of collection

// usage variables
const posts = [];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));



app.get("/",function(req,res){
  // go to mongodb find the posts and send them to ejs page home.js
  Post.find(function(err,items){
    res.render("home",{content:homeStartingContent,posts:items});
  });
  
  //console.log(posts);
});

app.get("/about",function(req,res){
  res.render("about",{content:aboutContent});
});

app.get("/contact",function(req,res){
  res.render("contact",{content:contactContent});
});

app.get("/compose",function(req,res){
  res.render("compose");
});

app.post("/compose",function(req,res){

  // create a Post
  var newPost = new Post({
    title : req.body.title,
    contentBody : req.body.msg
  });
  
  newPost.save();
  res.redirect("/");
});


// HERE WE HAVE USED ROUTING DEPENDING ON VARIOUS PARAMETERS
app.get("/posts/:id",function(req,res){
  var postId = req.params.id;

  // find the actual post in the mongo db
  Post.findOne({_id:postId},function(err,result){
    if(err){
      console.log(err);
    }
    else{
      res.render("post",{title:result.title,content:result.contentBody});
    }
  });
  console.log("Still here");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
