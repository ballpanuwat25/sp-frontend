import axios from 'axios';
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

function TeacherDashboard() {
    const [teacherUsername, setTeacherUsername] = useState("");
    const [chemicalsReq, setChemicalsReq] = useState([]);

    axios.defaults.withCredentials = true;

    useEffect(() => {
        axios.get("http://localhost:3001/teacher").then((response) => {
            if (response.data.Error) {
                alert(response.data.Error);
            } else {
                setTeacherUsername(response.data.teacherUsername);
            }
        });
    }, []);

    const handleLogout = () => {
        axios.get("http://localhost:3001/teacher-logout").then((response) => {
            if (response.data.Error) {
                alert(response.data.Error);
            } else {
                window.location.href = "/";
            }
        });
    };

    useEffect(() => {
        getChemicalsRequest();
    }, []);

    const getChemicalsRequest = async () => {
        const response = await axios.get("http://localhost:3001/chemicals-request-list");
        setChemicalsReq(response.data);
    };

    const deleteChemicalsRequest = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/chemicals-request-list/${id}`)
            getChemicalsRequest();
        } catch (error) {
            console.log(error)
        }
    }

    const formatDate = (dateString) => {
        const options = { day: 'numeric', month: 'numeric', year: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', options);
    };

    return (
        <div className='container-fluid'>
            <div className='d-flex justify-content-between align-items-center'>
                <h1>Teacher Dashboard - Welcome {teacherUsername}</h1>
                <div>
                    <Link to="/teacher-profile" className='btn btn-primary me-2'>Profile</Link>
                    <button className='btn btn-outline-danger' onClick={handleLogout}>Logout</button>
                </div>
            </div> <hr />

            <table className="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">Student Id</th>
                        <th scope="col">Chem Id</th>
                        <th scope="col">Requested Quantity</th>
                        <th scope="col">Counting Unit</th>
                        <th scope="col">Teacher Id</th>
                        <th scope="col">Request Status</th>
                        <th scope="col">Request Comment</th>
                        <th scope="col">Request Date</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {chemicalsReq.map((chemicalsReq) => (
                        <tr key={chemicalsReq.Chem_Request_Id}>
                            <td> {chemicalsReq.Student_Id} </td>
                            <td> {chemicalsReq.Chem_Id} </td>
                            <td> {chemicalsReq.Requested_Quantity} </td>
                            <td> {chemicalsReq.Counting_Unit} </td>
                            <td> {chemicalsReq.Teacher_Id} </td>
                            <td> {chemicalsReq.Request_Status} </td>
                            <td> {chemicalsReq.Request_Comment} </td>
                            <td>{formatDate(chemicalsReq.createdAt)}</td>
                            <td>
                                <div className="d-grid gap-2 d-sm-flex">
                                    <Link to={`./teacher-chemicals-request/${chemicalsReq.Chem_Request_Id}`} className="btn btn-primary">Edit</Link>
                                    <button onClick={() => deleteChemicalsRequest(chemicalsReq.Chem_Request_Id)} className="btn btn-outline-danger">Delete</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default TeacherDashboard