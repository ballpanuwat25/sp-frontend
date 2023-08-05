import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

function TeacherChemicalsRequest() {
    const [Teacher_Id, setTeacher_Id] = useState("");
    const [Request_Status, setRequest_Status] = useState("");
    const [Request_Comment, setRequest_Comment] = useState("");

    const [teacherId, setTeacherId] = useState("");
    const [teacherIdInputValue, setTeacherIdInputValue] = useState("");

    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        loadTeacherId();
        loadChemicalsRequestById();
    }, []);

    const loadTeacherId = async () => {
        try {
            const response = await axios.get("http://localhost:3001/teacher");
            if (response.data.Error) {
                alert(response.data.Error);
            } else {
                setTeacherId(response.data.teacherId);
            }
        } catch (error) {
            console.error("Error fetching teacher data:", error);
        }
    };

    const loadChemicalsRequestById = async () => {
        const result = await axios.get(`http://localhost:3001/chemicals-request-list/${id}`);
        setTeacher_Id(result.data.Teacher_Id);
        setRequest_Status(result.data.Request_Status);
        setRequest_Comment(result.data.Request_Comment);
    };

    const updateChemicalsRequest = async (e) => {
        e.preventDefault();
        const data = {
            Teacher_Id: teacherIdInputValue, // Update the Teacher_Id with the input value
            Request_Status,
            Request_Comment,
        };
        await axios.patch(`http://localhost:3001/chemicals-request-list/${id}`, data);
        navigate("/teacher-dashboard");
    };

    useEffect(() => {
        if (!teacherIdInputValue && teacherId) {
            setTeacherIdInputValue(teacherId);
        }
    }, [teacherId, teacherIdInputValue]);

    return (
        <div className="container-fluid">
            <h1>Teacher Chemicals Request</h1>
            <form onSubmit={updateChemicalsRequest}>
                <div className="mb-3">
                    <label htmlFor="Teacher_Id" className="form-label">Teacher Id</label>
                    <input
                        type="text"
                        className="form-control"
                        id="Teacher_Id"
                        placeholder="Enter Teacher Id"
                        value={teacherIdInputValue}
                        readOnly
                        onChange={(e) => {
                            setTeacherIdInputValue(e.target.value);
                        }}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="Request_Status" className="form-label">Request Status</label>
                    <select className="form-select" id="Request_Status" required value={Request_Status || ''}
                        onChange={(e) => {
                            setRequest_Status(e.target.value);
                        }}
                    >
                        <option value="">Select Request Status</option>
                        <option value="Approve">Approve</option>
                        <option value="Decline">Decline</option>
                    </select>
                </div>

                <div className="mb-3">
                    <label htmlFor="Request_Comment" className="form-label">Request Comment</label>
                    <input type="text" className="form-control" id="Request_Comment" placeholder="Enter Request Comment" value={Request_Comment}
                        onChange={(e) => {
                            setRequest_Comment(e.target.value);
                        }}
                        required={Request_Status === "Decline"}
                    />
                </div>
                <button type="submit" className="btn btn-primary">Update Chemicals Request</button>
            </form>
        </div>
    )
}

export default TeacherChemicalsRequest