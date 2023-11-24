import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function App() {
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    // Load the API key when the component mounts
    chrome.storage.sync.get("openAIKey", function (result) {
      if (result.openAIKey) {
        setApiKey(result.openAIKey);
      }
    });
  }, []);

  const handleApiKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(event.target.value);
  };

  const saveApiKey = () => {
    chrome.storage.sync.set({ openAIKey: apiKey }, function () {
      console.log("API Key is saved");
    });
  };

  return (
    <div className="h-96 w-96 p-8">
      <h1 className="text-2xl text-center font-bold mb-5">OpenAI API Key</h1>
      <div>
        <Input
          className="w-full"
          value={apiKey}
          onChange={handleApiKeyChange}
          placeholder="Enter OpenAI API Key"
        />
        <div className="mt-5 flex justify-center">
          <Button onClick={saveApiKey}>Save API Key</Button>
        </div>
      </div>
    </div>
  );
}

export default App;
