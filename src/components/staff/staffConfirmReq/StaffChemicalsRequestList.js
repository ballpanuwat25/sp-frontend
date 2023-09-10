import axios from 'axios';
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react'

function StaffChemicalsRequestList() {
    const [chemicalsReq, setChemicalsReq] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    const [selectedIds, setSelectedIds] = useState([]);

    const [Request_Comment, setRequest_Comment] = useState("");

    useEffect(() => {
        getChemicalsRequest();
    }, [searchQuery]);

    const getChemicalsRequest = async () => {
        const response = await axios.get("https://backup-test.onrender.com/chemicals-request-list");
        const filteredChemicalsReq = response.data.filter(chemicalsReq => {
            return (
                chemicalsReq.Student_Id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                chemicalsReq.Chem_Id.toLowerCase().includes(searchQuery.toLowerCase())
            );
        });
        setChemicalsReq(filteredChemicalsReq);
    };

    const updateChemicalsRequestStatus = async (id, status, comment) => {
        try {
            const data = {
                Request_Status: status,
                Request_Comment: comment,
            };
            await axios.patch(`https://backup-test.onrender.com/chemicals-request-list/${id}`, data);
        } catch (error) {
            console.log(error);
        }
    }

    const deleteChemicalsRequest = async (id) => {
        try {
            await axios.delete(`https://backup-test.onrender.com/chemicals-request-list/${id}`)
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
                updateChemicalsRequestStatus(id, "Rejected", Request_Comment) // Set status to "Rejected" for all selected items
            );

            await Promise.all(promises); // Wait for all requests to complete
            setSelectedIds([]); // Clear selectedIds after declining
            setRequest_Comment(""); // Clear the comment after successful decline
            getChemicalsRequest(); // Refresh the chemicals request list after declining
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='container-fluid'>
            <h1>Student Chemicals Request List</h1>
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
                        <th scope="col">Chemicals Request Id</th>
                        <th scope="col">Student Id</th>
                        <th scope="col">Chem Id</th>
                        <th scope="col">Chem Bottle Id</th>
                        <th scope="col">Requested Quantity</th>
                        <th scope="col">Release Quantity</th>
                        <th scope="col">Counting Unit</th>
                        <th scope="col">Staff Id</th>
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
                            <td>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        value={chemicalsReq.Chem_Request_Id}
                                        id={`flexCheckDefault-${chemicalsReq.Chem_Request_Id}`}
                                        checked={selectedIds.includes(chemicalsReq.Chem_Request_Id)}
                                        onChange={() => handleCheckboxChange(chemicalsReq.Chem_Request_Id)}
                                    />
                                </div>
                            </td>
                            <td> {chemicalsReq.Chem_Request_Id} </td>
                            <td> {chemicalsReq.Student_Id} </td>
                            <td> {chemicalsReq.Chem_Id} </td>
                            <td> {chemicalsReq.Chem_Bottle_Id} </td>
                            <td> {chemicalsReq.Requested_Quantity} </td>
                            <td> {chemicalsReq.Release_Quantity} </td>
                            <td> {chemicalsReq.Counting_Unit} </td>
                            <td> {chemicalsReq.Staff_Id} </td>
                            <td> {chemicalsReq.Teacher_Id} </td>
                            <td> {chemicalsReq.Request_Status} </td>
                            <td> {chemicalsReq.Request_Comment} </td>
                            <td>{formatDate(chemicalsReq.createdAt)}</td>
                            <td>
                                <div className="d-grid gap-2 d-sm-flex">
                                    <Link to={`/staff-dashboard/staff-chemicals-request/${chemicalsReq.Chem_Request_Id}`} className="btn btn-primary">View more</Link>
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

export default StaffChemicalsRequestList
