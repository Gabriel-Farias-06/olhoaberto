import {
  ChatGoogleGenerativeAI,
  GoogleGenerativeAIEmbeddings,
} from "@langchain/google-genai";
import { LLM_CONFIG } from "./config";
import { BaseLanguageModelInput } from "@langchain/core/language_models/base";

class LLMHub {
  private embedding: GoogleGenerativeAIEmbeddings;
  private chatModel: ChatGoogleGenerativeAI;

  constructor() {
    switch (LLM_CONFIG.company) {
      case "google":
        this.embedding = new GoogleGenerativeAIEmbeddings({
          apiKey: process.env.GEMINI_API_KEY,
          modelName: LLM_CONFIG.embeddingModel,
        });
        this.chatModel = new ChatGoogleGenerativeAI({
          apiKey: process.env.GEMINI_API_KEY,
          model: LLM_CONFIG.chatModel,
          cache: true,
        });
        break;
      default:
        throw new Error("Unsupported LLM company");
    }
  }

  embedQuery(query: string) {
    return this.embedding.embedQuery(query);
  }

  invoke(messages: BaseLanguageModelInput) {
    return this.chatModel.invoke(messages);
  }

  async *stream(messages: BaseLanguageModelInput) {
    for await (const chunk of await this.chatModel.stream(messages)) {
      yield chunk.content;
    }
    return this.chatModel.invoke(messages);
  }
}

export default LLMHub;
