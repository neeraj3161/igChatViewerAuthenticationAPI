const express = require('express');
const cors = require('cors');

const fs = require('fs');

const path = require('path');


const logFilePath = path.join(__dirname, 'logs', 'app.log');




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
    console.log(req.body);

  const {chatStartDate} = req.body || {};
  if (!chatStartDate) { 
    return res.status(400).send('Chat start date is required!');
  }
  if(parseInt(chatStartDate) === 411)
    isAuthenticated = true;

  if (isAuthenticated) {
    console.log('User authenticated successfully');
    res.sendStatus(200);
  } else {
    console.log('User authentication failed');
    res.sendStatus(401);
  }
}
);

function logMessage(message, level = 'INFO') {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] [${level}] ${message}\n`;

  fs.appendFile(logFilePath, logEntry, (err) => {
    if (err) console.error('Failed to write log:', err);
  });
};


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
  fs.readFile(logFilePath, "utf-8", (err, data) => {
    if (err) {
      console.error("Failed to read log file:", err);
      return res.status(500).send("Error reading logs");
    }
    res.send(data);
  });
});



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});