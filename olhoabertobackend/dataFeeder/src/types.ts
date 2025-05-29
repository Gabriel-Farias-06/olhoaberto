// Define o tipo 'Zip', representando um arquivo compactado (ZIP) disponível para download
export type Zip = {
  href: string; // URL de onde o arquivo ZIP pode ser baixado
  name: string; // Nome do arquivo ZIP
};

// Define o tipo 'Article', representando um artigo extraído de um PDF ou outra fonte
export type Article = {
  date: string;     // Data do artigo (pode representar a data de publicação ou extração)
  pdfPage: string;  // Número da página no PDF de onde o artigo foi extraído
  path: string;     // Caminho ou identificador único do artigo (ex: nome do arquivo)
  content: string;  // Conteúdo textual extraído do artigo
};
