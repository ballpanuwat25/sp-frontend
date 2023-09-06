import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AddEquipmentCategory() {
    const [equipmentCategory, setEquipmentCategory] = useState({
        Equipment_Category_Id: "",
        Equipment_Category_Name: "",
    });

    const navigate = useNavigate();

    const saveEquipmentCategory = async (e) => {
        e.preventDefault();
        try {
            await axios.post("https://special-problem.onrender.com/equipmentCategory-list", (equipmentCategory));
            navigate("/equipmentCategory-list");
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className='container-fluid'>
            <form onSubmit={saveEquipmentCategory}>
                <div className="mb-3">
                    <label htmlFor="Equipment_Category_Id" className="form-label">Equipment Category Id</label>
                    <input type="text" className="form-control" id="Equipment_Category_Id" placeholder="Enter Equipment Category Id" required
                        onChange={(e) => {
                            setEquipmentCategory({ ...equipmentCategory, Equipment_Category_Id: e.target.value });
                        }}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="Equipment_Category_Name" className="form-label">Equipment Category Name</label>
                    <input type="text" className="form-control" id="Equipment_Category_Name" placeholder="Enter Equipment Category Name" required
                        onChange={(e) => {
                            setEquipmentCategory({ ...equipmentCategory, Equipment_Category_Name: e.target.value });
                        }}
                    />
                </div>

                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}

export default AddEquipmentCategory