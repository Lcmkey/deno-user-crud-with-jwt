import {
  makeJwt,
  setExpiration,
  Jose,
  Payload,
  validateJwt,
} from "./../deps.ts";

type Algorithm = "none" | "HS256" | "HS512";

// Get Secret key from env
const key = Deno.env.get("JWT_SECRET_KEY")!;
const alg = Deno.env.get("JWT_ALGORITHMS")! as Algorithm;
const typ = Deno.env.get("JWT_TYPE")!;

const header: Jose = { alg, typ };

const getTokenExpirationAsMilliseconds = () => {
  return new Date().getTime() + 1 * 60 * 60 * 1000;
};

const Token = {
  // Create Token
  create: (ukey: string | undefined) => {
    const payload: Payload = {
      ukey,
      exp: setExpiration(getTokenExpirationAsMilliseconds()),
    };

    return makeJwt({ key, header, payload });
  },

  // Verify Token
  validation: (token: string) => {
    return validateJwt(token, key, { isThrowing: false });
  },
};

export { Token };
