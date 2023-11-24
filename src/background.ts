import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import type { PageInfo } from "@/types";

chrome.runtime.onMessage.addListener(handleMessage);

async function handleMessage(request: PageInfo): Promise<void> {
  try {
    const openAIApiKey = await getOpenAIApiKey();

    const vectorStore = await setupVectorStore(request, openAIApiKey);

    const resultOne = await performSearch(vectorStore);
    console.log(resultOne);
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

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

async function setupVectorStore(
  request: PageInfo,
  openAIApiKey: string
): Promise<MemoryVectorStore> {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 0,
  });
  const docs = await splitter.createDocuments(
    [request.markdown],
    [request.metadata]
  );

  console.log(docs);
  return MemoryVectorStore.fromDocuments(
    docs,
    new OpenAIEmbeddings({ openAIApiKey })
  );
}

async function performSearch(vectorStore: MemoryVectorStore) {
  return vectorStore.similaritySearch("ローカル LLM とは?", 1);
}
