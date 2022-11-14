// importing
import express from "express";
import mongoose from "mongoose";
import Messages from "./dbMessages.js";
import Pusher from "pusher";
import cors from "cors";
//app congig( this is just for creatring an application and allow us to write api call and all the other stufs )
// config
const app = express();
const port = process.env.PORT || 9000;

const pusher = new Pusher({
  appId: "1506128",
  key: "23a42e2a95e16abae82c",
  secret: "5f2690e7c9751f3386e3",
  cluster: "eu",
  useTLS: true,
});

// middleware
app.use(express.json());
app.use(cors());
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Headers", "*");
//   next();
// });

//DB
const connection_url =
  "mongodb+srv://MERN:MERNAPP@cluster0.9mrqzsq.mongodb.net/chatappdb?retryWrites=true&w=majority";
mongoose
  .connect(connection_url, {
    // useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connection established."))
  .catch((error) => console.error("MongoDB connection failed:", error.message));

const db = mongoose.connection;

db.once("open", () => {
  console.log("DB connected...");
  const msgCollection = db.collection("messagecontents");
  const changeStream = msgCollection.watch();

  changeStream.on("change", (change) => {
    console.log(change);
    if (change.operationType == "insert") {
      const messageDetails = change.fullDocument;
      pusher.trigger("messages", "inserted", {
        name: messageDetails.name,
        message: messageDetails.message,
        timestamp: messageDetails.timestamp,
        received: messageDetails.received,
      });
    } else {
      console.log("Error triggering pusher");
    }
  });
});
//??
// api  routes
app.get("/", (req, res) => res.status(200).send("Hello world"));
app.get("/messages/sync", (req, res) => {
  Messages.find((err, data) => {
    try {
      res.status(200).send(data);
    } catch (err) {
      es.status(500).send(err);
    }
  });
});

app.post("/messages/new", (req, res) => {
  const dbMessage = req.body;
  Messages.create(dbMessage, (err, data) => {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

// listener

app.listen(port, () => console.log(`listening on localhost:${port}`));
