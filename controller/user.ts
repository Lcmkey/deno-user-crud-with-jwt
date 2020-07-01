import { RouteParams, Response, Request } from "./../deps.ts";

import { Token } from "./../services/Token.ts";
import { UserSchema } from "./../schema/index.ts";
import { User } from "./../models/index.ts";

// Get All Users
const getUsers = async ({ response: res }: { response: Response }) => {
  const users: Array<UserSchema> = await User.getAllUsers();

  res.status = 200;
  res.body = users;
};

// Get User by ukey
const getUser = async (
  { response: res, params }: { response: Response; params: RouteParams },
) => {
  const { ukey } = params;
  const user: UserSchema = await User.getUserByUkey(ukey);

  res.status = 200;
  res.body = user ? user : { msg: "No such user" };
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

  if (result.error) {
    const { msg } = result;

    res.status = result.status;
    res.body = { msg };

    return;
  }

  res.status = result.status;
  res.body = result.data;
};

// User Login
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

  const user: UserSchema = reqBody.value;
  const { email } = user;
  const result = await User.login(user);

  if (result.error) {
    const { msg } = result;

    res.status = result.status;
    res.body = { msg };

    return;
  }

  // Create Token
  const token = Token.create(result.data.ukey);

  res.status = 200;
  res.body = {
    msg: result.msg,
    email,
    token,
  };
};

// Update User
const updateUser = async (
  { request: req, response: res, params }: {
    request: Request;
    response: Response;
    params: RouteParams;
  },
) => {
  const { ukey } = params;

  if (!ukey) {
    res.status = 400;
    res.body = { msg: "Invalid ukey" };
    return;
  }

  const reqBody = await req.body();
  const user: UserSchema = reqBody.value;
  const { status, msg } = await User.updateUser(
    ukey,
    { ...user, updatedAt: new Date() },
  );

  res.status = status;
  res.body = { msg };
};

// Delete User
const deleteUser = async (
  { response: res, params }: { response: Response; params: RouteParams },
) => {
  const { ukey } = params;

  if (!ukey) {
    res.status = 400;
    res.body = { msg: "Invalid ukey" };
    return;
  }

  const { status, msg } = await User.deleteUser(ukey);

  res.status = status;
  res.body = { msg };
};

export { getUsers, getUser, register, login, updateUser, deleteUser };
