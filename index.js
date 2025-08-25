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
  origin: ["https://igchatviewer.web.app"], // your frontend
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
app.post('/adlg',(req,res)=>{
  const {log}  = req.body | [];
  
  logMessage(log, "INFO");
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});