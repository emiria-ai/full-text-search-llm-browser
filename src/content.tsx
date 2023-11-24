import { htmlToMarkdown } from "webforai";

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

  chrome.runtime.sendMessage(pageInfo);
}, 1000);