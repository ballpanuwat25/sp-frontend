import axios from 'axios';
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react'

function StaffEquipmentRequestList() {
    const [equipmentReq, setEquipmentReq] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedIds, setSelectedIds] = useState([]);
    const [Request_Comment, setRequest_Comment] = useState("");

    useEffect(() => {
        getEquipmentRequest();
    }, [searchQuery]);

    const getEquipmentRequest = async () => {
        const response = await axios.get("https://backup-test.onrender.com/equipment-request-list");
        setEquipmentReq(response.data);
    };

    const handleCheckboxChange = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    }

    const handleDeclineChecked = async () => {
        try {
            const promises = selectedIds.map((id) =>
                declineEquipmentRequest(id, Request_Comment)
            );

            await Promise.all(promises); // Wait for all requests to complete
            setSelectedIds([]); // Clear selectedIds after declining
            setRequest_Comment(""); // Clear the comment after successful decline
            getEquipmentRequest(); // Refresh the equipment request list after declining
        } catch (error) {
            console.log(error);
        }
    }

    const declineEquipmentRequest = async (id, comment) => {
        try {
            const data = {
                Request_Status: "Declined",
                Request_Comment: comment,
            };
            await axios.patch(`https://backup-test.onrender.com/equipment-request-list/${id}`, data);
        } catch (error) {
            console.log(error);
        }
    }

    const deleteEquipmentRequest = async (id) => {
        try {
            await axios.delete(`https://backup-test.onrender.com/equipment-request-list/${id}`)
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
            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <button onClick={handleDeclineChecked} className="btn btn-outline-danger">Decline Checked</button>
            </div>
            <div className="mb-3">
                <label htmlFor="Request_Comment" className="form-label">Decline Comment</label>
                <textarea
                    className="form-control"
                    id="Request_Comment"
                    rows="3"
                    value={Request_Comment}
                    onChange={(e) => setRequest_Comment(e.target.value)}
                ></textarea>
            </div>
            <input
                type="text"
                className="form-control"
                placeholder="Search by Student_Id or Chem_Id"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">Check</th>
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
                            <td>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        value={equipmentReq.Equipment_Request_Id}
                                        id={`flexCheckDefault-${equipmentReq.Equipment_Request_Id}`}
                                        checked={selectedIds.includes(equipmentReq.Equipment_Request_Id)}
                                        onChange={() => handleCheckboxChange(equipmentReq.Equipment_Request_Id)}
                                    />
                                </div>
                            </td>
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
                                    <Link to={`/staff-dashboard/staff-equipment-request/${equipmentReq.Equipment_Request_Id}`} className="btn btn-primary">View more</Link>
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