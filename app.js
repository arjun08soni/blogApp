var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var expressSanitizer = require("express-sanitizer"); 
const port = process.env.PORT || 3000;
app = express();


mongoose.connect("mongodb://localhost/blogApp", {useNewUrlParser:true,useUnifiedTopology: true});
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

var blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: { type: Date, default:Date.now}
});

var Blog = mongoose.model("Blog",blogSchema);

// Blog.create({
// 	title: "Test blog",
// 	image: "http://www.thrillophilia.com/blog/wp-content/images/Anjuna-1.jpg?7fcb20",
// 	body: "this is a test blog desc."
// })

//RESTFUL ROUTES

app.get("/",(req,res)=>{
	res.redirect("/blogs");
});

app.get("/blogs",(req,res)=>{
	Blog.find({},(err,blogs)=>{
		 if(err){
		 	console.log(err);
		 }
		 else{
		 	res.render("index",{blogs:blogs});
		 }
	});
});

app.get("/blogs/new",(req,res)=>{
	res.render("new");
});

app.post("/blogs",(req,res)=>{
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.create(req.body.blog,(err,newBlog)=>{
		if(err){
			console.log(err);
		}
		else{
			res.redirect("/blogs");
		}
	});
});

app.get("/blogs/:id",(req,res)=>{
	Blog.findById(req.params.id,(err,foundBlog)=>{
		if(err){
			res.redirect("/blogs");
		}
		else{
			res.render("show",{blog:foundBlog});
		}
	});
});

app.get("/blogs/:id/edit",(req,res)=>{
	Blog.findById(req.params.id,(err,foundBlog)=>{
		if(err){
			res.redirect("/blogs");
		}
		else{
			res.render("edit",{blog:foundBlog});
		}
	});
});

app.put("/blogs/:id",(req,res)=>{
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err,updatedBlog)=>{
		if(err){
			res.redirect("/blogs");
		}
		else{
			res.redirect("/blogs/" + req.params.id);
		}
	});
});


app.delete("/blogs/:id",(req,res)=>{
	Blog.findByIdAndRemove(req.params.id, (err)=>{
		if(err){
			res.redirect("/blogs");
		}
		else{
		res.redirect("/blogs");
	}
	});
});


app.listen(port,()=>{
	console.log("Server is ready at the port "+port);
});