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
  .patch<{ userId: string }>("/update/:userId", updateUser)
  .delete<{ userId: string }>("/delete/:userId", deleteUser);

export default router;
