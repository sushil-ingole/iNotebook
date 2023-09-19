import React, { useContext, useEffect, useRef, useState } from 'react';
import noteContext from "../context/notes/noteContext";
import { NoteItem } from './NoteItem';
import { AddNote } from './AddNote';
import { useNavigate } from "react-router-dom";

export const Notes = () => {
    const context = useContext(noteContext);
    const { notes, getNotes, updateNote } = context;
    const navigate = useNavigate();
    useEffect(() => {
        if (localStorage.getItem("token")) {
            getNotes();
        } else {
            navigate("/login");
        }
        // eslint-disable-next-line
    }, []);
    const ref = useRef(null);
    const refClose = useRef(null);
    const [note, setNote] = useState({ id: "", etitle: "", edescription: "", etag: "" });
    const editNote = (currentNote) => {
        console.log(currentNote);
        ref.current.click();
        setNote({ id: currentNote._id, etitle: currentNote.title, edescription: currentNote.description, etag: currentNote.tag });
    };
    const handleClick = (e) => {
        updateNote(note.id, note.etitle, note.edescription, note.etag);
        getNotes();
        refClose.current.click();
    };
    const onChange = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value });
    };
    return (
        <>
            <AddNote />
            <button type="button" className="btn btn-primary d-none my-3" data-bs-toggle="modal" data-bs-target="#exampleModal" ref={ref}>
                Edit note
            </button>
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Edit note</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="title" className="form-label">Title</label>
                                    <input type="text" className="form-control" id="etitle" name="etitle" value={note.etitle} onChange={onChange} aria-describedby="title" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">Description</label>
                                    <input type="text" className="form-control" id="edescription" name="edescription" value={note.edescription} onChange={onChange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="tag" className="form-label">Tag</label>
                                    <input type="text" className="form-control" id="etag" name="etag" value={note.etag} onChange={onChange} />
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" ref={refClose}>Close</button>
                            <button type="button" className="btn btn-primary" onClick={handleClick}>Update note</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row my-3">
                <h2>Your Notes</h2>
                <div className="container">
                    {notes.length === 0 && "No notes to display"}
                </div>
                {notes.map((note) => {
                    return <NoteItem key={note._id} editNote={editNote} note={note} />;
                })}
            </div>
        </>
    );
}
