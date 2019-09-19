var express = require("express");
app = express();
var mongoose = require("mongoose");
var methodOverride = require("method-override");
//var expressSanitizer = require("express-sanitizer");

//warnings for mongoose
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
//mongoose.connect("mongodb://localhost/restfulBlogApp");
var url = "mongodb+srv://ikjot10:IKJOTd123@yelpcamp-ht5yc.mongodb.net/webdev?retryWrites=true&w=majority"
mongoose.connect(url);

//app congfiguration
app.use(express.urlencoded({extended:true})); //parses urlencoded body
app.set("view engine", "ejs");
app.use(express.static("public"));
//app.use(expressSanitizer);
app.use(methodOverride("_method"));

//Mongoose model congfiguration
var blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: {type: Date, default: Date.now}
});
var  Blog = mongoose.model("Blog", blogSchema);

  // Blog.create({
  //   title: "Test Blog",
  //   image: "https://images.costco-static.com/ImageDelivery/imageService?profileId=12026539&itemId=100075861-894&recipeName=680",
  //   body: "Hello This is a blog post"
  // });

//RESTFUL routes
app.get("/", function(req, res){
  res.redirect("/blogs");
});

//INDEX
app.get("/blogs", function(req, res){
  Blog.find({}, function(err, blogs){
    if (err) {
      console.log("ERROR");
    } else {
      res.render("index", {blogs: blogs});
    }
  });
});

//NEW route
app.get("/blogs/new", function(req, res){
  res.render("new");
});
//CREATE route
app.post("/blogs", function(req, res){
  //req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.create(req.body.blog, function(err, newBlog){
    if(err){
      res.render("new");
    } else {
      res.redirect("/blogs");
    }
  });
})

//SHOW routes
app.get("/blogs/:id", function(req, res){
  Blog.findById(req.params.id, function(err, foundBlog){
    if (err){
      res.redirect("/blogs");
    } else{
      res.render("show", {blog: foundBlog});
    }
  });
});

//EDIT route
app.get("/blogs/:id/edit", function(req, res){
  Blog.findById(req.params.id, function(err, foundBlog){
    if(err){
      res.redirect("/blogs");
    } else {
      res.render("edit", {blog: foundBlog});
    }
  });
});

//UPDATE route
app.put("/blogs/:id", function(req, res){
  //req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
    if (err) {
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs/" +req.params.id);
    }
  })
});

//DELETE route
app.delete("/blogs/:id", function(req, res){
  //destroy blogs
  Blog.findByIdAndRemove(req.params.id, function(err){
    if(err){
      res.redirect("/blogs");
    }
    else {
      res.redirect("/blogs");
    }
  });
});

// app.listen(3000, function(){
//   console.log("Server running");
// });

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The YelpCamp Server Has Started!");
});
