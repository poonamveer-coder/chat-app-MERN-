import { useEffect, useState } from "react";
import "./App.css";
import ChatComponent from "./ChatComponent";
import Sidebar from "./Sidebar";
import Pusher from "pusher-js";
import axios from "./axios";

function App() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    axios.get("/messages/sync").then((response) => {
      console.log(response.data);
      setMessages(response.data);
    });
  }, []);
  useEffect(() => {
    var pusher = new Pusher("23a42e2a95e16abae82c", {
      cluster: "eu",
    });

    const channel = pusher.subscribe("messages");
    channel.bind("inserted", (newMessage) => {
      // alert(JSON.stringify(newMessage));
      setMessages([...messages, newMessage]);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [messages]);
  console.log(messages);
  return (
    <div className="app">
      <div className="app_body">
        <Sidebar />
        <ChatComponent messages={messages} />
      </div>
    </div>
  );
}

export default App;
