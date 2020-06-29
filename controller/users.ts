import {
  Response,
  Request,
  makeJwt,
  setExpiration,
  Jose,
  Payload,
} from "./../deps.ts";

import User from "./../models/user.ts";

const getUsers = ({ response: res }: { response: Response }) => {
  res.body = "All Users";
};

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

  const user = reqBody.value;
  const { email, password } = user;
  User.register({ email, password });

  res.body = "success";
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
    params: any;
  },
) => {
  const userId = await params.userId;
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

const deleteUser = async (
  { response: res, params }: { response: Response; params: any },
) => {
  const userId = await params.userId;
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
