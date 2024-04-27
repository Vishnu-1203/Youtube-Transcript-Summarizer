import React from "react";

import Heading from "./components/heading"; // Update the import to use proper casing
import TranscriptInput from "./components/TranscriptInput";
import Footer from "./components/footer";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Heading />
      <TranscriptInput />
      <Footer />
    </div>
  );
}

export default App;
