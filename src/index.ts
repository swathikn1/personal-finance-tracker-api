import express from "express";
import { AppDataSource } from "./utils/database";

const app=express();

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