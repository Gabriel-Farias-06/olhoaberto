// Importa o módulo EventEmitter para lidar com eventos personalizados
import EventEmitter from "events";

// Tipagem de artigos usada na fila
import { Article } from "./types";

// Importa o modelo de artigos e a função de conexão com o banco de dados
import { Articles, connectDb } from "./db";

// Função utilitária para logar mensagens
import { logger } from "./utils";

// Importa embeddings da API do Google via LangChain
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

// Configurações do modelo LLM (por exemplo, nome do modelo de embedding)
import { LLM_CONFIG } from "./llm/config";

// Instancia um EventEmitter global para escutar e emitir eventos no sistema
export const eventEmitter = new EventEmitter();

// Fila de artigos pendentes para processamento e salvamento
const queue: Article[] = [];

// Conecta ao banco de dados e registra o listener do evento 'saveArticle'
connectDb().then(async () => {
  // Listener executado quando o evento 'saveArticle' é emitido
  eventEmitter.on("saveArticle", async (articles) => {
    // Adiciona os artigos recebidos à fila
    queue.push(...articles);

    // Itera sobre os artigos da fila
    for (const [i, { date, pdfPage, path, content }] of queue.entries()) {
      try {
        // Verifica se o artigo já está salvo no banco de dados pelo path
        const articleAlreadySaved = await Articles.findOne({ path });
        if (articleAlreadySaved) {
          logger(`${date} => Artigo ${path} já está salvo!`);
        } else {
          // Caso não esteja salvo, gera o embedding do conteúdo
          logger(`${date} => Gerando embedding para ${path}`);
          const embedding = await new GoogleGenerativeAIEmbeddings({
            apiKey: process.env.GEMINI_API_KEY,
            modelName: LLM_CONFIG.embeddingModel,
          }).embedQuery(`${date} ${pdfPage} ${content}`);

          // Cria e salva o artigo no banco com o embedding gerado
          logger(`${date} => Salvando artigo: ${path}...`);
          const article = new Articles({
            date,
            pdfPage,
            path,
            content,
            embedding,
          });
          await article.save();
          logger(`${date} => ${path} => Artigo Salvo!`);
        }
      } catch (error) {
        // Em caso de erro, exibe mensagem no log
        logger((error as Error).message);
      }

      // Remove o artigo processado da fila
      queue.splice(i, 1);
    }
  });
});
