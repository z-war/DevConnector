const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const Post = require("../../models/Post");
const Profile = require("../../models/Profile");
const ValidatepostInput = require("../../validation/post");
const Validatecommentinput = require("../../validation/comment");

// @route   GET api/posts/test
// @desc    test post route
// @access Public
router.get("/test", (req, res) => res.json({ message: "posts works" }));

// @route   GET api/posts
// @desc    get all posts
// @access Public
router.get("/", (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then((posts) => res.json(posts))
    .catch((err) => res.status(404).json(err));
});

// @route   GET api/posts/:id
// @desc    get all posts
// @access Public
router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .then((post) => res.json(post))
    .catch((err) =>
      res.status(404).json({ nopostfound: "No post with id found" })
    );
});

// @route   POST api/posts
// @desc    create post
// @access  private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = ValidatepostInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id,
    });
    newPost.save().then((post) => res.json(post));
  }
);

// @route   DELETE api/posts/:id
// @desc    delete post
// @access  private

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then((profile) => {
      Post.findById(req.params.id).then((post) => {
        if (post.user.toString() !== req.user.id) {
          res.status(401).json({ error: "User Not authorized" });
        }

        post
          .remove()
          .then(res.json({ success: true }))
          .catch(res.status(404).json({ postnotfound: "Post not found" }));
      });
    });
  }
);

// @route   POST api/posts/like/:id
// @desc    Like post
// @access  private

router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then((profile) => {
      Post.findById(req.params.id).then((post) => {
        if (
          post.likes.filter((like) => like.user.toString() === req.user.id)
            .length > 0
        ) {
          return res.status(400).json({ alreadyliked: "user already liked " });
        }
        //add user id to likes array
        post.likes.unshift({ user: req.user.id });
        post.save().then((post) => res.json(post));
      });
    });
  }
);

// @route   POST api/posts/unlike/:id
// @desc    UnLike post
// @access  private

router.post(
  "/unlike/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then((profile) => {
      Post.findById(req.params.id).then((post) => {
        if (
          post.likes.filter((like) => like.user.toString() === req.user.id)
            .length === 0
        ) {
          return res
            .status(400)
            .json({ notliked: "you have not yet liked this post" });
        }
        //get remove index
        const removeindex = post.likes
          .map((item) => item.user.toString())
          .indexOf(req.user.id);
        //splice out of array
        post.likes.splice(removeindex, 1);

        //save
        post.save().then((post) => res.json(post));
      });
    });
  }
);

// @route   POST api/posts/comment/:id
// @desc    add comment to post
// @access  private
router.post(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let { errors, isValid } = Validatecommentinput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }

    Post.findById(req.params.id).then((post) => {
      const comment = {
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id,
      };
      //Add comment to post comment array
      post.comments.unshift(comment);

      //save
      post.save().then((post) => res.json(post));
    });
  }
);

// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    delete comment from post
// @access  private
router.delete(
  "/comment/:id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then((post) => {
        if (
          post.comments.filter(
            (comment) => comment._id.toString() === req.params.comment_id
          ).length === 0
        ) {
          return res
            .status(404)
            .json({ commentnotfound: "Comment does not exist" });
        }
        //get remove index
        const removeindex = post.comments
          .map((item) => item._id.toString())
          .indexOf(req.params.comment_id);
        //splice out of array
        post.comments.splice(removeindex, 1);

        //save
        post.save().then((post) => res.json(post));
      })
      .catch((err) => res.status(404).json({ postnotfound: "Post not found" }));
  }
);

module.exports = router;
