import {
  makeJwt,
  setExpiration,
  Jose,
  Payload,
  validateJwt,
} from "./../deps.ts";

// Get Secret key from env
const key = Deno.env.get("JWT_SECRET_KEY")!;

const header: Jose = {
  alg: "HS256",
  typ: "JWT",
};

const getTokenExpirationAsMilliseconds = () => {
  return new Date().getTime() + 1 * 60 * 60 * 1000;
};

// Create Token
const generateToken = (email: string) => {
  const payload: Payload = {
    email,
    exp: setExpiration(getTokenExpirationAsMilliseconds()),
  };

  return makeJwt({ key, header, payload });
};

// Verify Token
const validateToken = (token: string) => {
  return validateJwt(token, key, { isThrowing: false });
};

export { generateToken, validateToken };
