import { logger } from "../utils";
import { Zip } from "../types";
import axios from "axios";
import * as cheerio from "cheerio";
import { getArticlesFromDownloadedZip } from "./downloadZipAndGetArticles";
import { saveOnDb } from "../events";

async function getZips(year: number, month: string): Promise<Zip[]> {
  logger("Getting zips");

  const BASE_URL = `https://www.in.gov.br/acesso-a-informacao/dados-abertos/base-de-dados?ano=${year}&mes=${month}`;
  const zip: Zip[] = [];

  try {
    const response = await axios.get(BASE_URL);
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

export async function readContent(year: number, month: string) {
  logger(`🔄 Ano: ${year} | Mês: ${month}`);

  // redução proposital
  const zips = [(await getZips(year, month))[0]];
  console.log({ zips });

  // const promises = [];
  for (const [i, zip] of zips.entries()) {
    console.log({ zip });
    try {
      const articles = await getArticlesFromDownloadedZip(
        zip,
        `${year}/${month}`
      );
      logger(
        `🔄 ${year}/${month} => Salvando ${articles.length} artigos no Banco de Dados`
      );
      await saveOnDb(articles);
    } catch (error) {
      logger(`${year}/${month} => ${(error as Error).message}`);
    }
    // promises.push(
    //   runWorker<string[]>("./src/workers/downloadZipAndGetArticles.ts", {
    //     zip,
    //     id: i,
    //     date: `${month}/${year}`,
    //   })
    // );
  }

  // return (await Promise.all(promises)).concat();
}

// (async () => {
//   logger("start worker");
//   const { year, month } = workerData;
//   logger(`Starting worker in: ${year}/${month}`);
//   await readContent(year, month);
//   parentPort?.postMessage("done");
// })();
