import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

import '../../cssElement/Form.css';

function StaffNewPassword() {
    const [staffInfo, setStaffInfo] = useState({
        staffId: "",
        staffUsername: "",
    });

    const [confirmPassword, setConfirmPassword] = useState("");

    const [Staff_FName, setStaff_FName] = useState("");
    const [Staff_LName, setStaff_LName] = useState("");
    const [Staff_Email, setStaff_Email] = useState("");
    const [Staff_Username, setStaff_Username] = useState("");
    const [Staff_Password, setStaff_Password] = useState("");
    const [Staff_Tel, setStaff_Tel] = useState("");

    const id = staffInfo.staffId;

    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    useEffect(() => {
        getStaffsById()
    }, [])

    useEffect(() => {
        axios.get(process.env.REACT_APP_API + "/staff", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("staffToken")}`,
            },
        })
            .then((response) => {
                if (response.data.Error) {
                    console.error("Staff Request Error:", response.data.Error);
                } else {
                    setStaffInfo(response.data);
                    setStaff_Username(response.data.staffUsername);
                }
            })
            .catch((error) => {
                console.error("Staff Request Failed:", error);
            });
    }, []);

    const getStaffsById = async () => {
        const response = await axios.get(process.env.REACT_APP_API + `/staff-list/${id}`);
        const staff = response.data;
        setStaff_FName(staff.Staff_FName);
        setStaff_LName(staff.Staff_LName);
        setStaff_Email(staff.Staff_Email);
        setStaff_Username(staff.Staff_Username);
        setStaff_Password(staff.Staff_Password);
        setStaff_Tel(staff.Staff_Tel);
    };

    const updateStaffInfo = async (e) => {
        e.preventDefault();

        if (Staff_Password !== confirmPassword) {
            alert("Password and Confirm Password do not match");
            return;
        } else {
            try {
                const response = await axios.patch(process.env.REACT_APP_API + `/staff-list/${id}`, {
                    Staff_FName,
                    Staff_LName,
                    Staff_Email,
                    Staff_Username: staffInfo.staffUsername,
                    Staff_Password,
                    Staff_Tel
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
        axios.get(process.env.REACT_APP_API + "/staff-logout").then((response) => {
            if (response.data.Error) {
                alert(response.data.Error);
            } else {
                localStorage.removeItem('staffToken');
                navigate("/chem/staff-login");
            }
        });
    };

    return (
        <div className='container-fluid vh-100'>
            <main className='form__container'>
                <form onSubmit={updateStaffInfo} className="form__card form__card--login">
                    <h3 className='form__header'>New Password</h3>

                    <div className="mb-3 form__inputBox ">
                        <label htmlFor="Username" className='profile__label'>Username</label>
                        <input type="text" className='profile__input' id="Staff_Username" placeholder="Enter Your Username" required readOnly
                            defaultValue={staffInfo.staffUsername}
                        />
                    </div>

                    <div className="mb-3 form__inputBox">
                        <label htmlFor="Password" className='profile__label'>New Password</label>
                        <input type="password" className='profile__input' id="Staff_Password" placeholder="Enter Staff Password" required
                            value={Staff_Password}
                            onChange={(e) => {
                                setStaff_Password(e.target.value);
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

export default StaffNewPassword
