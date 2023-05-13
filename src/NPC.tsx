import React, { useState, useRef } from "react";
import requestMessage from "./requestMessage";
import openaiImage from "./openaiImage";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import "./NPC.css";

interface npcMessage {
  id: number;
  text: string | undefined;
  author: "user" | "assistant";
}

const NPC = () => {
  const [inputText, setInputText] = useState("");
  const [backgroundText, setbackgroundText] = useState("");
  const [appearanceText, setappearanceText] = useState("");
  const [otherText, setotherText] = useState("");
  const [statsText, setstatsText] = useState("");
  const [name, setName] = useState("Name");
  const [race, setrace] = useState("Race");
  const [alignment, setalignment] = useState("Alignment");
  const [imageUrl, setImageUrl] = useState("https://via.placeholder.com/256");
  const [npcMessages, setnpcMessages] = useState<npcMessage[]>([]);
  const captureRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const handleClick = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setbackgroundText("Generating background story...");
    setappearanceText("Designing character appearance...");
    setotherText("Gathering relevant information...");
    setstatsText("Rolling the dice...");

    const text = inputText.trim();

    if (text) {
      const newMessage: npcMessage = {
        id: npcMessages.length + 1,
        text,
        author: "user",
      };
      setnpcMessages((prevMessages) => [...prevMessages, newMessage]);

      // Background
      const background = (await requestMessage(text, "background")) || null;
      if (background) {
        setbackgroundText(background);
      }

      const nameOutput = (await requestMessage(text, "name")) || null;
      if (nameOutput) {
        setName(nameOutput);
      }

      const raceOutput = (await requestMessage(text, "race")) || null;
      if (raceOutput) {
        setrace(raceOutput);
      }

      const alignmentOutput = (await requestMessage(text, "alignment")) || null;
      if (alignmentOutput) {
        setalignment(alignmentOutput);
      }

      const appearance = (await requestMessage(text, "appearance")) || null;
      if (appearance) {
        setappearanceText(appearance);
        const url = await openaiImage(appearance);
        if (url !== undefined) {
          setImageUrl(url);
        }
      }
      const other = (await requestMessage(text, "other")) || null;
      if (other) {
        setotherText(other);
      }
      const stats = (await requestMessage(text, "stats")) || null;
      if (stats) {
        setstatsText(stats);
      }
    }
  };

  const handleDownload = () => {
    const pdf = new jsPDF();
    // Add NPC information to PDF
    pdf.setFontSize(16);
    pdf.text(`Name: ${name}`, 20, 20);
    pdf.text(`Race: ${race}`, 20, 30);
    pdf.text(`Alignment: ${alignment}`, 20, 40, { maxWidth: 160 });
    pdf.text(`Background:`, 20, 60);
    pdf.setFontSize(12);
    pdf.text(`${backgroundText}`, 20, 70, { maxWidth: 160 });
    pdf.setFontSize(16);
    pdf.text(`Appearance:`, 20, 170);
    pdf.setFontSize(12);
    pdf.text(`${appearanceText}`, 20, 180, { maxWidth: 160 });
    pdf.addPage();
    pdf.setFontSize(16);
    pdf.text(`Other Info:`, 20, 20);
    pdf.setFontSize(12);
    pdf.text(`${otherText}`, 20, 30, { maxWidth: 160 });
    pdf.setFontSize(16);
    pdf.text(`Stats:`, 20, 130);
    pdf.setFontSize(12);
    pdf.text(`${statsText}`, 20, 140, { maxWidth: 160 });

    // Open PDF in new tab
    const data = pdf.output();
    const blob = new Blob([data], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  return (
    <div className="App">
      <form className="npc-form" onSubmit={handleClick}>
        <input
          type="text"
          placeholder="Type your NPC context here..."
          value={inputText}
          onChange={handleInputChange}
          style={{ fontSize: "16px" }}
        />
        <button style={{ fontSize: "16px" }} type="submit">
          Send
        </button>
      </form>
      <div className="centered-frame">
        <img
          src={imageUrl}
          alt="Character Profile"
          style={{ height: "256px", width: "256px", marginBottom: "10px" }}
          className="circular-image"
        />
        <label style={{ margin: "5px", fontSize: "20px" }}>{name}</label>
        <label style={{ margin: "5px", fontSize: "18px" }}>{race}</label>
        <label style={{ margin: "5px", fontSize: "18px" }}>{alignment}</label>
      </div>
      <div className="frame">
        <label>Background:</label>
        <textarea value={backgroundText} readOnly className="text-area" />
      </div>
      <div className="frame">
        <label>Appearance:</label>
        <textarea value={appearanceText} readOnly className="text-area" />
      </div>
      <div className="frame">
        <label>Other Info:</label>
        <textarea value={otherText} readOnly className="text-area" />
      </div>
      <div className="frame">
        <label>Stats:</label>
        <textarea value={statsText} readOnly className="text-area" />
      </div>
      <button onClick={handleDownload} className="download-button">Download as PDF</button>
    </div>
  );
};

export default NPC;
