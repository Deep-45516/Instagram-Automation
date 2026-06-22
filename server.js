const express = require("express");

const app = express();

app.use(express.json());

const VERIFY_TOKEN = "my_verify_token";

app.get("/", (req, res) => {
  res.send("Instagram DM Test Running");
});

app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (
    mode === "subscribe" &&
    token === VERIFY_TOKEN
  ) {
    console.log("Webhook verified");
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
});

app.post("/webhook", (req, res) => {
  console.log(JSON.stringify(req.body, null, 2));

  const entry = req.body.entry?.[0];

  if (entry?.messaging) {
    entry.messaging.forEach(event => {
      console.log("EVENT KEYS:", Object.keys(event));

      if (event.message) {
        console.log("MESSAGE:", event.message.text);
      }

      if (event.message_edit) {
        console.log("MESSAGE_EDIT:", event.message_edit);
      }

      if (event.reaction) {
        console.log("REACTION:", event.reaction);
      }

      if (event.read) {
        console.log("READ:", event.read);
      }
    });
  }

  res.sendStatus(200);
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});