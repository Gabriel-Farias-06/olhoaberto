import logger from "./logger";
import runWorker from "../workers/runWorker";

const months = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export default async () => {
  try {
    logger("Scraping DOU...");
    for (let year = 2002; year <= 2025; year++) {
      console.log({ year });

      const promises = Promise.all(
        months.map((month) =>
          runWorker("./src/workers/startDataFetchingByMonth.ts", {
            year,
            month,
          })
        )
      );

      await promises;

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
