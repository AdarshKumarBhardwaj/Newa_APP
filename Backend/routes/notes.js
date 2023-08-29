const express = require("express");
const router = express.Router();
var fetchuser = require("../middleware/fetchuser");
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");

//route1:Get all the notes using :Get "api/notes/fetchallnotes". login required
router.get("/fetchallnotes", fetchuser, async (req, resp) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    resp.json(notes);
  } catch (error) {
    console.log(error);
    resp.status(401).send("internal server error occurs");
  }
});

//route2:add new note notes using :post "api/notes/addnote". login required
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "enter a valid title").isLength({ min: 3 }),
    body("description", "description must be of 5 words").isLength({ min: 5 }),
  ],
  async (req, resp) => {
    try {
      const { title, description, tag } = req.body;
      //it gives the array of errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return resp.status(400).json({ errors: errors.array() });
      }

      const note = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const saveNote = await note.save();
      resp.json(saveNote);
    } catch (error) {
      console.log(error);
      resp.status(401).send("internal server error occurs");
    }
  }
);





//route3:update the notes using :put "api/notes/updatenote". login required
router.put("/updatenote/:id", fetchuser, async (req, resp) => {
  try {
    const { title, description, tag } = req.body;
    //create a newNote object
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }
    console.log(newNote);

    let note = await Notes.findById(req.params.id);
    if (!note) {
      return resp.status(404).send("Not Found");
    }

    if (note.user.toString() !== req.user.id) {
      return resp.status(401).send("not allowed");
    }
    note = await Notes.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    resp.json({ note });
  } catch (error) {
    console.log(error);
    resp.status(401).send("internal server error occurs");
  }
});




//route4:delete the notes using :delete "api/notes/deletenote". login required
router.delete("/deletenote/:id", fetchuser, async (req, resp) => {
    try {
      const { title, description, tag } = req.body;
      //create a newNote object
  
      let note = await Notes.findById(req.params.id);
      if (!note) {
        return resp.status(404).send("Not Found");
      }
  
      if (note.user.toString() !== req.user.id) {
        return resp.status(401).send("not allowed");
      }
      note = await Notes.findByIdAndDelete( req.params.id);
      resp.json("Success:Notes has been Deleted");
    } catch (error) {
      console.log(error);
      resp.status(401).send("internal server error occurs");
    }
  });
module.exports = router;
