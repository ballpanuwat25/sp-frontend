import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditEquipmentCategory() {
    const [Equipment_Category_Id, setEquipment_Category_Id] = useState("");
    const [Equipment_Category_Name, setEquipment_Category_Name] = useState("");
    
    const { id } = useParams();

    const navigate = useNavigate();

    useEffect(() => {
        getEquipmentCategoryById()
        // eslint-disable-next-line
    }, [])

    const getEquipmentCategoryById = async () => {
        const response = await axios.get(`http://localhost:3001/equipmentCategory-list/${id}`);
        const equipment = response.data;
        setEquipment_Category_Id(equipment.Equipment_Category_Id);
        setEquipment_Category_Name(equipment.Equipment_Category_Name);
    }

    const updateEquipmentCategory = async (e) => {
        e.preventDefault();
        const response = await axios.patch(`http://localhost:3001/equipmentCategory-list/${id}`, {
            Equipment_Category_Id,
            Equipment_Category_Name,
        });
        if (response.data.Error) {
            alert(response.data.Error);
        } else {
            navigate("/equipmentCategory-list");
        }
    }

    return (
        <div className="container-fluid">
            <form onSubmit={updateEquipmentCategory}>
                <div className="mb-3">
                    <label type="text" htmlFor="Equipment_Category_Id" className="form-label">Equipment Category Id</label>
                    <input type="text" className="form-control" id="Equipment_Category_Id" placeholder="Enter Equipment Category Id" required
                        onChange={(e) => {
                            setEquipment_Category_Id(e.target.value);
                        }}
                        value={Equipment_Category_Id}
                    />
                </div>

                <div className="mb-3">
                    <label type="text" htmlFor="Equipment_Category_Name" className="form-label">Equipment Category Name</label>
                    <input type="text" className="form-control" id="Equipment_Category_Name" placeholder="Enter Equipment Category Name" required
                        onChange={(e) => {
                            setEquipment_Category_Name(e.target.value);
                        }}
                        value={Equipment_Category_Name}
                    />
                </div>
                
                <button type="submit" className="btn btn-primary">Update</button>
            </form>
        </div>
    )
}

export default EditEquipmentCategory