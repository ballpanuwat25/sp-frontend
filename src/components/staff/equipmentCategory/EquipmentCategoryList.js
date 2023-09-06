import axios from "axios";
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react'

function EquipmentListCategory() {
    const [equipmentCategory, setEquipmentCategory] = useState([]);

    useEffect(() => {
        getEquipmentCategory();
    }, []);

    const getEquipmentCategory = async () => {
        const response = await axios.get("https://special-problem.onrender.com/equipmentCategory-list");
        setEquipmentCategory(response.data);
    }

    const deleteEquipmentCategory = async (id) => {
        try {
            await axios.delete(`https://special-problem.onrender.com/equipmentCategory-list/${id}`)
            getEquipmentCategory();
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="container-fluid">
            <div className='d-flex justify-content-between align-items-center'>
                <h2>Equipment List</h2>
                <Link to={`add-equipmentCategory`} className="btn btn-success ms-2"> Add Equipment Category</Link>
            </div>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">No</th>
                        <th scope="col">Equipment Category Id</th>
                        <th scope="col">Equipment Category Name</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {equipmentCategory.map((equipmentCategory, index) => (
                        <tr key={index}>
                            <td> {index + 1} </td>
                            <td> {equipmentCategory.Equipment_Category_Id} </td>
                            <td> {equipmentCategory.Equipment_Category_Name} </td>
                            <td>
                                <div className="d-grid gap-2 d-sm-flex">
                                    <Link to={`edit-equipmentCategory/${equipmentCategory.Equipment_Category_Id}`} className="btn btn-success me-2">Edit</Link>
                                    <button className="btn btn-danger" type="button" onClick={() => deleteEquipmentCategory(equipmentCategory.Equipment_Category_Id)}>Delete</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default EquipmentListCategory