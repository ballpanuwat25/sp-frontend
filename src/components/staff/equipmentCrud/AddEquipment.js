import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AddEquipment() {
    const [equipment, setEquipment] = useState({
        Equipment_Id: "",
        Equipment_Category_Id: "",
        Equipment_Name: "",
        Quantity: "",
        Location: "",
        Price: ""
    });

    const navigate = useNavigate();

    const saveEquipment = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:3001/equipment-list", (equipment));
            navigate("/equipment-list");
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className='container-fluid'>
            <form onSubmit={saveEquipment}>
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

                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}

export default AddEquipment