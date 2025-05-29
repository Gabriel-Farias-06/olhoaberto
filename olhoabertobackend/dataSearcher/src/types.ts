// Tipo de entrada para buscas de artigos
export type SearchArticlesInput = {
  query: string; // Texto da consulta feita pelo usuário
};

// Representa um artigo completo
export type Article = {
  date: string;      // Data associada ao artigo
  pdfPage: string;   // Página do PDF onde o artigo se encontra
  content: string;   // Texto do conteúdo do artigo
  path: string;      // Caminho ou identificador único do artigo
};

// Tipo 'Source' herda de 'Article', mas omite o campo 'content'
// Usado para exibir metadados de artigos relacionados à resposta
export type Source = Omit<Article, "content">;

// Tipo de saída ao realizar uma busca por artigos
export type SearchArticlesOutput = {
  answer: string;    // Resposta gerada pela IA com base na busca
  sources: Source[]; // Lista de artigos usados como fonte da resposta
};

// Importa tipagem de sessão do express-session
import "express-session";

// Estende o tipo 'SessionData' da sessão express para incluir dados do usuário autenticado
declare module "express-session" {
  interface SessionData {
    user: {
      id: string;     // Identificador único do usuário
      name: string;   // Nome do usuário
      email: string;  // E-mail do usuário
    };
  }
}
