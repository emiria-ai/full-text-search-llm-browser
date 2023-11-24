import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RetrievalQAChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";

// TODO: fix: OpenAI API Key Error

let openAIApiKey;
getOpenAIApiKey()
  .then((key) => {
    openAIApiKey = key;
  })
  .catch((error) => {
    console.error("Error getting OpenAI API Key:", error);
  });

// Declare vector_store here if it does not depend on openAIApiKey
const vectorStore = new MemoryVectorStore(
  new OpenAIEmbeddings({
    openAIApiKey,
  })
);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case "index": {
      indexWeb(request).then((result) => {
        sendResponse(result);
      });
      break;
    }
    case "rag": {
      runLLM(request).then((result) => {
        sendResponse(result);
      });
      break;
    }
    default: {
      throw new Error(`no action: ${request.action}`);
    }
  }
  return true;
});

export const model = new ChatOpenAI({
  modelName: "gpt-3.5-turbo",
  verbose: true,
  temperature: 0,
  openAIApiKey,
});

const runLLM = async (request: any) => {
  console.log(request);
  const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever(), {
    returnSourceDocuments: true,
  });

  const res = await chain.call({
    query: request.query,
  });

  return res;
};

const indexWeb = async (request: any) => {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 0,
  });
  const docs = await splitter.createDocuments(
    [request.markdown],
    [request.metadata]
  );

  await vectorStore.addDocuments(docs);

  return docs;
};

async function getOpenAIApiKey(): Promise<string> {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get("openAIKey", (result) => {
      if (result.openAIKey) {
        resolve(result.openAIKey);
      } else {
        reject(new Error("OpenAI API key not found."));
      }
    });
  });
}
