import { Request, Response } from "./../deps.ts";

const Logger = async (
  { request: req, response: res }: {
    request: Request;
    response: Response;
  },
  next: Function,
) => {
  await next();

  const duration = res.headers.get("X-Response-Time");
  console.log(`${req.method} ${req.url} - ${duration}`);
};

export { Logger };
