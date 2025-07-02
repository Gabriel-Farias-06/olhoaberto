import logger from "./logger";
import { readContent } from "../workers/startDataFetchingByMonth";
import { BROKER } from "../db/broker";

const months = [
  // "Janeiro",
  "Fevereiro",
  // "Março",
  // "Abril",
  // "Maio",
  // "Junho",
  // "Julho",
  // "Agosto",
  // "Setembro",
  // "Outubro",
  // "Novembro",
  // "Dezembro",
];

export default async () => {
  try {
    logger("Scraping DOU...");
    for (let year = 2016; year <= 2016; year++) {
      for (const month of months) {
        await readContent(year, month);
      }

      if (BROKER.hasNewArticle) {
        logger("Tem artigos novos, acionando o alerta...");
        const channel = await BROKER?.value?.createChannel();
        channel?.assertQueue("newArticles", { durable: true });
        channel?.sendToQueue(
          "newArticles",
          Buffer.from(JSON.stringify({ new: true }))
        );
      }

      // for (const month of months) {
      //   console.log({ month });

      //   // if (currentYear === year && date.getMonth() === 0) break;
      // }
      // if (year === 2022) break;
    }
  } catch (error) {
    logger((error as Error).message);
  }
};
