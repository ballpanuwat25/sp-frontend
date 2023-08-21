import axios from 'axios';
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react'

function StaffChemicalsRequestList() {
    const [chemicalsReq, setChemicalsReq] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    axios.defaults.withCredentials = true;

    useEffect(() => {
        getChemicalsRequest();
    }, [searchQuery]);

    const getChemicalsRequest = async () => {
        const response = await axios.get("http://localhost:3001/chemicals-request-list");
        const filteredChemicalsReq = response.data.filter(chemicalsReq => {
            return (
                chemicalsReq.Student_Id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                chemicalsReq.Chem_Id.toLowerCase().includes(searchQuery.toLowerCase())
            );
        });
        setChemicalsReq(filteredChemicalsReq);
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
            <h1>Student Chemicals Request List</h1>
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
