import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Signup = () => {
    const hostURL = "http://localhost:5000";
    const [creds, setCreds] = useState({ name: "", email: "", password: "", cpassword: "" });
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, email, password } = creds;
        const response = await fetch(`${hostURL}/api/auth/createuser`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, email, password })
        });
        const json = await response.json();
        console.log("login: ", json);
        if (json.success) {
            localStorage.setItem("token", json.authToken);
            navigate("/");
        } else {
            alert(json.errors);
        }
    };
    const onChange = (e) => {
        setCreds({ ...creds, [e.target.name]: e.target.value });
    };
    return (
        <div className='container my-3'>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label forhtml="name" className="form-label">Name</label>
                    <input type="name" className="form-control" id="name" name="name" onChange={onChange} aria-describedby="nameHelp" />
                </div>
                <div className="mb-3">
                    <label forhtml="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="email" name="email" onChange={onChange} aria-describedby="emailHelp" />
                </div>
                <div className="mb-3">
                    <label forhtml="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" name="password" onChange={onChange} required minLength={5} />
                </div>
                <div className="mb-3">
                    <label forhtml="cpassword" className="form-label">Confirm Password</label>
                    <input type="password" className="form-control" id="cpassword" name="cpassword" onChange={onChange} required minLength={5} />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}
