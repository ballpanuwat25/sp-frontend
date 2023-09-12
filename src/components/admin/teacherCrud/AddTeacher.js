import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AddTeacher() {
    const [teacher, setTeacher] = useState({
        Teacher_Id: "",
        Teacher_FName: "",
        Teacher_LName: "",
        Teacher_Username: "",
        Teacher_Password: "",
        Teacher_Tel: ""
    });

    const navigate = useNavigate();

    const saveTeacher = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:3001/teacher-list", (teacher));
            navigate("/teacher-list");
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className='container-fluid'>
            <form onSubmit={saveTeacher}>
                <div className="mb-3">
                    <label htmlFor="Teacher_Id" className="form-label">Teacher ID</label>
                    <input type="text" className="form-control" id="Teacher_Id" placeholder="Enter Teacher ID" required
                        onChange={(e) => {
                            setTeacher({ ...teacher, Teacher_Id: e.target.value });
                        }}
                    />
                    
                    <label htmlFor="Teacher_FName" className="form-label">Teacher First Name</label>
                    <input type="text" className="form-control" id="Teacher_FName" placeholder="Enter Teacher First Name" required
                        onChange={(e) => {
                            setTeacher({ ...teacher, Teacher_FName: e.target.value });
                        }}
                    />

                    <label htmlFor="Teacher_LName" className="form-label">Teacher Last Name</label>
                    <input type="text" className="form-control" id="Teacher_LName" placeholder="Enter Teacher Last Name" required
                        onChange={(e) => {
                            setTeacher({ ...teacher, Teacher_LName: e.target.value });
                        }}
                    />

                    <label htmlFor="Teacher_Username" className="form-label">Teacher Username</label>
                    <input type="text" className="form-control" id="Teacher_Username" placeholder="Enter Teacher Username" required
                        onChange={(e) => {
                            setTeacher({ ...teacher, Teacher_Username: e.target.value });
                        }}
                    />

                    <label htmlFor="Teacher_Password" className="form-label">Teacher Password</label>
                    <input type="password" className="form-control" id="Teacher_Password" placeholder="Enter Teacher Password" required
                        onChange={(e) => {
                            setTeacher({ ...teacher, Teacher_Password: e.target.value });
                        }}
                    />

                    <label htmlFor="Teacher_Tel" className="form-label">Teacher Tel</label>
                    <input type="text" className="form-control" id="Teacher_Tel" placeholder="Enter Teacher Tel" required
                        onChange={(e) => {
                            setTeacher({ ...teacher, Teacher_Tel: e.target.value });
                        }}
                    />

                    <button type="submit" className="btn btn-primary mt-3">Add Teacher</button>
                </div>
            </form>
        </div>
    )
}

export default AddTeacher
