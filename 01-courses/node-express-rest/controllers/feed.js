exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [
      {
        title: "First Post",
        content: "This is the first post!",
        imageUrl: "/img/duck.jpg",
      },
    ],
  });
};

exports.createPost = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;

  // Do something in the DB

  res
    .status(201) // Success, a resource has been created
    .json({
      message: "Post created successfully.",
      post: { id: new Date().getTime(), title: title, content: content },
    });
};
