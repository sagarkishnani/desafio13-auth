const express = require("express");
const exphbs = require("express-handlebars");
const bCrypt = require("bcrypt");
const { Router } = require("express");

const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const routes = require("./routes");
const config = require("./config");
const controllersdb = require("./controllersdb");
const User = require("./models");

const { productosDao, carritosDao } = require("./src/daos/index.js");

passport.use(
  "login",
  new LocalStrategy((username, password, done) => {
    User.findOne({ username }, (err, user) => {
      if (err) return done(err);
      //Si no se encuentra en la db
      if (!user) {
        console.log("User not found" + username);
        return done(null, false);
      }
      //Si la contraseña es incorrecta
      if (!isValidPassword(user, password)) {
        return done(null, false);
      }
      //Se encontró el usuario y se validó la contraseña
      return done(null, user);
    });
  })
);

passport.use(
  "signup",
  new LocalStrategy(
    {
      passReqToCallback: true,
    },
    (req, username, password, done) => {
      User.findOne({ username: username }, (err, user) => {
        if (err) {
          return done(err);
        }
        //Si el usuario existe en db
        if (user) {
          return done(null, false);
        }
        //Si no existe en db, se crea el usuario
        const newUser = {
          username: username,
          password: createHash(password),
          email: req.body.email,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
        };

        User.create(newUser, (err, userWithId) => {
          if (err) {
            return done(err);
          }
          return done(null, userWithId);
        });
      });
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, done);
});

function isValidPassword(user, password) {
  return bCrypt.compareSync(password, user.password);
}

function createHash(password) {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

const app = express();

app.engine(".hbs", exphbs({ extname: ".hbs", defaultLayout: "main.hbs" }));
app.set("view engine", ".hbs");

app.use(express.static(__dirname + "/views"));
app.use(express.urlencoded({ extended: true }));

const PORT = 8080;

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: false,
      secure: false,
      maxAge: config.mongodb.expirationTime,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

const productosRouter = new Router();

productosRouter.get("/", async (req, res) => {
  const productos = await productosDao.listarAll();
  res.json(productos);
});

productosRouter.get("/:id", async (req, res) => {
  res.json(await productosDao.listar(req.params.id));
});

productosRouter.post("/", soloAdmins, async (req, res) => {
  res.json({ id: await productosDao.guardar(req.body) });
});

productosRouter.put("/:id", soloAdmins, async (req, res) => {
  res.json(await productosDao.actualizar(req.body, req.params.id));
});

productosRouter.delete("/:id", soloAdmins, async (req, res) => {
  res.json(await productosDao.borrar(req.params.id));
});

//--------------------------------------------
// configuro router de carritos

const carritosRouter = new Router();

carritosRouter.get("/", async (req, res) => {
  res.json((await carritosDao.listarAll()).map((c) => c.id));
});

carritosRouter.post("/", async (req, res) => {
  res.json({ id: await carritosDao.guardar({ productos: [] }) });
});

carritosRouter.delete("/:id", async (req, res) => {
  res.json(await carritosDao.borrar(req.params.id));
});

carritosRouter.get("/:id/productos", async (req, res) => {
  const carrito = await carritosDao.listar(req.params.id);
  res.json(carrito.productos);
});

carritosRouter.post("/:id/productos", async (req, res) => {
  const carrito = await carritosDao.listar(req.params.id);
  const producto = await productosDao.listar(req.body.id);

  carrito.productos.push(producto);

  res.json(await carritosDao.actualizar(carrito, carrito.id));
});

carritosRouter.delete("/:id/productos/:id_prod", async (req, res) => {
  const carrito = await carritosDao.listar(req.params.id);
  const producto = await productosDao.listar(req.params.id);

  const element = carrito.productos.find((el) => el.id === producto.id);
  const index = carrito.productos.indexOf(element);
  carrito.productos.splice(index, 1);

  res.json(await carritosDao.actualizar(carrito, carrito.id));
});

//----------------LOGIN------------------//
app.get("/login", routes.getLogin);
app.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/failedlogin" }),
  routes.postLogin
);
app.get("failedlogin", routes.getFailedLogin);

//----------------REGISTER------------------//
app.get("/signup", routes.getSignUp);
app.post(
  "/signup",
  passport.authenticate("signup", { failureRedirect: "/failedsignup" }),
  routes.postSignUp
);
app.get("failedsignup", routes.getFailedSignUp);

//----------------RUTA PROTEGIDA------------------//
function checkAuth(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/login");
  }
}
app.get("/ruta-protegida", checkAuth, (req, res) => {
  const { user } = req;
  res.send("<h1>Ruta OK!</h1>");
});

//----------------LOGOUT------------------//
app.get("/logout", routes.getLogout);

controllersdb.conectarDB(config.mongodb.cnxStr, (err) => {
  if (err) return console.log(`Error bd`);
  console.log("Base de datos conectada");

  app.listen(PORT, (err) => {
    if (err) return console.log("error en listen server");
    console.log("Server running");
  });
});
