import { Response } from "./../deps.ts";

const Timer = async (
  { response: res }: {
    response: Response;
  },
  next: Function,
) => {
  const start = Date.now();

  await next();

  const duration = Date.now() - start;
  res.headers.set("X-Response-Time", `${duration} ms`);
};

export { Timer };
