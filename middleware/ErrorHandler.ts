import { Response } from "./../deps.ts";

const ErrorHandler = async (
  { response: res }: {
    response: Response;
  },
  next: Function,
) => {
  try {
    await next();
  } catch (err) {
    console.log(err);
    res.status = 500;
    res.body = { error: "Server error" };
  }
};

export { ErrorHandler };
