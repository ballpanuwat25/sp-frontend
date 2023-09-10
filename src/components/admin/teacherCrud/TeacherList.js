import React, { useState, useEffect } from 'react'
import axios from "axios";
import { Link } from 'react-router-dom';

const TeacherList = () => {
    const [teachers, setTeachers] = useState([]);

    useEffect(() => {
        getTeachers();
    }, []);

    const getTeachers = async () => {
        const response = await axios.get("https://backup-test.onrender.com/teacher-list");
        setTeachers(response.data);
    };

    const deleteTeacher = async (id) => {
        try {
            await axios.delete(`https://backup-test.onrender.com/teacher-list/${id}`)
            getTeachers();
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="container-fluid">
            <div>
                <div className='d-flex justify-content-between align-items-center'>
                    <h2>Teacher List</h2>
                    <Link to={`add-teacher`} className="btn btn-success ms-2"> Add Teacher</Link>
                </div>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th scope="col">No</th>
                            <th scope="col">First Name</th>
                            <th scope="col">Last Name</th>
                            <th scope="col">Username</th>
                            <th scope="col">Password</th>
                            <th scope="col">Tel</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {teachers.map((teacher, index) => (
                            <tr key={teacher.Teacher_Id}>
                                <td> {index + 1} </td>
                                <td> {teacher.Teacher_FName} </td>
                                <td> {teacher.Teacher_LName} </td>
                                <td> {teacher.Teacher_Username} </td>
                                <td> {teacher.Teacher_Password} </td>
                                <td> {teacher.Teacher_Tel} </td>
                                <td>
                                    <div className="d-grid gap-2 d-sm-flex">
                                        <Link to={`edit-teacher/${teacher.Teacher_Id}`} className="btn btn-primary">Edit</Link>
                                        <button onClick={() => deleteTeacher(teacher.Teacher_Id)} className="btn btn-danger">Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default TeacherList