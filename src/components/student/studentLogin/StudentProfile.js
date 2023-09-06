import axios from "axios";
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

function StudentProfile() {
    const [studentId, setStudentId] = useState("");
    const [studentFirstName, setStudentFirstName] = useState("");
    const [studentLastName, setStudentLastName] = useState("");
    const [studentEmail, setStudentEmail] = useState("");
    const [studentPassword, setStudentPassword] = useState("");

    const [values, setValues] = useState({
        Student_Email: "",
        Student_Password: "",
    });

    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    useEffect(() => {
        axios.get("https://special-problem.onrender.com/student").then((response) => {
            if (response.data.Error) {
                alert(response.data.Error);
            } else {
                setStudentId(response.data.studentId);
                setStudentFirstName(response.data.studentFirstName);
                setStudentLastName(response.data.studentLastName);
                setStudentEmail(response.data.studentEmail);
                setStudentPassword(response.data.studentPassword);
                setValues({ ...values, Student_Email: response.data.studentEmail });
            }
        });
        // eslint-disable-next-line
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post("https://special-problem.onrender.com/student-forget-password", values).then((response) => {
            if (response.data.Error) {
                alert(response.data.Error);
            } else {
                alert("Password changed successfully");
                axios.get("https://special-problem.onrender.com/student-logout").then((response) => {
                    if (response.data.Error) {
                        alert(response.data.Error);
                    } else {
                        navigate("/student-login");
                    }
                });
            }
        });
    };

    return (
        <div className="container-fluid">
            <h1>Student Profile</h1> <hr />
            <h5>StudentId: {studentId}</h5>
            <h5>StudentFName: {studentFirstName}</h5>
            <h5>StudentLName: {studentLastName}</h5>
            <h5>StudentEmail: {studentEmail}</h5>
            <h5>StudentPassword: {studentPassword}</h5> <hr />

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder='email'
                        defaultValue={studentEmail}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        placeholder='password'
                        values={values.Student_Password}
                        onChange={(e) => setValues({ ...values, Student_Password: e.target.value })}
                    />
                </div>

                <button type="submit" className="btn btn-primary w-100 mb-3">Submit</button>
            </form>
        </div>
    )
}

export default StudentProfile
