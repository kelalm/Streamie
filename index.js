const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
var session = require("express-session");
var bodyParser = require("body-parser");
const app = express();

const SELECT_ALL_SONGS_QUERY = "SELECT * FROM songs";

//app.engine("html", require("ejs").renderFile);
app.set("view-engine", "ejs");
app.use(express.static("views"));
app.use(express.static(__dirname + "/public"));
app.set("views", __dirname + "/views");

const connection = mysql.createConnection({
  host: "localhost",
  port: 8889,
  user: "root",
  password: "root",
  database: "streamie_sql"
});

connection.connect(err => {
  if (err) {
    return err;
  }
});

console.log(connection);

app.use(cors());

app.get("/", (req, res) => {
  connection.query(SELECT_ALL_SONGS_QUERY, (err, results) => {
    if (err) {
      return res.send(err);
    } else {
      res.render("songs.ejs", { obj: results });
      // return res.json({
      //   data: results
      // });
    }
  });
});

app.get("/login", (req, res) => {
  // res.send(
  //   "Hello from the server... Go to /songs to see all songs available for streaming."
  // );

  res.render("login.ejs");
  //	response.sendFile(path.join(__dirname + '/login.html'));
});

// app.get("/songs", (req, res) => {
//   connection.query(SELECT_ALL_SONGS_QUERY, (err, results) => {
//     if (err) {
//       return res.send(err);
//     } else {
//       return res.json({
//         data: results
//       });
//     }
//   });
// });

app.get("/songs/add", (req, res) => {
  const { name, artist } = req.query;
  const INSERT_SONGS_QUERY = `INSERT INTO songs(song_name, artist) VALUES ('${name}', '${artist}')`;
  connection.query(INSERT_SONGS_QUERY, (err, results) => {
    if (err) {
      return res.send(err);
    } else {
      return res.send("successfully added product");
    }
  });
});

app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post("/auth", function(request, response) {
  var username = request.body.username;
  var password = request.body.password;
  if (username && password) {
    connection.query(
      "SELECT * FROM accounts WHERE username = ? AND password = ?",
      [username, password],
      function(error, results, fields) {
        console.log("THIS IS WHAT HAPPENED - - " + results);
        if (results.length > 0) {
          request.session.loggedin = true;
          request.session.username = username;
          response.render("/admin.ejs");
        } else {
          response.send("Incorrect Username and/or Password!");
        }
        response.end();
      }
    );
  } else {
    response.send("Please enter Username and Password!");
    response.end();
  }
});

app.listen(4000, () => {
  console.log("Server is listening on port 4000");
});
