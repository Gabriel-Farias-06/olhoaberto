import axios from "axios";
import logger from "../utils/logger";
import { Article, Zip } from "../types";
import AdmZip from "adm-zip";
import { workerData } from "worker_threads";
import { eventEmitter } from "../events";

// Função para baixar o ZIP
async function downloadZip({ href, name }: Zip): Promise<AdmZip> {
  const response = await axios.get(href, {
    responseType: "stream",
  });

  const totalSize = Number(response.headers["content-length"]);
  const chunks: Buffer[] = [];

  logger(
    `${workerData.date} => ⬇️ Iniciando download: ${name} | ${(
      totalSize / 1048576
    ).toFixed(2)}MB`
  );

  return new Promise((resolve, reject) => {
    response.data.on("data", (chunk: Buffer) => chunks.push(chunk));

    response.data.on("end", () => {
      logger(`\n✅ Download completo: ${workerData.date}`);
      const zipBuffer = Buffer.concat(chunks);
      resolve(new AdmZip(zipBuffer));
    });

    response.data.on("error", (err: Error) => {
      reject(err);
    });
  });
}

// Função principal do worker
async function getArticlesFromDownloadedZip(zip: Zip): Promise<Article[]> {
  const articles: Article[] = [];
  const zipFile = await downloadZip(zip);
  const { date } = workerData;

  // pega arquivos xml
  const entries = zipFile
    .getEntries()
    .filter((entry) => entry.entryName.endsWith(".xml"));

  logger(`🔄 ${date} => 📂 Lendo ZIP: ${zip.name}`);
  for (const { entryName, getData } of entries) {
    const content = getData().toString("utf-8");
    const pdfPage = content.match(/pdfPage="([^"]+)"/)?.[1] ?? "";

    articles.push({
      date: `${date}`,
      pdfPage,
      path: `${zip.name}>${entryName}`,
      content,
    });
  }

  logger(`🔄 ${date} => ${articles.length} artigos encontrados `);

  return articles;
}

(async () => {
  const { zip, date } = workerData;
  try {
    const articles = await getArticlesFromDownloadedZip(zip);
    logger(
      `🔄 ${date} => Salvando ${articles.length} artigos no Banco de Dados`
    );
    articles.forEach((article) =>
      eventEmitter.emit("saveArticles", { article })
    );
  } catch (error) {
    logger(`${date} => ${(error as Error).message}`);
  }
})();
