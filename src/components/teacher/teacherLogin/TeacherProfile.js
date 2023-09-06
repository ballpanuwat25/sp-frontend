import axios from "axios";
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

function TeacherProfile() {
    const [teacherId, setTeacherId] = useState("");
    const [teacherFirstName, setTeacherFirstName] = useState("");
    const [teacherLastName, setTeacherLastName] = useState("");
    const [teacherUsername, setTeacherUsername] = useState("");
    const [teacherPassword, setTeacherPassword] = useState("");

    const [values, setValues] = useState({
        Teacher_Username: "",
        Teacher_Password: "",
    });

    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    useEffect(() => {
        axios.get("https://special-problem.onrender.com/teacher").then((response) => {
            if (response.data.Error) {
                alert(response.data.Error);
            } else {
                setTeacherId(response.data.teacherId);
                setTeacherFirstName(response.data.teacherFirstName);
                setTeacherLastName(response.data.teacherLastName);
                setTeacherUsername(response.data.teacherUsername);
                setTeacherPassword(response.data.teacherPassword);
                setValues({ ...values, Teacher_Username: response.data.teacherUsername });
            }
        });
        // eslint-disable-next-line
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post("https://special-problem.onrender.com/teacher-forget-password", values).then((response) => {
            if (response.data.Error) {
                alert(response.data.Error);
            } else {
                alert("Password changed successfully");
                axios.get("https://special-problem.onrender.com/teacher-logout").then((response) => {
                    if (response.data.Error) {
                        alert(response.data.Error);
                    } else {
                        navigate("/teacher-login");
                    }
                });
            }
        });
    };

    return (
        <div className="container-fluid">
            <h1>Teacher Profile</h1> <hr />
            <h5>TeacherId: {teacherId}</h5>
            <h5>TeacherFName: {teacherFirstName}</h5>
            <h5>TeacherLName: {teacherLastName}</h5>
            <h5>TeacherUsername: {teacherUsername}</h5>
            <h5>TeacherPassword: {teacherPassword}</h5> <hr />

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder='username'
                        defaultValue={teacherUsername}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        placeholder='password'
                        values={values.Teacher_Password}
                        onChange={(e) => setValues({ ...values, Teacher_Password: e.target.value })}
                    />
                </div>

                <button type="submit" className="btn btn-primary w-100 mb-3">Submit</button>
            </form>
        </div>
    )
}

export default TeacherProfile
