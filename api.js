import {
  Application,
  Router,
  send,
} from 'https://deno.land/x/oak@v6.3.1/mod.ts';
import { v4 } from 'https://deno.land/std/uuid/mod.ts';
const app = new Application();
const router = new Router();

const lanes = [
  { id: 0, titel: 'ToDo', color: '#ffca3a' },
  { id: 1, titel: 'in Progress', color: '#1982c4' },
  { id: 2, titel: 'Done', color: '#8ac926' },
];

let tasks = [];

router
  .get('/lanes', (context) => (context.response.body = lanes))
  .get('/tasks', (context) => (context.response.body = tasks))
  .post('/tasks', async (context) => {
    const task = await context.request.body({ type: 'json' }).value;
    task.id = v4.generate();
    tasks = [...tasks, task];
    context.response.body = { msg: `created task ${task.id}` };
  })
  .delete('/tasks/:id', (context) => {
    const id = context.params.id;
    tasks = tasks.filter((t) => t.id != id);
    context.response.body = { msg: `deleted task ${id}` };
  })
  .put('/tasks/:id', async (context) => {
    const task = await context.request.body({ type: 'json' }).value;
    const id = context.params.id;
    const index = tasks.findIndex((t) => t.id == id);
    tasks[index] = task;
    context.response.body = { msg: `updated task ${task.id}` };
  });

app.use(router.routes());
app.use(async (context) => {
  await send(context, context.request.url.pathname, {
    root: `${Deno.cwd()}/frontend`,
    index: 'index.html',
  });
});
app.listen({ port: 8000 });
