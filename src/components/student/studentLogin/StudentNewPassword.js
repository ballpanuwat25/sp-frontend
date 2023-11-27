import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import '../../cssElement/Form.css';

function StudentNewPassword() {
    const [studentInfo, setStudentInfo] = useState({
        studentId: "",
        studentEmail: "",
    });

    const [confirmPassword, setConfirmPassword] = useState("");

    const [Student_FName, setStudent_FName] = useState("");
    const [Student_LName, setStudent_LName] = useState("");
    const [Student_Email, setStudent_Email] = useState("");
    const [Student_Password, setStudent_Password] = useState("");
    const [Student_Tel, setStudent_Tel] = useState("");

    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    useEffect(() => {
        axios.get(process.env.REACT_APP_API + "/student", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("studentToken")}`,
            },
        })
            .then((response) => {
                if (response.data.Error) {
                    console.error("Student Request Error:", response.data.Error);
                } else {
                    setStudentInfo(response.data);
                    setStudent_Email(response.data.studentEmail);
                }
            })
            .catch((error) => {
                console.error("Student Request Failed:", error);
            });
    }, []);

    useEffect(() => {
        getStudentsById()
        console.log(studentInfo.studentId)
    }, [])

    const id = studentInfo.studentId

    const getStudentsById = async () => {
        const response = await axios.get(process.env.REACT_APP_API + `/student-list/${id}`);
        const student = response.data;
        setStudent_FName(student.Student_FName);
        setStudent_LName(student.Student_LName);
        setStudent_Email(student.Student_Email);
        setStudent_Password(student.Student_Password);
        setStudent_Tel(student.Student_Tel);
    };

    const updateStudentInfo = async (e) => {
        e.preventDefault();

        if (Student_Password !== confirmPassword) {
            toast.error("Password and Confirm Password do not match");
            return;
        } else {
            try {
                const response = await axios.patch(process.env.REACT_APP_API + `/student-list/${id}`, {
                    Student_FName,
                    Student_LName,
                    Student_Email: studentInfo.studentEmail,
                    Student_Password,
                    Student_Tel,
                });

                if (response.status === 200) {
                    handleLogout();
                } else {
                    console.log("Unexpected response:", response);
                }
            } catch (error) {
                if (error.response && error.response.status === 400) {
                    alert("Email already exists")
                } else {
                    console.log("Error:", error);
                }
            }
        }
    };

    const handleLogout = () => {
        axios.get(process.env.REACT_APP_API + "/student-logout").then((response) => {
            if (response.data.Error) {
                alert(response.data.Error);
            } else {
                localStorage.removeItem('studentToken');
                navigate(" student-login");
            }
        });
    };

    return (
        <div className='container-fluid vh-100'>
            <ToastContainer />
            <main className='form__container'>
                <form onSubmit={updateStudentInfo} className="form__card form__card--login">
                    <h3 className='form__header'>New Password</h3>

                    <div className="mb-3 form__inputBox ">
                        <label htmlFor="Email" className='profile__label'>Email</label>
                        <input type="text" className='profile__input' id="Student_Email" placeholder="Enter Student Email" required readOnly
                            defaultValue={studentInfo.studentEmail}
                        />
                    </div>

                    <div className="mb-3 form__inputBox">
                        <label htmlFor="Password" className='profile__label'>New Password</label>
                        <input type="password" className='profile__input' id="Student_Password" placeholder="Enter Student Password" required
                            value={Student_Password}
                            onChange={(e) => {
                                setStudent_Password(e.target.value);
                            }}
                        />
                    </div>

                    <div className='mb-4 form__inputBox'>
                        <label htmlFor="Confirm Password" className='profile__label'>Confirm Password</label>
                        <input type="password" className='profile__input' id="Confirm_Password" placeholder="Enter Confirm Password" required
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                            }}
                        />
                    </div>

                    <button type="submit" className="form__btn">Submit</button>
                </form>
            </main>
        </div>
    )
}

export default StudentNewPassword