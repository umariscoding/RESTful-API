//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


mongoose.connect("mongodb+srv://admin:admin@cluster0.vpf0xqr.mongodb.net/Wikidb?retryWrites=true&w=majority",{useNewUrlParser: true});

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    content: {
        type: String,
        require: true
    }
  })
  
  const Article = new mongoose.model("Article", articleSchema)
//TODO

app.route('/articles')

.get((req,res)=>{
    Article.find({}).then((foundArticles)=>{
        res.send(foundArticles);
    }).catch((err)=>{
        console.log(err);
    });
})

.post((req,res)=>{
    console.log(req.body.title);
    console.log(req.body.content);
    const article1=new Article({
      title:req.body.title,
      content:req.body.content
    })
    article1.save();
})

.delete((req,res)=>{
  Article.deleteMany().then(()=>{
    console.log('Deleted all articles');
  }).catch((err)=>{
    console.log(err);
  })
})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});


app.route('/articles/:articleTitle')
.get((req,res)=>{
  articleTitle=req.params.articleTitle
  
    Article.findOne({title:articleTitle}).then((foundArticles)=>{
        res.send(foundArticles);
    }).catch((err)=>{
        console.log(err);
    });
})
.put((req,res)=>{
  Article.findOneAndUpdate(
    {title:req.params.articleTitle},
    {title:req.body.title,content:req.body.content},
    {overwrite:true}).then(()=>{
      res.send('UPDATED!');
    });
})
.patch((req,res)=>{
  Article.findOneAndUpdate(
    {title:req.params.articleTitle},
    {$set:req.body}
  ).then(()=>{
    res.send("Updated Partially!");
  });
})
.delete((req,res)=>{
  Article.deleteOne({title:req.params.articleTitle}).then((deletedArticle)=>{
    res.send(deletedArticle);
  });
})