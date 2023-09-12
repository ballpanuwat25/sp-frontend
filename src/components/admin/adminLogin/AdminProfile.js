import axios from "axios";
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

function AdminProfile({ logout }) {
    const [adminInfo, setAdminInfo] = useState({
        adminName: "",
        adminUsername: "",
        adminPassword: "",
    });

    const [values, setValues] = useState({
        Admin_Username: "",
        Admin_Password: "",
    });

    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    useEffect(() => {
        axios.get("http://localhost:3001/admin", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            },
        })
            .then((response) => {
                if (response.data.Error) {
                    console.error("Admin Request Error:", response.data.Error);
                } else {
                    setAdminInfo(response.data);
                    setValues({ ...values, Admin_Username: response.data.adminUsername });
                }
            })
            .catch((error) => {
                console.error("Admin Request Failed:", error);
            });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post("http://localhost:3001/admin-forget-password", values).then((response) => {
            if (response.data.Error) {
                alert(response.data.Error);
            } else {
                alert("Password changed successfully");
                axios.get("http://localhost:3001/admin-logout").then((response) => {
                    if (response.data.Error) {
                        alert(response.data.Error);
                    } else {
                        logout();
                        localStorage.removeItem('adminToken');
                        navigate("/admin-login");
                    }
                });
            }
        });
    };

    return (
        <div className="container-fluid">
            <h1>Admin Profile</h1> <hr />
            <h5>AdminName: {adminInfo.adminName}</h5>
            <h5>AdminUsername: {adminInfo.adminUsername}</h5>
            <h5>AdminPassword: {adminInfo.adminPassword}</h5> <hr />

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder='username'
                        defaultValue={adminInfo.adminName}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        placeholder='password'
                        values={values.Admin_Password}
                        onChange={(e) => setValues({ ...values, Admin_Password: e.target.value })}
                    />
                </div>

                <button type="submit" className="btn btn-primary w-100 mb-3">Submit</button>
            </form>
        </div>
    )
}

export default AdminProfile
