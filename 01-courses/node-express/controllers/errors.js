exports.get404Error = (req, res, next) => {
  res.status(404).render("errors/404", {
    pageTitle: "Page Not Found",
    errorMsg: "Oops ! Looks like you are lost ?",
    path: "/404",
    css: [],
    res: res,
  });
};
