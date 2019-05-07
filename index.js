const express = require("express");
const cors = require("cors");
const mysql = require("mysql");

const app = express();

const SELECT_ALL_SONGS_QUERY = "SELECT * FROM songs";

const connection = mysql.createConnection({
  host: "localhost",
  port: 8889,
  user: "root",
  password: "root",
  database: "streamie_sql"
});

// connection.connect(err => {
//   if (err) {
//     return err;
//   }
// });

console.log(connection);

app.use(cors());

app.get("/", (req, res) => {
  res.send(
    "Hello from the server... Go to /songs to see all songs available for streaming."
  );
});

app.get("/songs", (req, res) => {
  connection.query(SELECT_ALL_SONGS_QUERY, (err, results) => {
    if (err) {
      return res.send(err);
    } else {
      return res.json({
        data: results
      });
    }
  });
});

app.get("/songs/add", (req, res) => {
  const { name, artist } = req.query;
  res.send("Adding Song");
  console.log(name, artist);
});

app.listen(4000, () => {
  console.log("Server is listening on port 4000");
});
