const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");

const app = express();
const PORT = process.env.PORT || 3000;
const EXCEL_PATH = path.join(__dirname, "../data/feedback.xlsx");

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../public")));

app.post("/submit", (req, res) => {
  const { fullName, email, feedback, rating } = req.body;
  const entry = { FullName: fullName, Email: email, Feedback: feedback, Rating: rating };

  let data = [];
  if (fs.existsSync(EXCEL_PATH)) {
    const workbook = XLSX.readFile(EXCEL_PATH);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    data = XLSX.utils.sheet_to_json(worksheet);
  }

  data.push(entry);
  const newWB = XLSX.utils.book_new();
  const newWS = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(newWB, newWS, "Feedback");
  XLSX.writeFile(newWB, EXCEL_PATH);

  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
