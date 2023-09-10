import axios from "axios";
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

function StudentProfile() {
    const [studentInfo, setStudentInfo] = useState({
        studentId: "",
        studentFirstName: "",
        studentLastName: "",
        studentEmail: "",
        studentPassword: "",
    });

    const [values, setValues] = useState({
        Student_Email: "",
        Student_Password: "",
    });

    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    useEffect(() => {
        axios.get("https://backup-test.onrender.com/student", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("studentToken")}`,
            },
        })
            .then((response) => {
                if (response.data.Error) {
                    console.error("Student Request Error:", response.data.Error);
                } else {
                    setStudentInfo(response.data);
                    setValues({ ...values, Student_Email: response.data.studentEmail });
                }
            })
            .catch((error) => {
                console.error("Student Request Failed:", error);
            });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post("https://backup-test.onrender.com/student-forget-password", values).then((response) => {
            if (response.data.Error) {
                alert(response.data.Error);
            } else {
                alert("Password changed successfully");
                axios.get("https://backup-test.onrender.com/student-logout").then((response) => {
                    if (response.data.Error) {
                        alert(response.data.Error);
                    } else {
                        localStorage.removeItem('studentToken');
                        navigate("/student-login");
                    }
                });
            }
        });
    };

    return (
        <div className="container-fluid">
            <h1>Student Profile</h1> <hr />
            <h5>StudentId: {studentInfo.studentId}</h5>
            <h5>StudentFName: {studentInfo.studentFirstName}</h5>
            <h5>StudentLName: {studentInfo.studentLastName}</h5>
            <h5>StudentEmail: {studentInfo.studentEmail}</h5>
            <h5>StudentPassword: {studentInfo.studentPassword}</h5> <hr />

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder='email'
                        defaultValue={studentInfo.studentEmail}
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
