import axios from "axios";
import React, { useState, useEffect } from 'react'

function StudentEquipmentList() {
    const [studentId, setStudentId] = useState("");
    const [equipment, setEquipment] = useState([]);

    const [searchQuery, setSearchQuery] = useState("");
    const [filteredEquipment, setFilteredEquipment] = useState([]);

    const [equipmentRequest, setEquipmentRequest] = useState({
        Student_Id: "",
        Equipment_Id: "",
        Requested_Quantity: "",
    });

    const [selectedEquipmentId, setSelectedEquipmentId] = useState(null);

    useEffect(() => {
        axios.get("http://localhost:3001/student").then((response) => {
            if (response.data.Error) {
                alert(response.data.Error);
            } else {
                const fetchedStudentId = response.data.studentId;
                setStudentId(fetchedStudentId);
                setEquipmentRequest({
                    ...equipmentRequest,
                    Student_Id: fetchedStudentId,
                    Equipment_Id: selectedEquipmentId,
                });
            }
        });
        getEquipment();
    }, []);

    useEffect(() => {
        setFilteredEquipment(equipment);
    }, [equipment]);

    const getEquipment = async () => {
        const response = await axios.get("http://localhost:3001/equipment-list");
        setEquipment(response.data);
    }

    const addToCart = (Equipment_Id) => {
        // Get the existing cart data from localStorage (if any)
        const cartData = JSON.parse(localStorage.getItem('equipmentCart')) || [];

        // Check if the selected equipment are already in the cart
        const existingEquipment = cartData.find(item => item.Student_Id === studentId && item.Equipment_Id === Equipment_Id);

        if (existingEquipment) {
            // If the selected equipment are already in the cart, update the quantity (optional)
            existingEquipment.Requested_Quantity += equipmentRequest.Requested_Quantity;
        } else {
            // If the selected equipment are not in the cart, add them as a new item
            cartData.push({
                Student_Id: studentId,
                Equipment_Id,
                Requested_Quantity: equipmentRequest.Requested_Quantity,
            });
        }

        // Save the cart data to localStorage
        localStorage.setItem('equipmentCart', JSON.stringify(cartData));
    }
    
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        filterEquipment(e.target.value);
    }

    const filterEquipment = (searchQuery) => {
        const filterEquipment = equipment.filter((equipment) => {
            let equipmentName = equipment.Equipment_Name.toLowerCase();
            return equipmentName.includes(searchQuery.toLowerCase());
        });
        setFilteredEquipment(filterEquipment);
    }

    return (
        <div className="container-fluid">
            <div className='d-flex justify-content-between align-items-center'>
                <h2>Equipment List</h2>
                <form className="d-flex">
                    <input
                        className="form-control me-2"
                        type="search"
                        placeholder="Search"
                        aria-label="Search"
                        value={searchQuery}
                        onChange={handleSearch} // Use the handleSearch function on input change
                    />
                    <button className="btn btn-outline-success" type="submit">
                        Search
                    </button>
                </form>
            </div>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">No</th>
                        <th scope="col">Equipment Name</th>
                        <th scope="col">Equipment Category</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredEquipment.map((equipment, index) => (
                        <tr key={index}>
                            <td> {index + 1} </td>
                            <td> {equipment.Equipment_Name} </td>
                            <td> {equipment.Equipment_Category_Id} </td>
                            <td>
                                <div className="d-grid gap-2 d-sm-flex">
                                    <button className="btn btn-primary" onClick={() => addToCart(equipment.Equipment_Id)}>add to cart</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default StudentEquipmentList
