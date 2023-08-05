import axios from "axios";
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react'

function EquipmentList() {
    const [equipment, setEquipment] = useState([]);

    useEffect(() => {
        getEquipment();
    }, []);

    const getEquipment = async () => {
        const response = await axios.get("http://localhost:3001/equipment-list");
        setEquipment(response.data);
    }

    const deleteEquipment = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/equipment-list/${id}`)
            getEquipment();
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="container-fluid">
            <div className='d-flex justify-content-between align-items-center'>
                <h2>Equipment List</h2>
                <div className="btn-group">
                    <Link to={`add-equipment`} className="btn btn-success"> Add Equipment</Link>
                    <Link to="/equipmentCategory-list" className="btn btn-outline-success">Equipment Category</Link>
                </div>
            </div>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">No</th>
                        <th scope="col">Equipment Id</th>
                        <th scope="col">Equipment Category Id</th>
                        <th scope="col">Equipment Name</th>
                        <th scope="col">Quantity</th>
                        <th scope="col">Location</th>
                        <th scope="col">Price</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {equipment.map((equipment, index) => (
                        <tr key={index}>
                            <td> {index + 1} </td>
                            <td> {equipment.Equipment_Id} </td>
                            <td> {equipment.Equipment_Category_Id} </td>
                            <td> {equipment.Equipment_Name} </td>
                            <td> {equipment.Quantity} </td>
                            <td> {equipment.Location} </td>
                            <td> {equipment.Price} </td>
                            <td>
                                <div className="d-grid gap-2 d-sm-flex">
                                    <Link to={`edit-equipment/${equipment.Equipment_Id}`} className="btn btn-success me-2">Edit</Link>
                                    <button className="btn btn-danger" type="button" onClick={() => deleteEquipment(equipment.Equipment_Id)}>Delete</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default EquipmentList