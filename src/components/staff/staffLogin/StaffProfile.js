import axios from "axios";
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

function StaffProfile({ logout }) {
    const [staffInfo, setStaffInfo] = useState({    
        staffId: "",
        staffFirstName: "",
        staffLastName: "",
        staffUsername: "",
        staffPassword: "",
    });

    const [values, setValues] = useState({
        Staff_Username: "",
        Staff_Password: "",
    });

    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    useEffect(() => {
        axios.get("https://backup-test.onrender.com/staff", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("staffToken")}`,
            },
        })
            .then((response) => {
                if (response.data.Error) {
                    console.error("Staff Request Error:", response.data.Error);
                } else {
                    setStaffInfo(response.data);
                    setValues({ ...values, Staff_Username: response.data.staffUsername });
                }
            })
            .catch((error) => {
                console.error("Staff Request Failed:", error);
            });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post("https://backup-test.onrender.com/staff-forget-password", values).then((response) => {
            if (response.data.Error) {
                alert(response.data.Error);
            } else {
                alert("Password changed successfully");
                axios.get("https://backup-test.onrender.com/staff-logout").then((response) => {
                    if (response.data.Error) {
                        alert(response.data.Error);
                    } else {
                        logout();
                        localStorage.removeItem('staffToken');
                        navigate("/staff-login");
                    }
                });
            }
        });
    };

    return (
        <div className="container-fluid">
            <h1>Staff Profile</h1> <hr />
            <h5>StaffId: {staffInfo.staffId}</h5>
            <h5>StaffFName: {staffInfo.staffFirstName}</h5>
            <h5>StaffLName: {staffInfo.staffLastName}</h5>
            <h5>StaffUsername: {staffInfo.staffUsername}</h5>
            <h5>StaffPassword: {staffInfo.staffPassword}</h5> <hr />

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder='username'
                        defaultValue={staffInfo.staffUsername}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        placeholder='password'
                        values={values.Staff_Password}
                        onChange={(e) => setValues({ ...values, Staff_Password: e.target.value })}
                    />
                </div>

                <button type="submit" className="btn btn-primary w-100 mb-3">Submit</button>
            </form>
        </div>
    )
}

export default StaffProfile
