import path from "path";

const __dirname = path.resolve();

function getRoot(req, res) {
  res.send("Bienvenido");
}

//----------------LOGIN------------------//
function getLogin(req, res) {
  if (req.isAuthenticated()) {
    const user = req.user;
    console.log("user logueado");
    res.render("login-ok", {
      usuario: user.username,
      nombre: user.firstName,
      apellido: user.lastName,
      email: user.email,
    });
    console.log(__dirname);
  } else {
    console.log("User no logueado");
    res.sendFile(path.join(__dirname, "/views/login.html"));
  }
}

function postLogin(req, res) {
  res.sendFile(path.join(__dirname, "/views/index.html"));
}

function getFailedLogin(req, res) {
  res.render("login-error", {});
}

function getLogout(req, res) {
  req.logout();
  res.sendFile(path.join(__dirname, "/views/index.html"));
}

//----------------REGISTER------------------//

function getSignUp(req, res) {
  res.sendFile(path.join(__dirname + "/views/signup.html"));
}

function postSignUp(req, res) {
  res.sendFile(path.join(__dirname + "/views/index.html"));
}

function getFailedSignUp(req, res) {
  res.render("signup-error", {});
}

function failedRoute(req, res) {
  res.status(404).render("routing-error", {});
}

export default {
  failedRoute,
  getFailedLogin,
  getFailedSignUp,
  getLogin,
  getLogout,
  getRoot,
  getSignUp,
  postLogin,
  postSignUp,
};
