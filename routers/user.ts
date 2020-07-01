import { Router } from "./../deps.ts";

import { Auth } from "./../middleware/Auth.ts";
import {
  getMockupData,
  getUsers,
  getUser,
  register,
  login,
  updateUser,
  deleteUser,
} from "./../controller/user.ts";

const router = new Router({ prefix: "/user" });

router
  .get("/mockup", getMockupData)
  .get("/all", Auth, getUsers)
  .get<{ ukey: string }>("/:ukey", Auth, getUser)
  .post("/register", register)
  .post("/login", login)
  .patch<{ ukey: string }>("/update/:ukey", Auth, updateUser)
  .delete<{ ukey: string }>("/delete/:ukey", Auth, deleteUser);

export default router;
