import { htmlToMarkdown } from "webforai";
import React from "react";
import ReactDOM from "react-dom/client";
import Search from "./Search";

const getPageInfo = () => {
  const markdown = htmlToMarkdown(document.documentElement.outerHTML, {
    solveLinks: window.location.href,
  });

  return {
    title: document.title,
    url: window.location.href,
    markdown,
    timestamp: new Date().toISOString(),
  };
};

setTimeout(() => {
  const pageInfo = getPageInfo();

  console.log(pageInfo);

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
