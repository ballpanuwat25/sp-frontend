import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AddStaff() {
    const [staff, setStaff] = useState({
        Staff_Id: "",
        Staff_FName: "",
        Staff_LName: "",
        Staff_Username: "",
        Staff_Password: "",
        Staff_Tel: ""
    });

    const navigate = useNavigate();

    const saveStaff = async (e) => {
        e.preventDefault();
        try {
            await axios.post("https://special-problem.onrender.com/staff-list", (staff));
            navigate("/staff-list");
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className='container-fluid'>
            <form onSubmit={saveStaff}>
                <div className="mb-3">
                    <label htmlFor="Staff_Id" className="form-label">Staff ID</label>
                    <input type="text" className="form-control" id="Staff_Id" placeholder="Enter Staff ID" required
                        onChange={(e) => {
                            setStaff({ ...staff, Staff_Id: e.target.value });
                        }
                        }
                    />

                    <label htmlFor="Staff_FName" className="form-label">Staff First Name</label>
                    <input type="text" className="form-control" id="Staff_FName" placeholder="Enter Staff First Name" required
                        onChange={(e) => {
                            setStaff({ ...staff, Staff_FName: e.target.value });
                        }}
                    />

                    <label htmlFor="Staff_LName" className="form-label">Staff Last Name</label>
                    <input type="text" className="form-control" id="Staff_LName" placeholder="Enter Staff Last Name" required
                        onChange={(e) => {
                            setStaff({ ...staff, Staff_LName: e.target.value });
                        }}
                    />

                    <label htmlFor="Staff_Username" className="form-label">Staff Username</label>
                    <input type="text" className="form-control" id="Staff_Username" placeholder="Enter Staff Username" required
                        onChange={(e) => {
                            setStaff({ ...staff, Staff_Username: e.target.value });
                        }}
                    />

                    <label htmlFor="Staff_Password" className="form-label">Staff Password</label>
                    <input type="password" className="form-control" id="Staff_Password" placeholder="Enter Staff Password" required
                        onChange={(e) => {
                            setStaff({ ...staff, Staff_Password: e.target.value });
                        }}
                    />

                    <label htmlFor="Staff_Tel" className="form-label">Staff Tel</label>
                    <input type="text" className="form-control" id="Staff_Tel" placeholder="Enter Staff Tel" required
                        onChange={(e) => {
                            setStaff({ ...staff, Staff_Tel: e.target.value });
                        }}
                    />

                    <button type="submit" className="btn btn-primary mt-3">Add Staff</button>
                </div>
            </form>
        </div>
    )
}

export default AddStaff
