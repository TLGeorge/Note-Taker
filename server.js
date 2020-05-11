// Dependencies
var express = require("express");
var path = require("path");
var fs = require("fs");
var { v4: uuidv4 } = require('uuid');

// Sets up the Express App
var app = express();
var PORT = process.env.PORT || 8000

// Automatically creates routes to host files in the public folder 
app.use(express.static("public"));

// Set up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Array for Notes to be populated when notes are created
const noteDB = [];

//Read from db.json
fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) throw err;

    //if data exists, then set noteDB equal to it.
    if (data) {
        noteDB = JSON.parse(data);
    }

    //Once data is read, establish the routes and start the server

    //Get Routes
    app.get("/", (req, res) => {
        res.sendFile("index.html");
    });

    app.get("/notes", (req, res) => {
        res.sendFile("notes.html", { root: "public" });
    });

    app.get("/api/notes", (req, res) => {
        return res.json(noteDB);
    });

    //Post Route
    app.post("/api/notes", (req, res) => {
        let newNote = req.body;
        //generate a unique id using uuidv4 and add a new property to the newNote object to house this number
        newNote["id"] = uuidv4();
        //add the newNote to the array of note objects
        noteDB.push(newNote);
        //stringify the noteDB array of objects and save it to the .json file
        fs.writeFile("./db/db.json", JSON.stringify(noteDB), (err) => {
            if (err) throw err;
            return res.json(noteDB);
        });
    });

    //Delete Route
    app.delete("/api/notes/:id", (req, res) => {
        // console.log("Delete requested.");
        const id = req.params.id;
        noteDB = noteDB.filter(note => note.id !== id);
        fs.writeFile("./db/db.json", JSON.stringify(noteDB), (err) => {
            if (err) throw err;
            return res.json(noteDB);
        });
    });

    //initialize the server!
    app.listen(PORT, () => {
        console.log("App listening on PORT " + PORT);
    });
});