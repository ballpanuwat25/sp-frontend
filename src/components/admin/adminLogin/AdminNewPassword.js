import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

import '../../cssElement/Form.css';

function AdminNewPassword() {
    const [adminInfo, setAdminInfo] = useState({
        adminId: "",
        adminUsername: "",
    });

    const [confirmPassword, setConfirmPassword] = useState("");

    const [Admin_FName, setAdmin_FName] = useState("");
    const [Admin_LName, setAdmin_LName] = useState("");
    const [Admin_Email, setAdmin_Email] = useState("");
    const [Admin_Username, setAdmin_Username] = useState("");
    const [Admin_Password, setAdmin_Password] = useState("");
    const [Admin_Tel, setAdmin_Tel] = useState("");

    const id = adminInfo.adminId;

    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    useEffect(() => {
        getAdminsById()
    }, [])

    useEffect(() => {
        axios.get(process.env.REACT_APP_API + "/admin", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            },
        })
            .then((response) => {
                if (response.data.Error) {
                    console.error("Admin Request Error:", response.data.Error);
                } else {
                    setAdminInfo(response.data);
                    setAdmin_Username(response.data.adminUsername);
                }
            })
            .catch((error) => {
                console.error("Admin Request Failed:", error);
            });
    }, []);

    const getAdminsById = async () => {
        const response = await axios.get(process.env.REACT_APP_API + `/admin-list/${id}`);
        const admin = response.data;
        setAdmin_FName(admin.Admin_FName);
        setAdmin_LName(admin.Admin_LName);
        setAdmin_Email(admin.Admin_Email);
        setAdmin_Username(admin.Admin_Username);
        setAdmin_Password(admin.Admin_Password);
        setAdmin_Tel(admin.Admin_Tel);
    };

    const updateAdminInfo = async (e) => {
        e.preventDefault();

        if (Admin_Password !== confirmPassword) {
            alert("Password and Confirm Password do not match");
            return;
        } else {
            try {
                const response = await axios.patch(process.env.REACT_APP_API + `/admin-list/${id}`, {
                    Admin_FName,
                    Admin_LName,
                    Admin_Email,
                    Admin_Username: adminInfo.adminUsername,
                    Admin_Password,
                    Admin_Tel
                });

                if (response.status === 200) {
                    handleLogout();
                } else {
                    console.log("Unexpected response:", response);
                }
            } catch (err) {
                if (err.response && err.response.status === 400) {
                    alert("Username already exists")
                } else {
                    console.log("Error:", err);
                }
            }
        }
    };

    const handleLogout = () => {
        axios.get(process.env.REACT_APP_API + "/admin-logout").then((response) => {
            if (response.data.Error) {
                alert(response.data.Error);
            } else {
                localStorage.removeItem('adminToken');
                navigate(" admin-login");
            }
        });
    };

    return (
        <div className='container-fluid vh-100'>
            <main className='form__container'>
                <form onSubmit={updateAdminInfo} className="form__card form__card--login">
                    <h3 className='form__header'>New Password</h3>

                    <div className="mb-3 form__inputBox ">
                        <label htmlFor="Username" className='profile__label'>Username</label>
                        <input type="text" className='profile__input' id="Admin_Username" placeholder="Enter Your Username" required readOnly
                            defaultValue={adminInfo.adminUsername}
                        />
                    </div>

                    <div className="mb-3 form__inputBox">
                        <label htmlFor="Password" className='profile__label'>New Password</label>
                        <input type="password" className='profile__input' id="Admin_Password" placeholder="Enter Admin Password" required
                            value={Admin_Password}
                            onChange={(e) => {
                                setAdmin_Password(e.target.value);
                            }}
                        />
                    </div>

                    <div className='mb-4 form__inputBox'>
                        <label htmlFor="Confirm Password" className='profile__label'>Confirm Password</label>
                        <input type="password" className='profile__input' id="Confirm_Password" placeholder="Enter Confirm Password" required
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                            }}
                        />
                    </div>

                    <button type="submit" className="form__btn">Submit</button>
                </form>
            </main>
        </div>
    )
}

export default AdminNewPassword
