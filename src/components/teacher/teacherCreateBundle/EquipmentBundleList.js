import axios from "axios";
import React, { useState, useEffect } from 'react'

function EquipmentBundleList() {
    const [teacherId, setTeacherId] = useState("");
    const [equipment, setEquipment] = useState([]);

    const [searchQuery, setSearchQuery] = useState("");
    const [filteredEquipment, setFilteredEquipment] = useState([]);

    const [bundle, setBundle] = useState({
        Teacher_Id: "",
        Equipment_Id: "",
    });

    const [selectedEquipmentId, setSelectedEquipmentId] = useState(null);

    useEffect(() => {
        axios.get("http://localhost:3001/teacher").then((response) => {
            if (response.data.Error) {
                alert(response.data.Error);
            } else {
                const fetchedTeacherId = response.data.teacherId;
                setTeacherId(fetchedTeacherId);
                setBundle({
                    ...bundle,
                    Teacher_Id: fetchedTeacherId,
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
        const cartData = JSON.parse(localStorage.getItem('bundleCart')) || [];

        const existingEquipment = cartData.find(item => item.Teacher_Id === teacherId && item.Equipment_Id === Equipment_Id);

        if (existingEquipment) {
            alert('This equipment is already in your cart');
        } else {
            cartData.push({
                Teacher_Id: teacherId,
                Equipment_Id,
            });
        }

        localStorage.setItem('bundleCart', JSON.stringify(cartData));
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        filterEquipment(e.target.value);
    };

    const filterEquipment = (searchQuery) => {
        const filteredEquipment = equipment.filter((equipment) => {
            return equipment.Equipment_Name.toLowerCase().includes(searchQuery.toLowerCase());
        });
        setFilteredEquipment(filteredEquipment);
    }

    return (
        <div className="container-fluid">
            <div className='d-flex justify-content-between align-items-center'>
                <h2>Teacher Equipment List</h2>
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
                        <th scope="col">Equipment Category Id</th>
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

export default EquipmentBundleList
