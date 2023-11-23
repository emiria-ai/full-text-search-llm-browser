import { useState, useEffect } from "react";
import "./App.css";

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
    <>
      <h1>OpenAI API Key</h1>
      <div className="card">
        <input
          type="text"
          value={apiKey}
          onChange={handleApiKeyChange}
          placeholder="Enter OpenAI API Key"
        />
        <button onClick={saveApiKey}>Save API Key</button>
      </div>
    </>
  );
}

export default App;
