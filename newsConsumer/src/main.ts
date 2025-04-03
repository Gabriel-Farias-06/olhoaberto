import dotenv from "dotenv";
import { connectDb } from "./db";
import runConsumer from "./consumer";

dotenv.config();

connectDb().then(async () => {
  // const urls = [
  //   "https://www.cnnbrasil.com.br/politica/hugo-motta-sinaliza-que-nao-cedera-a-pressao-sobre-projeto-da-anistia/",
  //   "https://oglobo.globo.com/mundo/noticia/2025/04/01/paraguai-convoca-embaixador-do-brasil-no-pais-para-dar-explicacoes-sobre-suposto-monitoramento-da-abin.ghtml",
  // ];
  // console.log({ urls });

  // for (const [i, url] of urls.entries()) {
  //   // dealys digesting to avoid memory overflow
  //   setTimeout(async () => {
  //     console.log(`Digest: ${url}-${i}`);

  //     await save([url]);
  //   }, i * 15000);
  // }
  runConsumer();
});
