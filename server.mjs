import express from "express";
import webpush from "web-push";
import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors"

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()
app.use(express.json())
app.use(bodyParser.json())
app.use(cors({
  origin: "http://localhost:8080"
}));

const publicVapidKey = process.env.VAPID_PUBLIC_KEY
const privateVapidKey = process.env.VAPID_PRIVATE_KEY

console.log({publicVapidKey, privateVapidKey})

let subscriptionData = {};
const subscriptions = new Set();

webpush.setVapidDetails(
  `mailto:${process.env.VAPID_MAILTO}`,
  publicVapidKey,
  privateVapidKey,
)

app.options("*", cors());

app.get('/', async(req, res) => {
  res.status(200).send({
    message: 'gay'
  })
})

app.get('/send-notification', (req, res) => {
  const notificationPayload = {
    title: 'Test Notification',
    body: 'This is a test notification',
  };

  if (subscriptionData) {
    webpush
      .sendNotification(subscriptionData, JSON.stringify(notificationPayload))
      .then(() => {
        res.status(200).json({ message: 'Notification sent successfully' });
      })
      .catch((error) => {
        console.error('Error sending notification:', error);
        res.status(500).json({ error: 'Failed to send notification' });
      });
  } else {
    res.status(400).json({ error: 'No subscription data available' });
  }
});



app.post("/save-subscription", async (req, res) => {
  subscriptionData = req.body;
  subscriptions.add(subscriptionData);
  res.status(200).send({
    message: "Subscription saved",
  });
});

app.get('/sw.js', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'sw.js'));
});

app.use(express.static('./public'))

app.listen(process.env.PORT, () => console.log(`server started at ${process.env.PORT} port, http://localhost:${process.env.PORT}`))