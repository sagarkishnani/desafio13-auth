export default {
  fileSystem: {},
  mongodb: {
    cnxStr: "mongodb://localhost:27017/ecommerce",
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    expirationTime: 20000,
  },
};
