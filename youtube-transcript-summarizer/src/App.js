// App.js
import React from "react";
import "./App.css";
import Heading from "./components/heading";
import TranscriptInput from "./components/TranscriptInput";

function App() {
  return (
    <div className="App">
      <Heading />
      <TranscriptInput />
    </div>
  );
}

export default App;
