import { useState } from "react";
import NoteContext from "./noteContext";
// import { useNavigate } from "react-router-dom";

const NoteState = (props) => {
    const hostURL = "http://localhost:5000";
    const initialNotes = [];
    const [notes, setNotes] = useState(initialNotes);
    // const navigate = useNavigate();

    const getNotes = async () => {
        const response = await fetch(`${hostURL}/api/note/fetchallnotes`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem("token")
            }
        });
        const json = await response.json();
        setNotes(json);
    };
    const addNote = async (title, description, tag) => {
        await fetch(`${hostURL}/api/note/addnote`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem("token")
            },
            body: JSON.stringify({ title, description, tag })
        });
        getNotes();
    };
    const deleteNote = async (id) => {
        await fetch(`${hostURL}/api/note/deletenote/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem("token")
            }
        });
        getNotes();
    };
    const updateNote = async (id, title, description, tag) => {
        console.log("NoteState: ", id, ", ", title, ", ", description, ", ", tag);
        await fetch(`${hostURL}/api/note/updatenote/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem("token")
            },
            body: JSON.stringify({ id, title, description, tag })
        });
        const newNotes = notes;
        newNotes.forEach((note) => {
            if (note._id === id) {
                note.title = title;
                note.description = description;
                note.tag = tag;
            }
        });
        setNotes(newNotes);
        getNotes();
    };
    const userLogin = async (email, password) => {
        const response = await fetch(`${hostURL}/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });
        const json = await response.json();
        console.log("login: ", json);
        if (json.success) {
            localStorage.setItem("token", json.authToken);
            // navigate("/");
        } else {
            alert("Invalid credentials!");
        }
    }
    return (
        <NoteContext.Provider value={{ notes, getNotes, setNotes, addNote, deleteNote, updateNote, userLogin }}>
            {props.children}
        </NoteContext.Provider>
    );
};

export default NoteState;