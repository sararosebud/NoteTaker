const notes = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const {
  readFromFile,
  readAndAppend,
  writeToFile,
} = require('../helpers/fsUtils');
const fs = require('fs')
const path = require('path')


// GET Route for retrieving all the notes
notes.get('/', (req, res) => {
  readFromFile('./db/notes.json').then((data) => res.json(JSON.parse(data)));
});

notes.get('/:id', (req, res) => {
  const selectID = req.params.id;
  fs.readFile(path.join(__dirname,'./db/notes.json'), (err, data) => {
      if (err) {
          throw err;
      } else {
          const response = JSON.parse(data);
          const note = response.find(item => item.id === selectID);
          if (note){
              res.send(note);
          } else {
              res.status(404).send('Note not found')
          }
      }
  });
});

// DELETE Route for a specific note
notes.delete('/:id', (req, res) => {
  const id = req.params.id;
  readFromFile('./db/notes.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      // Make a new array of all notes except the one with the ID provided in the URL
      const result = json.filter((item) => item.id !== id);

      // Save that array to the filesystem
      writeToFile('./db/notes.json', result);

      // Respond to the DELETE request
      res.json(`Item ${id} has been deleted 🗑️`);
    });
});

// POST Route for a new UX/UI note
notes.post('/', (req, res) => {
  console.log(req.body);

  const { title, text, } = req.body;

  if (req.body) {
    const newNote = {
      title,
      text, 
      id: uuidv4(),
      
    };

    readAndAppend(newNote, './db/notes.json');
    res.json(`Note added successfully 🚀`);
  } else {
    res.error('Error in adding note');
  }
});



module.exports = notes;
