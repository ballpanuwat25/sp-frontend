import axios from 'axios'
import React, { useState, useEffect } from 'react'

function TeacherNewPassword() {
    const [teacherInfo, setTeacherInfo] = useState({
        teacherId: "",
        teacherFirstName: "",
        teacherLastName: "",
        teacherEmail: "",
        teacherUsername: "",
        teacherPassword: "",
    });

    axios.defaults.withCredentials = true;

    useEffect(() => {
        axios.get("https://special-problem.onrender.com/teacher", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("teacherToken")}`,
            },
        })
            .then((response) => {
                if (response.data.Error) {
                    console.error("Teacher Request Error:", response.data.Error);
                } else {
                    setTeacherInfo(response.data);
                }
            })
            .catch((error) => {
                console.error("Teacher Request Failed:", error);
            });
    }, []);

    return (
        <div>
            TeacherNewPassword
            <hr />
            <p>รหัสอาจารย์: {teacherInfo.teacherId}</p>
            <p>ชื่อ: {teacherInfo.teacherFirstName}</p>
            <p>นามสกุล: {teacherInfo.teacherLastName}</p>
            <p>อีเมล: {teacherInfo.teacherEmail}</p>
            <p>ชื่อผู้ใช้: {teacherInfo.teacherUsername}</p>
            <p>รหัสผ่าน: {teacherInfo.teacherPassword}</p>
        </div>
    )
}

export default TeacherNewPassword
