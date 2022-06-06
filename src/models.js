import mongoose from "mongoose";

export default mongoose.model("usuarios", {
  username: String,
  password: String,
  email: String,
  firstName: String,
  lastName: String,
});
