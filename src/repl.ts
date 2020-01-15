import repl from 'repl';
import { createConnection } from 'typeorm';
import { entities } from './services';

const replCtx = {
  ...entities,
};

async function startRepl(): Promise<void> {
  await createConnection();

  const replServer = repl.start({ prompt: "Dungeon Console > ", useColors: true });

  for (const ctxKey in replCtx) {
    replServer.context[ctxKey] = replCtx[ctxKey];
  }
}

startRepl();