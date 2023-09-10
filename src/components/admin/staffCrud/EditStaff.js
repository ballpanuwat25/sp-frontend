import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditStaff() {
    const [Staff_FName, setStaff_FName] = useState("");
    const [Staff_LName, setStaff_LName] = useState("");
    const [Staff_Username, setStaff_Username] = useState("");
    const [Staff_Password, setStaff_Password] = useState("");
    const [Staff_Tel, setStaff_Tel] = useState("");

    const { id } = useParams();

    const navigate = useNavigate();

    useEffect(() => {
        getStaffsById()
        // eslint-disable-next-line
    }, [])

    const getStaffsById = async () => {
        const response = await axios.get(`https://backup-test.onrender.com/staff-list/${id}`);
        const staff = response.data;
        setStaff_FName(staff.Staff_FName);
        setStaff_LName(staff.Staff_LName);
        setStaff_Username(staff.Staff_Username);
        setStaff_Password(staff.Staff_Password);
        setStaff_Tel(staff.Staff_Tel);
    };

    const updateStaff = async (e) => {
        e.preventDefault();
        const response = await axios.patch(`https://backup-test.onrender.com/staff-list/${id}`, {
            Staff_FName,
            Staff_LName,
            Staff_Username,
            Staff_Password,
            Staff_Tel
        });
        if (response.data.Error) {
            alert(response.data.Error);
        } else {
            navigate("/staff-list");
        }
    };

    return (
        <div className="container-fluid">
            <form onSubmit={updateStaff}>
                <div className="mb-3">
                    <label htmlFor="Staff_FName" className="form-label">Staff First Name</label>
                    <input type="text" className="form-control" id="Staff_FName" placeholder="Enter Staff First Name" required
                        value={Staff_FName}
                        onChange={(e) => {
                            setStaff_FName(e.target.value);
                        }}
                    />

                    <label htmlFor="Staff_LName" className="form-label">Staff Last Name</label>
                    <input type="text" className="form-control" id="Staff_LName" placeholder="Enter Staff Last Name" required
                        value={Staff_LName}
                        onChange={(e) => {
                            setStaff_LName(e.target.value);
                        }}
                    />

                    <label htmlFor="Staff_Username" className="form-label">Staff Username</label>
                    <input type="text" className="form-control" id="Staff_Username" placeholder="Enter Staff Username" required
                        value={Staff_Username}
                        onChange={(e) => {
                            setStaff_Username(e.target.value);
                        }}
                    />

                    <label htmlFor="Staff_Password" className="form-label">Staff Password</label>
                    <input type="password" className="form-control" id="Staff_Password" placeholder="Enter Staff Password" required
                        value={Staff_Password}
                        onChange={(e) => {
                            setStaff_Password(e.target.value);
                        }}
                    />

                    <label htmlFor="Staff_Tel" className="form-label">Staff Tel</label>
                    <input type="text" className="form-control" id="Staff_Tel" placeholder="Enter Staff Tel" required
                        value={Staff_Tel}
                        onChange={(e) => {
                            setStaff_Tel(e.target.value);
                        }}
                    />

                    <button type="submit" className="btn btn-primary mt-3">Update</button>
                </div>
            </form>
        </div>
    )
}

export default EditStaff
