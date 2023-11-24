export type Metadata = {
  title: string;
  url: string;
  timestamp: string;
};

export type Action = "rag" | "index";
export type PageInfo = {
  markdown: string;
  action: Action;
  metadata: Metadata;
};
