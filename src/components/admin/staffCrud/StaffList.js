import axios from "axios";
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react'

const StaffList = () => {
    const [staffs, setStaffs] = useState([]);

    useEffect(() => {
        getStaffs();
    }, []);

    const getStaffs = async () => {
        const response = await axios.get("https://backup-test.onrender.com/staff-list");
        setStaffs(response.data);
    };

    const deleteStaff = async (id) => {
        try {
            await axios.delete(`https://backup-test.onrender.com/staff-list/${id}`)
            getStaffs();
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="container-fluid">
            <div className='d-flex justify-content-between align-items-center'>
                <h2>Staff List</h2>
                <Link to={`add-staff`} className="btn btn-success ms-2"> Add Staff</Link>
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
                    {staffs.map((staff, index) => (
                        <tr key={staff.Staff_Id}>
                            <td> {index + 1} </td>
                            <td> {staff.Staff_FName} </td>
                            <td> {staff.Staff_LName} </td>
                            <td> {staff.Staff_Username} </td>
                            <td> {staff.Staff_Password} </td>
                            <td> {staff.Staff_Tel} </td>
                            <td>
                                <div className="d-grid gap-2 d-sm-flex">
                                    <Link to={`edit-staff/${staff.Staff_Id}`} className="btn btn-primary">Edit</Link>
                                    <button onClick={() => deleteStaff(staff.Staff_Id)} className="btn btn-danger">Delete</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default StaffList