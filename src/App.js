import { useState } from "react";
import "./App.css";
import Notes from "./notes";

function App() {
  const [notes, setNotes] = useState([
    {
      id: 1,
      text: "This is sample text one",
    },
    {
      id: 2,
      text: "This is sample text two",
    },
    {
      id: 3,
      text: "This is sample text three",
    },
  ]);

  return (
    <div className="App">
      <Notes notes={notes} setNotes={setNotes} />
    </div>
  );
}

export default App;
