import { Avatar, IconButton } from "@mui/material";
import React, { useState } from "react";
import "./Chat.css";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import EmojiEmotionsTwoToneIcon from "@mui/icons-material/EmojiEmotionsTwoTone";
import MicIcon from "@mui/icons-material/Mic";
import axios from "./axios";
const ChatComponent = ({ messages }) => {
  const [input, setInput] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();

    await axios.post("/messages/new", {
      message: input,
      name: "DEMO APP",
      timestamp: "Just Now !!!",
      received: false,
    });
    setInput("");
  };
  return (
    <div className="chat">
      <div className="chat_header">
        <Avatar />
        <div className="chat_headerInfo">
          <h3>Person Name</h3>
          <p>Last seen at...</p>
        </div>
        <div className="chat_headerRight">
          <IconButton>
            <SearchOutlinedIcon />
          </IconButton>
          <IconButton>
            <CameraAltIcon />
          </IconButton>

          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>
      <div className="chat_body">
        {messages.map((message) => (
          <p className={`chat_message ${message.received && "chat_receiver"}`}>
            <span className="chat_name">{message.name}</span>
            {message.message}
            <span className="chat_timestamp">{message.timestamp}</span>
          </p>
        ))}

        <p className="chat_message chat_receiver">
          <span className="chat_name">Jenny</span>
          This is a message
          <span className="chat_timestamp">{new Date().toUTCString()}</span>
        </p>
      </div>
      <div className="chat_footer">
        <EmojiEmotionsTwoToneIcon />
        <form>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message"
            type="text"
          />
          <button onClick={sendMessage} type="submit">
            Send a message
          </button>
        </form>
        <MicIcon />
      </div>
    </div>
  );
};

export default ChatComponent;
