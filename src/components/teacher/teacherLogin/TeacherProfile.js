import axios from "axios";
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

function TeacherProfile({ logout }) {
    const [teacherInfo, setTeacherInfo] = useState({
        teacherId: "",
        teacherFirstName: "",
        teacherLastName: "",
        teacherUsername: "",
        teacherPassword: "",
    });

    const [values, setValues] = useState({
        Teacher_Username: "",
        Teacher_Password: "",
    });

    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    useEffect(() => {
        axios.get("http://localhost:3001/teacher", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("teacherToken")}`,
            },
        })
            .then((response) => {
                if (response.data.Error) {
                    console.error("Teacher Request Error:", response.data.Error);
                } else {
                    setTeacherInfo(response.data);
                    setValues({ ...values, Teacher_Username: response.data.teacherUsername });
                }
            })
            .catch((error) => {
                console.error("Teacher Request Failed:", error);
            });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post("http://localhost:3001/teacher-forget-password", values).then((response) => {
            if (response.data.Error) {
                alert(response.data.Error);
            } else {
                alert("Password changed successfully");
                axios.get("http://localhost:3001/teacher-logout").then((response) => {
                    if (response.data.Error) {
                        alert(response.data.Error);
                    } else {
                        logout();
                        localStorage.removeItem('teacherToken');
                        navigate("/teacher-login");
                    }
                });
            }
        });
    };

    return (
        <div className="container-fluid">
            <h1>Teacher Profile</h1> <hr />
            <h5>TeacherId: {teacherInfo.teacherId}</h5>
            <h5>TeacherFName: {teacherInfo.teacherFirstName}</h5>
            <h5>TeacherLName: {teacherInfo.teacherLastName}</h5>
            <h5>TeacherUsername: {teacherInfo.teacherUsername}</h5>
            <h5>TeacherPassword: {teacherInfo.teacherPassword}</h5> <hr />

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder='username'
                        defaultValue={teacherInfo.teacherUsername}
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
