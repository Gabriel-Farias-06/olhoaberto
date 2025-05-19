import * as readline from "readline";

export default function dynamicLog(lineOffset: number, text: string) {
  // Move o cursor para cima pelo número de linhas desejado
  readline.moveCursor(process.stdout, 0, -lineOffset);

  // Limpa a linha atual
  readline.clearLine(process.stdout, 0);

  // Move o cursor para o início da linha
  readline.cursorTo(process.stdout, 0);

  // Escreve o novo conteúdo e volta o cursor para a posição original
  process.stdout.write(`\r${text}` + "\n");

  // Opcional: volta o cursor para a linha onde estava antes
  readline.moveCursor(process.stdout, 0, lineOffset - 1);
}
