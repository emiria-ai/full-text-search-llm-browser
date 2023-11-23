import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

chrome.runtime.onMessage.addListener(async (request) => {
  chrome.storage.sync.get("openAIKey", async (result) => {
    const openAIApiKey = result.openAIKey;

    if (!openAIApiKey) {
      console.error("OpenAI API key not found.");
      return;
    }

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 0,
    });

    const metadata = {
      title: request.title,
      url: request.url,
    };

    const docs = await splitter.createDocuments([request.markdown], [metadata]);

    const vectorStore = await MemoryVectorStore.fromDocuments(
      docs,
      new OpenAIEmbeddings({
        openAIApiKey: openAIApiKey,
      })
    );

    const resultOne = await vectorStore.similaritySearch(
      "Cursorのメリットとは?",
      1
    );

    console.log(resultOne);
  });
});
