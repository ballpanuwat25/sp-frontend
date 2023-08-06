import axios from 'axios';
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react'

function StaffDashboard() {
    const [chemicalsReq, setChemicalsReq] = useState([]);

    axios.defaults.withCredentials = true;

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

    const handleLogout = () => {
        axios.get("http://localhost:3001/staff-logout").then((response) => {
            if (response.data.Error) {
                alert(response.data.Error);
            } else {
                window.location.href = "/";
            }
        });
    };

    return (
        <div className='container-fluid'>
            <div className='d-flex justify-content-between align-items-center'>
                <h1>Staff Dashboard</h1>
                <div className='d-flex justify-content-between align-items-center gap-2'>
                    <Link to="/staff-profile" className='btn btn-primary '>Profile</Link>
                    <div className="dropdown">
                        <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                            Products
                        </button>
                        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                            <li><Link to="/chemicals-list" className='dropdown-item'>Chemicals</Link></li>
                            <li><Link to="/chemicals-stock" className='dropdown-item'>Chemicals Stock</Link></li>
                            <li><Link to="/equipment-list" className='dropdown-item'>Equipment</Link></li>
                        </ul>
                    </div>
                    <button className='btn btn-outline-danger' onClick={handleLogout}>Logout</button>
                </div>
            </div> <hr />

            <h1>Student Request List</h1>
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
                                    <Link to={`./staff-chemicals-request/${chemicalsReq.Chem_Request_Id}`} className="btn btn-primary">Edit</Link>
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

export default StaffDashboard