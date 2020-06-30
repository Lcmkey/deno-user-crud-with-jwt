import { Router } from "./../deps.ts";

import {
  getUsers,
  getUser,
  register,
  login,
  updateUser,
  deleteUser,
} from "./../controller/user.ts";

const router = new Router({ prefix: "/user" });

router
  .get("/users", getUsers)
  .get<{ ukey: string }>("/:ukey", getUser)
  .post("/register", register)
  .post("/login", login)
  .patch<{ ukey: string }>("/update/:ukey", updateUser)
  .delete<{ ukey: string }>("/delete/:ukey", deleteUser);

export default router;
