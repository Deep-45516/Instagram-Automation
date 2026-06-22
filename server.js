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
  console.log("========== WEBHOOK ==========");

  const body = req.body;

  console.log(JSON.stringify(body, null, 2));

  if (body.entry) {
    body.entry.forEach(entry => {

      if (entry.messaging) {
        entry.messaging.forEach(event => {
          console.log("EVENT TYPE:");
          console.log(Object.keys(event));
          if (event.message) {
            console.log("MESSAGE RECEIVED");
            console.log("TEXT:", event.message.text);
            console.log("SENDER:", event.sender?.id);
          }

          if (event.read) {
            console.log("READ EVENT");
          }
        });
      }

    });
  }

  console.log("=============================");

  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});