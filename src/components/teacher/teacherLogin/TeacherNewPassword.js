import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import '../../cssElement/Form.css';

function TeacherNewPassword() {
    const [teacherInfo, setTeacherInfo] = useState({
        teacherId: "",
        teacherUsername: "",
    });

    const [confirmPassword, setConfirmPassword] = useState("");

    const [Teacher_FName, setTeacher_FName] = useState("");
    const [Teacher_LName, setTeacher_LName] = useState("");
    const [Teacher_Email, setTeacher_Email] = useState("");
    const [Teacher_Username, setTeacher_Username] = useState("");
    const [Teacher_Password, setTeacher_Password] = useState("");
    const [Teacher_Tel, setTeacher_Tel] = useState("");

    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    useEffect(() => {
        axios.get(process.env.REACT_APP_API + "/teacher", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("teacherToken")}`,
            },
        })
            .then((response) => {
                if (response.data.Error) {
                    console.error("Teacher Request Error:", response.data.Error);
                } else {
                    setTeacherInfo(response.data);
                    setTeacher_Username(response.data.teacherUsername);
                }
            })
            .catch((error) => {
                console.error("Teacher Request Failed:", error);
            });
    }, []);

    useEffect(() => {
        getTeachersById()
    }, [])

    const id = teacherInfo.teacherId

    const getTeachersById = async () => {
        const response = await axios.get(process.env.REACT_APP_API + `/teacher-list/${id}`);
        const teacher = response.data;
        setTeacher_FName(teacher.Teacher_FName);
        setTeacher_LName(teacher.Teacher_LName);
        setTeacher_Email(teacher.Teacher_Email);
        setTeacher_Username(teacher.Teacher_Username);
        setTeacher_Password(teacher.Teacher_Password);
        setTeacher_Tel(teacher.Teacher_Tel);
    };

    const updateTeacherInfo = async (e) => {
        e.preventDefault();

        if (Teacher_Password !== confirmPassword) {
            toast.error("Password and Confirm Password do not match");
            return;
        } else {
            try {
                const response = await axios.patch(process.env.REACT_APP_API + `/teacher-list/${id}`, {
                    Teacher_FName,
                    Teacher_LName,
                    Teacher_Email,
                    Teacher_Username: teacherInfo.teacherUsername,
                    Teacher_Password,
                    Teacher_Tel
                });

                if (response.status === 200) {
                    handleLogout();
                } else {
                    console.log("Unexpected response:", response);
                }
            } catch (err) {
                if (err.response && err.response.status === 400) {
                    alert("Username already exists")
                } else {
                    console.log("Error:", err);
                }
            }
        }
    };

    const handleLogout = () => {
        axios.get(process.env.REACT_APP_API + "/teacher-logout").then((response) => {
            if (response.data.Error) {
                alert(response.data.Error);
            } else {
                localStorage.removeItem('teacherToken');
                navigate("/teacher-login");
            }
        });
    };

    return (
        <div className='container-fluid vh-100'>
            <ToastContainer />
            <main className='form__container'>
                <form onSubmit={updateTeacherInfo} className="form__card form__card--login">
                    <h3 className='form__header'>New Password</h3>

                    <div className="mb-3 form__inputBox ">
                        <label htmlFor="Username" className='profile__label'>Username</label>
                        <input type="text" className='profile__input' id="Teacher_Username" placeholder="Enter Teacher Username" required readOnly
                            defaultValue={teacherInfo.teacherUsername}
                        />
                    </div>

                    <div className="mb-3 form__inputBox">
                        <label htmlFor="Password" className='profile__label'>New Password</label>
                        <input type="password" className='profile__input' id="Teacher_Password" placeholder="Enter Teacher Password" required
                            value={Teacher_Password}
                            onChange={(e) => {
                                setTeacher_Password(e.target.value);
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

export default TeacherNewPassword
