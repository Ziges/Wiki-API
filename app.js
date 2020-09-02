const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


mongoose.connect('mongodb://localhost:27017/wikiDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("Article", articleSchema);


/////////////requests targeting all articles.

app.route("/articles")

  .get(function(req, res) {
    Article.find(function(err, foundArticles) {
      //mongoose documentation
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })

  .post(function(req, res) {
    console.log(req.body.title);
    console.log(req.body.content);

    const firstArticle = new Article({
      title: "Asparagus",
      content: "Ass pear guut"
    });

    firstArticle.save(function(err) {
      if (!err) {
        res.send("success")
      } else {
        res.send(err);
      }
    });
  })

  .delete(function(req, res) {
    Article.deleteMany(function(err) {
      //mongoose documentation
      if (!err) {
        res.send("Successfully deleted all articles!");
      } else {
        res.send(err);
      }
    });
  })

/////////////requests targeting a specific article.

app.route("/articles/:articleTitle")

  .get(function(req, res) {
    Article.findOne({
      title: req.params.articleTitle
    }, function(err, foundArticle) {
      if (foundArticle) {
        res.send(foundArticle);
      } else {
        res.send("No articles with that title.");
      }
    });
  })

  .put(function(req, res) {
    Article.update({
        title: req.params.articleTitle
      }, {
        title: req.body.title,
        content: req.body.content
      }, {
        overwrite: true
      },
      function(err) {
        if (!err) {
          res.send("succesfully put updated article")
        }
      }
    );
  })

  .patch(function(req, res) {

    Article.update({
        title: req.params.articleTitle
      }, {
        $set: req.body
      },
      function(err) {
        if (!err) {
          res.send("succesfully patched article!")
        } else {
          res.send(err);
        }
      }
    );
  })

  .delete(function(req, res) {

    Article.deleteOne({
        title: req.params.articleTitle
      },
      function(err) {
        if (!err) {
          res.send("successfully deleted specific article.")
        } else {
          res.send(err);
        }
      }
    );
  });

app.listen(3001, function() {
  console.log("You server is spinned up on port 3001");
})
