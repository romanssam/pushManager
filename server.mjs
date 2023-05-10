import express from "express";
import webpush from "web-push";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors"

dotenv.config();

const app = express()
app.use(bodyParser.json())
app.use(cors())

const publicVapidKey = process.env.VAPID_PUBLIC_KEY
const privateVapidKey = process.env.VAPID_PRIVATE_KEY

console.log({publicVapidKey, privateVapidKey})

let subscriptionData = null;

webpush.setVapidDetails(
  `mailto:${process.env.VAPID_MAILTO}`,
  publicVapidKey,
  privateVapidKey,
)

app.get('/', async(req, res) => {
  res.status(200).send({
    message: 'gay'
  })
})

app.get('/send-notification', (req, res) => {
  webpush.sendNotification(subscriptionData, 'Test')
  res.status(200).send({
    message: subscriptionData
  })
})

app.post("/save-subscription", async (req, res) => {
  subscriptionData = req.body;
  res.status(200).send({
    message: subscriptionData
  })
});

app.use(express.static('./public'))

app.listen(process.env.PORT, () => console.log(`server started at ${process.env.PORT} port, http://localhost:4000`))