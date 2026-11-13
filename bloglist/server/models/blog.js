const mongoose = require("mongoose");

const blogSchema = mongoose.Schema({
  title: { type: String, required: true },
  author: String,
  url: { type: String, required: true },
  likes: { type: Number, default: 0 },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  comments: [{ body: String }],
});

blogSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;

    if (returnedObject.comments) {
      returnedObject.comments = returnedObject.comments.map((comment) => {
        comment.id = comment._id.toString();
        delete comment._id;
        return comment;
      });
    }
  },
});

module.exports = mongoose.model("Blog", blogSchema);
