import { Router } from "./../deps.ts";

import { Auth } from "./../middleware/Auth.ts";
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
  .get("/all", getUsers)
  .get<{ ukey: string }>("/:ukey", getUser)
  .post("/register", register)
  .post("/login", login)
  .patch<{ ukey: string }>("/update/:ukey", updateUser)
  .delete<{ ukey: string }>("/delete/:ukey", deleteUser);

export default router;
