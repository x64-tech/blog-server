var express = require("express");
var router = express.Router();
const bloggerSchema = require("../database/schemas/bloggerSchema");
const blogSchema = require("../database/schemas/blogSchema");
const getToken = require("../authentication/JWTOperations");
const media = require("../extras/media");

//////// users  ////////
router.post("/signup", (req, res) => {
  const { name, email, username, password } = req.body;

  const newuser = new bloggerSchema({
    name: name,
    email: email,
    username: username,
    password: password,
  });

  newuser.save((err) => {
    if (err) {
      return res.status(400).send(err);
    } else {
      return res.status(200).send("user added");
    }
  });
});

router.put("/update/:bloggerID", (req, res) => {
  _id = req.params.bloggerID;
  const { name, email, password } = req.body;

  bloggerSchema.findOneAndUpdate(
    { _id: req.params.bloggerID },
    {
      $set: {
        name: name,
        email: email,
        password:password
      },
    },
    (err, data) => {
      if (err) {
        return res.status(400).send(err);
      } else {
        return res.status(200).send(data);
      }
    }
  );
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const temp = await bloggerSchema.findOne({
    username: username,
    password: password,
  });
  if (temp != null) {
    return res
      .status(200)
      .json({ token: getToken(temp._id), bloggerID: temp._id });
  } else {
    return res.status(400).send("user does not exixst");
  }
});

router.get("/profile/:bloggerID", (req, res) => {
  bloggerSchema.findById({ _id: req.params.bloggerID }, (err, data) => {
    if (err) {
      return res.status(400).send(err);
    } else {
      return res.status(200).send(data);
    }
  });
});

//////// blogs  ////////
// new blog
router.post("/blog/:bloggerID/create", media.single("blogImage"), (req, res) => {
  bloggerID = req.params.bloggerID; // user id will be extracted from token
  const { title, content, tags } = req.body;
  const newBlog = new blogSchema({
    bloggerID: bloggerID,
    title: title,
    content: content,
    tags: tags.split(","),
    image: req.file.destination + "/" + req.file.originalname,
  });

  newBlog.save((err, data) => {
    if (err) {
      return res.status(400).send(err);
    } else {
      return res.status(200).send(data);
    }
  });
});

// get blogs
router.get("/blog/:bloggerID/getAll", (req, res) => {
  bloggerID = req.params.bloggerID; // user id will be extracted from token
  blogSchema.find({ bloggerID: bloggerID },    (err, data) => {
    if (err) {
      return res.status(400).send(err);
    } else {
      return res.status(200).send(data);
    }
  });
});

/*
// get blog
router.get("/blog/:bloggerID/get/:blogID", (req, res) => {
  bloggerID = req.params.bloggerID; // user id will be extracted from token
  blogID = req.params.blogID;
  blogSchema.findOne({ bloggerID: bloggerID, _id: blogID }, (err, data) => {
    if (err) {
      return res.status(400).send(err);
    } else {
      return res.status(200).send(data);
    }
  });
});
*/


// update blogs
router.put("/blog/:bloggerID/update", media.single("blogImage"), (req, res) => {
  bloggerID = req.params.bloggerID; // user id will be extracted from token
  const { title, content, blogID, tags } = req.body;
  
  blogSchema.findByIdAndUpdate(
    { _id: blogID, bloggerID: bloggerID },
    {
      $set: {
        title: title,
        content: content,
        tags: tags.split(","),
        image: req.file.destination + "/" + req.file.originalname,
      },
    },
    (err) => {
      if (err) {
        return res.status(400).send(err);
      } else {
        return res.status(200).send("blog updated");
      }
    }
  );
});

// delete blog
router.delete("/blog/:bloggerID/delete/:blogID", (req, res) => {
  bloggerID = req.params.bloggerID;
  blogID = req.params.blogID;

  blogSchema.findByIdAndDelete({ _id: blogID, bloggerID: bloggerID }, (err) => {
    if (err) {
      return res.status(400).send(err);
    } else {
      return res.status(200).send("blog deleted");
    }
  });
});

module.exports = router;
