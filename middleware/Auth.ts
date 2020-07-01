import { Request, Response, validateJwt } from "./../deps.ts";

import { Token } from "./../services/Token.ts";

const Auth = async (
  { request: req, response: res }: { request: Request; response: Response },
  next: any,
) => {
  const headers: Headers = req.headers;
  // Taking JWT from Authorization header and comparing if it is valid JWT token, if YES - we continue,
  // otherwise we return with status code 401

  // Get token from header
  const authorization = headers.get("Authorization");
  if (!authorization) {
    res.status = 401;
    return;
  }

  const jwt = authorization.split(" ")[1];

  if (!jwt) {
    res.status = 401;
    return;
  }

  // Verify Token
  const validToken = await Token.validation(jwt);

  if (validToken) {
    await next();
    return;
  }

  res.status = 401;
  res.body = { message: "Invalid jwt token" };
};

export { Auth };
