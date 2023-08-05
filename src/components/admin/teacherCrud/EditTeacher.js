import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditTeacher() {
    const [Teacher_FName, setTeacher_FName] = useState("");
    const [Teacher_LName, setTeacher_LName] = useState("");
    const [Teacher_Username, setTeacher_Username] = useState("");
    const [Teacher_Password, setTeacher_Password] = useState("");
    const [Teacher_Tel, setTeacher_Tel] = useState("");

    const { id } = useParams();

    const navigate = useNavigate();

    useEffect(() => {
        getTeachersById()
        // eslint-disable-next-line
    }, [])

    const getTeachersById = async () => {
        const response = await axios.get(`http://localhost:3001/teacher-list/${id}`);
        const teacher = response.data;
        setTeacher_FName(teacher.Teacher_FName);
        setTeacher_LName(teacher.Teacher_LName);
        setTeacher_Username(teacher.Teacher_Username);
        setTeacher_Password(teacher.Teacher_Password);
        setTeacher_Tel(teacher.Teacher_Tel);
    };

    const updateTeacher = async (e) => {
        e.preventDefault();
        const response = await axios.patch(`http://localhost:3001/teacher-list/${id}`, {
            Teacher_FName,
            Teacher_LName,
            Teacher_Username,
            Teacher_Password,
            Teacher_Tel
        });
        if (response.data.Error) {
            alert(response.data.Error);
        } else {
            navigate("/teacher-list");
        }
    };

    return (
        <div className="container-fluid">
            <form onSubmit={updateTeacher}>
                <div className="mb-3">
                    <label htmlFor="Teacher_FName" className="form-label">Teacher First Name</label>
                    <input type="text" className="form-control" id="Teacher_FName" placeholder="Enter Teacher First Name" required
                        value={Teacher_FName}
                        onChange={(e) => {
                            setTeacher_FName(e.target.value);
                        }}
                    />

                    <label htmlFor="Teacher_LName" className="form-label">Teacher Last Name</label>
                    <input type="text" className="form-control" id="Teacher_LName" placeholder="Enter Teacher Last Name" required
                        value={Teacher_LName}
                        onChange={(e) => {
                            setTeacher_LName(e.target.value);
                        }}
                    />

                    <label htmlFor="Teacher_Username" className="form-label">Teacher Username</label>
                    <input type="text" className="form-control" id="Teacher_Username" placeholder="Enter Teacher Username" required
                        value={Teacher_Username}
                        onChange={(e) => {
                            setTeacher_Username(e.target.value);
                        }}
                    />

                    <label htmlFor="Teacher_Password" className="form-label">Teacher Password</label>
                    <input type="password" className="form-control" id="Teacher_Password" placeholder="Enter Teacher Password" required
                        value={Teacher_Password}
                        onChange={(e) => {
                            setTeacher_Password(e.target.value);
                        }}
                    />

                    <label htmlFor="Teacher_Tel" className="form-label">Teacher Tel</label>
                    <input type="text" className="form-control" id="Teacher_Tel" placeholder="Enter Teacher Tel" required
                        value={Teacher_Tel}
                        onChange={(e) => {
                            setTeacher_Tel(e.target.value);
                        }}
                    />

                    <button type="submit" className="btn btn-primary mt-3">Update</button>
                </div>
            </form>
        </div>
    )
}

export default EditTeacher
