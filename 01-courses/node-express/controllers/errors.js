exports.get404Error = (req, res, next) => {
  res.status(404).render("errors/404", {
    pageTitle: "Page Not Found",
    errorMsg: "Oops ! Looks like you are lost ?",
    path: "/404",
    css: ["main"],
  });
};

exports.get500Error = (req, res, next) => {
  res.status(500).render("errors/500", {
    pageTitle: "Error",
    errorMsg: "We are working on fixing this.",
    path: "/500",
    css: ["main"],
  });
};
