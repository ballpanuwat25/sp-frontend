import axios from "axios";
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

function StaffProfile() {
    const [staffId, setStaffId] = useState("");
    const [staffFirstName, setStaffFirstName] = useState("");
    const [staffLastName, setStaffLastName] = useState("");
    const [staffUsername, setStaffUsername] = useState("");
    const [staffPassword, setStaffPassword] = useState("");

    const [values, setValues] = useState({
        Staff_Username: "",
        Staff_Password: "",
    });

    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    useEffect(() => {
        axios.get("https://special-problem.onrender.com/staff").then((response) => {
            if (response.data.Error) {
                alert(response.data.Error);
            } else {
                setStaffId(response.data.staffId);
                setStaffFirstName(response.data.staffFirstName);
                setStaffLastName(response.data.staffLastName);
                setStaffUsername(response.data.staffUsername);
                setStaffPassword(response.data.staffPassword);
                setValues({ ...values, Staff_Username: response.data.staffUsername });
            }
        });
        // eslint-disable-next-line
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post("https://special-problem.onrender.com/staff-forget-password", values).then((response) => {
            if (response.data.Error) {
                alert(response.data.Error);
            } else {
                alert("Password changed successfully");
                axios.get("https://special-problem.onrender.com/staff-logout").then((response) => {
                    if (response.data.Error) {
                        alert(response.data.Error);
                    } else {
                        navigate("/staff-login");
                    }
                });
            }
        });
    };

    return (
        <div className="container-fluid">
            <h1>Staff Profile</h1> <hr />
            <h5>StaffId: {staffId}</h5>
            <h5>StaffFName: {staffFirstName}</h5>
            <h5>StaffLName: {staffLastName}</h5>
            <h5>StaffUsername: {staffUsername}</h5>
            <h5>StaffPassword: {staffPassword}</h5> <hr />

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder='username'
                        defaultValue={staffUsername}
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
