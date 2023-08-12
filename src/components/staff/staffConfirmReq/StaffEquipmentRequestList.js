import axios from 'axios';
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react'

function StaffEquipmentRequestList() {
    const [equipmentReq, setEquipmentReq] = useState([]);

    axios.defaults.withCredentials = true;

    useEffect(() => {
        getEquipmentRequest();
    }, []);

    const getEquipmentRequest = async () => {
        const response = await axios.get("http://localhost:3001/equipment-request-list");
        setEquipmentReq(response.data);
    };

    const deleteEquipmentRequest = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/equipment-request-list/${id}`)
            getEquipmentRequest();
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
            <h1>Student Equipment Request List</h1>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">Equipment Request Id</th>
                        <th scope="col">Student Id</th>
                        <th scope="col">Equipment Id</th>
                        <th scope="col">Requested Quantity</th>
                        <th scope="col">Release Quantity</th>
                        <th scope="col">Staff Id</th>
                        <th scope="col">Teacher Id</th>
                        <th scope="col">Request Status</th>
                        <th scope="col">Request Comment</th>
                        <th scope="col">Request Date</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {equipmentReq.map((equipmentReq) => (
                        <tr key={equipmentReq.Equipment_Request_Id}>
                            <td> {equipmentReq.Equipment_Request_Id} </td>
                            <td> {equipmentReq.Student_Id} </td>
                            <td> {equipmentReq.Equipment_Id} </td>
                            <td> {equipmentReq.Requested_Quantity} </td>
                            <td> {equipmentReq.Release_Quantity} </td>
                            <td> {equipmentReq.Staff_Id} </td>
                            <td> {equipmentReq.Teacher_Id} </td>
                            <td> {equipmentReq.Request_Status} </td>
                            <td> {equipmentReq.Request_Comment} </td>
                            <td>{formatDate(equipmentReq.createdAt)}</td>
                            <td>
                                <div className="d-grid gap-2 d-sm-flex">
                                    <Link to={`/staff-dashboard/staff-equipment-request/${equipmentReq.Equipment_Request_Id}`} className="btn btn-primary">Edit</Link>
                                    <button onClick={() => deleteEquipmentRequest(equipmentReq.Equipment_Request_Id)} className="btn btn-outline-danger">Delete</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default StaffEquipmentRequestList