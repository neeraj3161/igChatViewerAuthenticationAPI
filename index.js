const express = require('express');
const cors = require('cors');

const fs = require('fs');

const path = require('path');

require('dotenv').config();


const logFilePath = path.join(__dirname, 'logs', 'app.log');

const logData = [];




const app = express();
const port = 5000;

// use below to parse json data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: ["https://igchatviewer.web.app","http://localhost:3000"], // your frontend
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));


app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/authenticate', (req, res) => {
    let isAuthenticated = false;
  // Simulate authentication logic

  const {chatStartDate} = req.body || {};
  if (!chatStartDate) { 
    return res.status(400).send('Chat start date is required!');
  }
  if(parseInt(chatStartDate) === 411)
    isAuthenticated = true;

  if (isAuthenticated) {
    // console.log('User authenticated successfully');
    res.sendStatus(200);
  } else {
    // console.log('User authentication failed');
    res.sendStatus(401);
  }
}
);

function logMessage(message, level = 'INFO') {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] [${level}] ${message}\n`;

  sendLogToTelegram(message);

  // fs.appendFile(logFilePath, logEntry, (err) => {
  //   if (err) console.error('Failed to write log:', err);
  // });
};

function sendLogToTelegram(message){
  app.post('/send', async(req,res)=>{
    try {
      let response = await fetch(`https://api.telegram.org/bot${process.env.tele_auth}/sendMessage`, 
      {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({chat_id:process.env.chat_id, text:`${message ? message.toString() : ""}`})});

      const data = await response.json();

      console.log(data);

      res.json({status:"ok"});

    } catch (error) {
      console.error(`Error occured while sending api data through bot: ${error}`)
    }
})
}


// insert app logs
app.post('/adlg', (req, res) => {
  // Get client IP (works on local + behind proxies like Render/Heroku)
  const ip =
    req.headers['x-forwarded-for']?.split(',').shift() ||  // proxy header
    req.socket?.remoteAddress;                             // fallback


  if (!req.body.log) {
    return res.status(400);
  }

  // Log with IP
  logMessage(`IP: ${ip} | ${req.body.log || ""}`, "INFO");

  res.sendStatus(200);
});

app.get("/getLogs", (req, res) => {

  res.send(logData);
  // fs.readFile(logFilePath, "utf-8", (err, data) => {
  //   if (err) {
  //     console.error("Failed to read log file:", err);
  //     return res.status(500).send("Error reading logs");
  //   }
  //   res.send(data);
  // });
});



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});