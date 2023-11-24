import React from "react";
import ReactDOM from "react-dom/client";
import Search from "./Search";
import type { PageInfo } from "@/types";
import { htmlToMarkdown } from "webforai";

const getPageInfo = (): PageInfo => {
  const markdown = htmlToMarkdown(document.documentElement.outerHTML, {
    solveLinks: window.location.href,
  });

  console.log(`send ${window.location.href}`);
  return {
    markdown,
    metadata: {
      title: document.title,
      url: window.location.href,
      timestamp: new Date().toISOString(),
    },
  };
};

setTimeout(() => {
  const pageInfo = getPageInfo();

  chrome.runtime.sendMessage(pageInfo);
}, 1000);

const root = document.createElement("div");
root.id = "crx-root";
document.body.appendChild(root);

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <Search />
  </React.StrictMode>
);
