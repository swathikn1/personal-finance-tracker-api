import express from "express";
import { AppDataSource } from "./utils/database";
import EntriesRoute from "./routes/EntriesRoute"

const app=express();
app.use(express.json());
app.use('/api/v1/entries',EntriesRoute)

AppDataSource.initialize()
  .then(()=> {
    console.log("Database connected");
    app.listen(3000,() => {
      console.log("Server running on port 3000");
    });
  })
  .catch((error)=> {
    console.error("Database connection failed", error);
  });