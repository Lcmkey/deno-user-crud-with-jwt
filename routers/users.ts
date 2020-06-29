import { Router } from "./../deps.ts";

import {
  getUsers,
  register,
  login,
  updateUser,
  deleteUser,
} from "./../controller/users.ts";

const router = new Router({ prefix: "/user" });

router
  .get("/users", getUsers)
  .post("/register", register)
  .post("/login", login)
  .patch("/update/:userId", updateUser)
  .delete("/delete/:userId", deleteUser);

export default router;
