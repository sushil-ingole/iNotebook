import React, { useContext } from 'react'
import noteContext from '../context/notes/noteContext';

export const NoteItem = (props) => {
    const context = useContext(noteContext);
    const { deleteNote } = context;
    const { note, editNote } = props;
    return (
        <div className="col-md-3 my-2">
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">{note.title}</h5>
                    <p className="card-text">{note.description}</p>
                    <i className="far fa-trash-alt mx-2" onClick={() => { deleteNote(note._id) }}></i>
                    <i className="far fa-edit mx-2" onClick={() => { editNote(note) }}></i>
                </div>
            </div>
        </div>
    );
}
