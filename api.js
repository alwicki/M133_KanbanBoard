import { Application, Router, send } from "https://deno.land/x/oak@v6.3.1/mod.ts"
const app = new Application()
const router = new Router()

let tasks = [];

router
    .get("/tasks", context => context.response.body = tasks)
    .post("/tasks", async context => {
        const task = await context.request.body({ type: "json" }).value;
        if(tasks.length){
            task.id = Math.max(...tasks.map(task =>task.id))+1;
        }
        else task.id = 1;
        tasks = [
            ...tasks,
            task
        ];
    })
    .delete("/tasks:id", context => {
        const id = context.params.id;
        tasks = tasks.filter(t => t.id != id);
    })
    .put("/tasks/:id", async context => {
        const task = await context.request.body({ type: "json" }).value;
        const id = context.params.id;
        const index = tasks.findIndex(t => t.id == id);
        tasks[index] = task;
    });

app.use(router.routes());
app.use(async context => {
    await send(context, context.request.url.pathname, {
      root: `${Deno.cwd()}/frontend`,
      index: "index.html",
    });
  });
app.listen({ port: 8000 })