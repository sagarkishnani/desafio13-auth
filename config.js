module.exports = {
  fileSystem: {},
  mongodb: {
    cnxStr: "mongodb://localhost:27017/ecommerce",
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    expirationTime: 20000,
  },
  sqlite3: {
    client: "sqlite3",
    connection: {
      filename: "./DB/ecommerce.sqlite",
    },
    useNullAsDefault: true,
  },
  fileSystem: {
    path: "DB/",
  },
  mariaDb: {
    client: "mysql",
    connection: {
      host: "localhost",
      user: "sagar",
      password: "Aakash67",
      database: "ecommerce",
    },
  },
};
