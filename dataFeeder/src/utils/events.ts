import EventEmitter from "events";

const EVENT_EMMITER = new EventEmitter();

let articlesCount = 0;

EVENT_EMMITER.on("log", ({ count }: { count: number }) => {
  articlesCount += count;

  process.stdout.moveCursor(0, -1);
  process.stdout.clearLine(0);
  process.stdout.cursorTo(0);
  process.stdout.write(`${articlesCount} artigos lidos`);

  // logLines[id] = text;
  // // Limpa toda a saída e reposiciona o cursor
  // process.stdout.write("\x1B[2J\x1B[0f"); // Clear screen and reset cursor

  // for (const line of logLines) {
  //   if (line) process.stdout.write(`${line}\n`);
  // }
});

export default EVENT_EMMITER;
