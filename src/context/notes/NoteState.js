import { useState } from "react";
import NoteContext from "./noteContext"; //first import Notecontext

const NoteState = (props) => {
  const host = "http://localhost:5000";
  const notesInitial = [];
  const [notes, setNotes] = useState(notesInitial);

  const getNotes = async () => {
    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VyIjp7ImlkIjoiNjRlMzI1OWZlZTU1ZTFjNzM1MzZhZGI2In0sImlhdCI6MTY5MjYxMzM4NH0.u8mRAS59wbfwhH5TMUzt3qz5UdiP0eSKx_MNJ4wZnWA",
      },
    });
    const json = await response.json();      
    console.log(json);
    setNotes(json);                              //this is used to display content
  };

  //Add a notes
  const addNote = async (title, description, tag) => {
    //api call
    const response = await fetch(`${host}/api/notes/addnote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "auth-token":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VyIjp7ImlkIjoiNjRlMzI1OWZlZTU1ZTFjNzM1MzZhZGI2In0sImlhdCI6MTY5MjYxMzM4NH0.u8mRAS59wbfwhH5TMUzt3qz5UdiP0eSKx_MNJ4wZnWA",
      },
      body: JSON.stringify({title, description, tag}),
    });
    const note= await response.json()
    setNotes(notes.concat(note));
  
  };

  //Delete a Note

  const deleteNote = async(id) => {
    //API call
    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VyIjp7ImlkIjoiNjRlMzI1OWZlZTU1ZTFjNzM1MzZhZGI2In0sImlhdCI6MTY5MjYxMzM4NH0.u8mRAS59wbfwhH5TMUzt3qz5UdiP0eSKx_MNJ4wZnWA",
      },
     
    });
    const json = response.json();
    console.log(json)

    console.log("deleting the notes with id" + id);
    const newNote = notes.filter((note) => {
      return note._id !== id;
    });
    setNotes(newNote);
  };

  //Edit a note
  const editNote = async (id, title, description, tag) => {
    //api call
    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
        "auth-token":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VyIjp7ImlkIjoiNjRlMzI1OWZlZTU1ZTFjNzM1MzZhZGI2In0sImlhdCI6MTY5MjYxMzM4NH0.u8mRAS59wbfwhH5TMUzt3qz5UdiP0eSKx_MNJ4wZnWA",
      },
      body: JSON.stringify({title, description, tag}),
    });
    const json = await response.json();
    console.log(json)

    console.log("editing the notes with id" + id);
    let newNotes=JSON.parse(JSON.stringify(notes))
    for (let index = 0; index <newNotes.length; index++) {
      const element = newNotes[index];
      if (element._id === id) {
        newNotes[index].title = title;
        newNotes[index].description = description;
        newNotes[index].tag = tag;
        break;
      }
    }
    // console.log(newNotes,id)
    setNotes(newNotes);
  };

  return (
    <NoteContext.Provider
      value={{ notes,addNote, deleteNote, editNote, getNotes }}
    >
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;
