import express from "express";
import cors from "cors";
import Mysql from "mysql";

const app = express();
app.use(cors());
app.use(express.json());


// const connection = Mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "users",
// });


app.get("/", (req, res) => {
  res.send("Hello world");
});


import authRoutes from "./Routes/authRoutes.js";
app.use('/auth', authRoutes);

app.listen(3000, () => {
  console.log("Server started at 3000");
});
