import { useState } from "react";
import { createRoot } from "react-dom/client";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import "@/index.css";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Response = {
  text: string;
  sourceDocuments: {
    pageContent: string;
    metadata: Record<string, any>;
  }[];
};

export function getHostFromURL(url: string) {
  const urlObj = new URL(url);
  return urlObj.hostname;
}

export function getHostWithProtocolFromURL(url: string): string {
  const urlObj = new URL(url);
  return `${urlObj.protocol}//${urlObj.hostname}`;
}

export function getFaviconSrcFromHostname(hostname: string) {
  return `https://www.google.com/s2/favicons?sz=128&domain=${hostname}`;
}

function Page() {
  const [query, setQuery] = useState("");
  const [res, setRes] = useState<Response | null>(null);

  const handleClick = async () => {
    const res = await chrome.runtime.sendMessage({ query, action: "rag" });
    console.log(res);
    setRes(res);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  return (
    <div>
      <Tabs defaultValue="ask" className="w-[400px]">
        <TabsList>
          <TabsTrigger value="ask">質問</TabsTrigger>
        </TabsList>
        <TabsContent value="ask">
          <h1>ASK</h1>
          <Input
            placeholder="プロンプトを入力..."
            onChange={handleChange}
            value={query}
          />
          <Button onClick={handleClick} variant="outline">
            ASK
          </Button>
          {res?.text && <div>{res.text}</div>}
          {res?.sourceDocuments &&
            res?.sourceDocuments.map((item, i) => (
              <Accordion key={i} type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger>Source {i}</AccordionTrigger>
                  <AccordionContent>
                    <Markdown className="prose" remarkPlugins={[remarkGfm]}>
                      {item.pageContent}
                    </Markdown>
                    <a
                      href={item.metadata.url}
                      className="flex bg-gray-200 px-4 py-2 text-gray-500 text-sm items-center"
                    >
                      <img
                        className="mr-3 h-5 w-5"
                        src={getFaviconSrcFromHostname(item.metadata.url)}
                      />
                      {item.metadata.title}
                    </a>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

const rootElement = document.getElementById("root") as HTMLElement;
const root = createRoot(rootElement);
root.render(<Page />);
