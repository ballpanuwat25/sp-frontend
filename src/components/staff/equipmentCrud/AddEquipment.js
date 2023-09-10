import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AddEquipment() {
    const [staffId, setStaffId] = useState("");
    const [logActivity, setLogActivity] = useState({
        LogActivity_Id: "",
        LogActivity_Name: "",
        Equipment_Id: "",
        Staff_Id: "",
    });
    
    const [equipment, setEquipment] = useState({
        Equipment_Id: "",
        Equipment_Category_Id: "",
        Equipment_Name: "",
        Quantity: "",
        Location: "",
        Price: "",
        Fixed_Cost: ""
    });

    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    useEffect(() => {
        axios.get("https://backup-test.onrender.com/staff", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("staffToken")}`,
            },
        }).then((response) => {
            if (response.data.Error) {
                alert(response.data.Error);
            } else {
                setStaffId(response.data.staffId);
                setLogActivity({ ...logActivity, Staff_Id: response.data.staffId });
            }
        });
    }, [logActivity]);

    const saveEquipment = async (e) => {
        e.preventDefault();
        try {
            const { Equipment_Id } = equipment;

            const equipmentIdExists = await axios.get(`https://backup-test.onrender.com/equipment-list/${Equipment_Id}`);
            if (equipmentIdExists.data) {
                alert("Equipment Id already exists. Please enter a different Equipment Id.");
                return;
            }

            const updatedLogActivity = { ...logActivity, LogActivity_Name: "Add Equipment", Equipment_Id: Equipment_Id };
            await axios.post("https://backup-test.onrender.com/log-activity", updatedLogActivity);
            await axios.post("https://backup-test.onrender.com/equipment-list", (equipment));

            alert("Equipment added successfully");
            navigate("/equipment-list");
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className='container-fluid'>
            <form onSubmit={saveEquipment}>

                <div className='mb-3'>
                    <label htmlFor='Staff_Id' className='form-label'>Staff_Id</label>
                    <input type='text'
                        className='form-control'
                        placeholder='Enter Staff Id'
                        defaultValue={staffId}
                        readOnly
                    />
                </div>
                
                <div className="mb-3">
                    <label htmlFor="Equipment_Id" className="form-label">Equipment Id</label>
                    <input type="text" className="form-control" id="Equipment_Id" placeholder="Enter Equipment Id" required
                        onChange={(e) => {
                            setEquipment({ ...equipment, Equipment_Id: e.target.value });
                        }}
                    />
                </div>
                
                <div className="mb-3">
                    <label htmlFor="Equipment_Category_Id" className="form-label">Equipment Category Id</label>
                    <input type="text" className="form-control" id="Equipment_Category_Id" placeholder="Enter Equipment Category Id" required
                        onChange={(e) => {
                            setEquipment({ ...equipment, Equipment_Category_Id: e.target.value });
                        }}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="Equipment_Name" className="form-label">Equipment Name</label>
                    <input type="text" className="form-control" id="Equipment_Name" placeholder="Enter Equipment Name" required
                        onChange={(e) => {
                            setEquipment({ ...equipment, Equipment_Name: e.target.value });
                        }}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="Quantity" className="form-label">Quantity</label>
                    <input type="number" className="form-control" id="Quantity" placeholder="Enter Quantity" required
                        onChange={(e) => {
                            setEquipment({ ...equipment, Quantity: e.target.value });
                        }}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="Location" className="form-label">Location</label>
                    <input type="text" className="form-control" id="Location" placeholder="Enter Location" required
                        onChange={(e) => {
                            setEquipment({ ...equipment, Location: e.target.value });
                        }}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="Price" className="form-label">Price</label>
                    <input type="number" className="form-control" id="Price" placeholder="Enter Price" required
                        onChange={(e) => {
                            setEquipment({ ...equipment, Price: e.target.value });
                        }}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="Fixed_Cost" className="form-label">Fixed Cost</label>
                    <input type="number" className="form-control" id="Fixed_Cost" placeholder="Enter Fixed Cost"
                        onChange={(e) => {
                            setEquipment({ ...equipment, Fixed_Cost: e.target.value });
                        }}
                    />
                </div>

                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}

export default AddEquipment