var express = require("express");
var router = express.Router();
const blogSchema = require("../database/schemas/blogSchema");

// get all blogs
router.get("/getAll", (req, res) => {
  blogSchema.find({}, (err, data) => {
    if (err) {
      return res.status(400).send(err)
    } else {
      return res.status(200).send(data)
    }
  })
})


// get all blogs with blogger
router.get("/get/:bloggerID/blog", (req, res) => {
  blogSchema.find({ userID: req.params.bloggerID }, (err, data) => {
    if (err) {
      return res.status(400).send(err)
    } else {
      return res.status(200).send(data)
    }
  })
})


// get blog by id
router.get("/get/:blogID", (req, res) => {
  blogSchema.find({ _id: req.params.blogID }, (err, data) => {
    if (err) {
      return res.status(400).send(err)
    } else {
      return res.status(200).send(data)
    }
  })
})

// search blog
router.get("/search", (req, res) => {
  const query = req.query.query;

  blogSchema.find({
    "$or": [
      {
        "title": {
          $regex: query
        }
      },
      {
        "tags": {
          $regex: query
        }
      }
    ]
  }, (err, data) => {
    if (err) {
      return res.status(400).send(err)
    } else {
      return res.status(200).send(data)
    }
  })
})


// comment on blog
router.post("/comment", (req, res) => {
  const { blogID, email, comment } = req.body
  blogSchema.findByIdAndUpdate({_id : blogID},
    {
      "$push":{
        comments:{
          email:email,
          comment:comment
        }
      }
    }, (err)=>{
      if (err) {
        return res.status(400).send(err)
      } else {
        return res.status(200).json({"info":"commented"})
      }
    })
})


module.exports = router;
