const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { usersRouter } = require("../routes/users.routes");
const { db } = require("../database/db");
const { repairsRouter } = require("../routes/repairs.routes");
const AppError = require("../utils/appError");
const globalErrorHandler = require("../controllers/error.controller");
const initModel = require("./init.model");

class Server {
   constructor() {
      this.app = express();
      this.port = process.env.PORT || 5000;

      this.paths = {
         users: "/api/v1/users",
         repairs: "/api/v1/repairs",
      };

      this.database();

      this.middlewares();

      this.routes();
   }

   middlewares() {
      if (process.env.NODE_ENV === "development") {
         console.log("HOLA ESTOY EN DESARROLLO");
         this.app.use(morgan("dev"));
      }
      if (process.env.NODE_ENV === "production") {
         console.log("HOLA ESTOY EN PRODUCTION");
      }

      this.app.use(cors());
      this.app.use(express.json());
   }

   routes() {
      this.app.use(this.paths.users, usersRouter);
      this.app.use(this.paths.repairs, repairsRouter);

      this.app.all("*", (req, res, next) => {
         return next(
            new AppError(`Can't find ${req.originalUrl} on this server!`, 404)
         );
      });

      this.app.use(globalErrorHandler);
   }

   database() {
      db.authenticate()
         .then(() => console.log("Database authenticate"))
         .catch((err) => console.log(err));

      initModel();

      db.sync()
         .then(() => console.log("Database synced"))
         .catch((err) => console.log(err));
   }

   listen() {
      this.app.listen(this.port, () => {
         console.log(`Running on port ${this.port}`);
      });
   }
}

module.exports = Server;
