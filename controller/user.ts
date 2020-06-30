import {
  RouteParams,
  Response,
  Request,
  makeJwt,
  setExpiration,
  Jose,
  Payload,
} from "./../deps.ts";

import { UserSchema } from "./../schema/index.ts";
import { User } from "./../models/index.ts";

const getUsers = async ({ response: res }: { response: Response }) => {
  const users = await User.getAllUsers();

  res.status = 200;
  res.body = users;
};

// Create User Method
const register = async (
  { request: req, response:res }: { request: Request; response: Response },
) => {
  const reqBody = await req.body(
    {
      contentTypes: {
        text: ["application/1d+json"],
      },
    },
  );

  const user: UserSchema = reqBody.value;
  const result = await User.register(user);

  res.status = result.status;
  res.body = result.data;
};

const login = async (
  { request: req, response: res }: { request: Request; response: Response },
) => {
  const reqBody = await req.body(
    {
      contentTypes: {
        text: ["application/1d+json"],
      },
    },
  );

  const user = reqBody.value;
  const { email, password } = user;
  const login = await User.login({ email, password });

  if (login === null) {
    console.log("Invalid data enterd");
    res.status = 404;
    res.body = "Enterd value input is wrong";
  } else {
    const key = "your-jwt-secret-key";

    const payload: Payload = {
      email,
      exp: setExpiration(new Date().getTime() + 1 * 60 * 60),
    };
    const header: Jose = {
      alg: "HS256",
      typ: "JWT",
    };

    const token = await makeJwt({ header, payload, key });
    res.status = 200;
    res.body = {
      msg: "success",
      email,
      token,
    };
  }
};

const updateUser = async (
  { request: req, response: res, params }: {
    request: Request;
    response: Response;
    params: RouteParams;
  },
) => {
  const { userId } = await params;
  const reqBody = await req.body();
  const user = reqBody.value;
  const updateUser = await User.updateUser(userId, user);

  if (updateUser) {
    res.status = 200;
    res.body = {
      msg: "User has been updated",
    };
  } else {
    res.status = 404;
    res.body = {
      msg: "User not found",
    };
  }
};

// Delete User
const deleteUser = async (
  { response: res, params }: { response: Response; params: RouteParams },
) => {
  const { userId } = await params;

  if (!userId) {
    res.status = 400;
    res.body = { error: "Invalid Data" };
    return;
  }

  const deleteUser = await User.deleteUser(userId);

  if (deleteUser) {
    res.status = 200;
    res.body = {
      msg: "User has been deleted",
    };
  } else {
    res.status = 404;
    res.body = "User not found";
  }
};

export { getUsers, register, login, updateUser, deleteUser };
