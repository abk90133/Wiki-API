const express = require("express");

const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));
//this has to be mentioned because of the express not allow any other CSS, IMages or any other folder to run, so we have to mention each and every file on the Public folder explicitally

mongoose.connect("mongodb://localhost:27017/wikiDB");
//used to connect to the mongoose server
//and this will create a DB for use in mongoose server that will store our data
//so as we have opened the Robo3T so the data of it will be saved in there as well as in our LocalMongoDB server

const articleSchema = {
  title: "String",
  content: "String"
};

const Article = mongoose.model("Article", articleSchema);
//here we have declared the Item schema of mongoose


app.route("/articles")
//it is used when we are using the same route=/articles and declare the .get .post


//GET[G. P. P. D.] is used with READ of C.R.U.D
.get(function(req, res) {
 Article.find(function(err, foundArticles) {
    if(!err){
      res.send(foundArticles);
    } else {
      res.send(err);
    }
  });
})
//not used semicolon hre because it will not allow for the execution of the next lines
//do localhost:3000/articles

.post(function(req, res){
    // console.log(req.body.title);
    // console.log(req.body.content);

    //below is the syntax of the POST
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });

    newArticle.save();
    //this will be saving the data from the POSTMAN to the MongoDB server and seen online on browser
  })

.delete(function(req, res) {
    Article.deleteMany(function(err) {
      if(!err){
        res.send("Deleted Successfully!");
      } else {
        res.send(err);
      }
    });
  });


//******************************REQUEST FOR THE SPECIFIC ARTICLE IN THE urlencoded
//DO READ CAREFULLY

app.route("/articles/:articleTitle")

.get(function(req, res){
    Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
      if(foundArticle){
      res.send(foundArticle);
      } else {
    res.send("Sorry! Not present");
    }
    });
  }) //this semicolon is not closed


.put(function(req, res){
  Article.updateOne(
    {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    function(err){
      if(!err){
        res.send("Updated Successfully");
      }
    }
  );
})
//this will Update the particluar title we will search into it


.patch(function(req, res){
  Article.updateOne(
    {title: req.params.articleTitle},
    {$set: req.body}, //this is a new parameter we have gone through, read about it, it says that read though the body and whatever is there only update thats
    function(err){
      if(!err){
        res.send("Specific field updated Successfully");
      } else {
        res.send(err);
      }
    }
  );
})

.delete(function(req, res){
  Article.deleteOne(
    {title: req.params.articleTitle},
    function(err){
      if(!err){
        res.send("Deleted Successfully");
      } else {
        res.send(err);
      }
    }
  );
});

app.listen(3000, function(){
  console.log("Port is running on 3000");
});
