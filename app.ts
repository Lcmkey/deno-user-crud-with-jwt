import { Application, Context } from "./deps.ts";

import router from "./routers/users.ts";

const env = Deno.env.toObject();
const PORT = env.PORT || 4000;
const HOST = env.HOST || "localhost";
const app = new Application();

// setting up oak logger and timer
app.use(async (ctx: Context, next: Function) => {
  await next();

  const { method: req_method, url } = ctx.request;
  const res_time = ctx.response.headers.get("X-Response-Time");

  console.log(`${req_method} ${url} - ${res_time}`);
});

app.use(async (ctx: Context, next: Function) => {
  const start = Date.now();
  await next();

  const ms = Date.now();
  
  ctx.response.headers.set("X-Response-Time", `${ms}ms`);
});

app.use(router.routes());
app.use(router.allowedMethods());

console.log(`Application is listing on port: ${PORT}, open ${HOST}:${PORT}`);

await app.listen(`${HOST}:${PORT}`);
