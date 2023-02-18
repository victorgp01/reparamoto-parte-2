const { Router } = require("express");
const { check } = require("express-validator");
const {
   findUsers,
   findUser,
   createUser,
   updateUser,
   deleteUser,
} = require("../controllers/users.controllers");
const {
   validUserById,
   validIfExistUserEmail,
} = require("../middlewares/users.middlewares");
const { validateFiled } = require("../middlewares/validFiled.middleware");

const router = Router();

router.get("/", findUsers);

router.get("/:id", validUserById, findUser);

router.post(
   "/",
   [
      check("name", "The name must be mandatory").not().isEmpty(),
      check("email", "The email must be mandatory").not().isEmpty(),
      check("email", "The email must be a correct format").isEmail(),
      check("password", "The password must be mandatory").not().isEmpty(),
      validateFiled,
      validIfExistUserEmail,
   ],
   createUser
);

router.patch(
   "/:id",
   [
      check("name", "The name must be mandatory").not().isEmpty(),
      check("email", "The email must be mandatory").not().isEmpty(),
      validateFiled,
      validUserById,
      validIfExistUserEmail,
   ],
   updateUser
);

router.delete("/:id", validUserById, deleteUser);

module.exports = {
   usersRouter: router,
};
