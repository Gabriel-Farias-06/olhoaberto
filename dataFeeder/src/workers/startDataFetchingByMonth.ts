import { workerData } from "worker_threads";
import { logger } from "../utils";
import runWorker from "./runWorker";
import { Zip } from "../types";
import axios from "axios";
import * as cheerio from "cheerio";

async function getZips(year: number, month: string): Promise<Zip[]> {
  const BASE_URL = `https://www.in.gov.br/acesso-a-informacao/dados-abertos/base-de-dados?ano=${year}&mes=${month}`;
  const zip: Zip[] = [];

  try {
    const response = await axios.get(BASE_URL);
    console.log({ cheerio });

    const $ = cheerio.load(response.data);

    $("a").each((_, el) => {
      const name = $(el).text().trim();
      const href = $(el).attr("href");

      if (name.includes(".zip") && href) zip.push({ href, name });
    });

    logger(`🔗 ${zip.length} arquivos .zip encontrados para ${month}/${year}`);
    return zip;
  } catch (error) {
    logger(
      `❌ Erro ao buscar página de ${month}/${year}: ${
        (error as Error).message
      }`
    );
    return [];
  }
}

async function readContent(year: number, month: string) {
  logger(`🔄 Ano: ${year} | Mês: ${month}`);

  const zips = await getZips(year, month);

  const promises = [];
  for (const [i, zip] of zips.entries()) {
    promises.push(
      runWorker<string[]>("./src/workers/downloadZipAndGetArticles.ts", {
        zip,
        id: i,
        date: `${month}/${year}`,
      })
    );
  }

  return (await Promise.all(promises)).concat();
}

(async () => {
  const { year, month } = workerData;
  logger(`Starting worker in: ${year}/${month}`);
  await readContent(year, month);
})();
