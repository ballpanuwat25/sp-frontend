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
        Requested_Quantity: 1,
    });

    const [selectedEquipmentId, setSelectedEquipmentId] = useState({});

    const [equipmentReq, setEquipmentReq] = useState([]);
    const [mostRequestedEquipIds, setMostRequestedEquipIds] = useState([]);

    const [mostRequestedChemIds, setMostRequestedChemIds] = useState([]);

    useEffect(() => {
        getEquipmentRequest();
        getChemicalsRequest();
    }, []);

    const getEquipmentRequest = async () => {
        try {
            const response = await axios.get("http://localhost:3001/equipment-request-list");
            setEquipmentReq(response.data);
            findMostRequestedEquipIds(response.data, 3);
        } catch (error) {
            console.error("Error fetching equipment request:", error);
        }
    };

    const findMostRequestedEquipIds = (data, n) => {
        const equipIdCounts = {};

        data.forEach(request => {
            const equipId = request.Equipment_Id;
            equipIdCounts[equipId] = (equipIdCounts[equipId] || 0) + 1;
        });

        const sortedEquipIds = Object.keys(equipIdCounts).sort((a, b) => equipIdCounts[b] - equipIdCounts[a]);

        const mostRequestedIds = sortedEquipIds.slice(0, n);

        setMostRequestedEquipIds(mostRequestedIds);
    };

    const addEquipToCartFromOffcanvas = (equipId) => {
        // Get the existing cart data from localStorage (if any)
        const cartData = JSON.parse(localStorage.getItem('equipmentCart')) || [];

        // Check if the selected equipment are already in the cart
        const existingEquipment = cartData.find(item => item.Student_Id === studentId && item.Equipment_Id === equipId);

        if (existingEquipment) {
            alert('This equipment is already in your cart');
            return;
        } 
        
        cartData.push({
            Student_Id: studentId,
            Equipment_Id: equipId,
        });

        localStorage.setItem('equipmentCart', JSON.stringify(cartData));
    };

    const getChemicalsRequest = async () => {
        try {
            const response = await axios.get("http://localhost:3001/chemicals-request-list");
            findMostRequestedChemIds(response.data, 3);
        } catch (error) {
            console.error("Error fetching chemicals request:", error);
        }
    };

    const findMostRequestedChemIds = (data, n) => {
        const chemIdCounts = {};

        data.forEach(request => {
            const chemId = request.Chem_Id;
            chemIdCounts[chemId] = (chemIdCounts[chemId] || 0) + 1;
        });

        const sortedChemIds = Object.keys(chemIdCounts).sort((a, b) => chemIdCounts[b] - chemIdCounts[a]);

        const mostRequestedIds = sortedChemIds.slice(0, n);

        setMostRequestedChemIds(mostRequestedIds);
    };

    const addChemToCartFromOffcanvas = (chemId) => {
        // Get the existing cart data from localStorage (if any)
        const cartData = JSON.parse(localStorage.getItem('chemicalsCart')) || [];

        // Check if the selected chemicals are already in the cart
        const existingChemical = cartData.find(item => item.Student_Id === studentId && item.Chem_Id === chemId);

        if (existingChemical) {
            alert('This chemical is already in your cart');
            return;
        } else {
            cartData.push({
                Student_Id: studentId,
                Chem_Id: chemId,
            });

            localStorage.setItem('chemicalsCart', JSON.stringify(cartData));
        };
    };

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
        setSelectedEquipmentId({ Equipment_Id: Equipment_Id });
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
                        <th scope="col">Equipment Category Id</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredEquipment.map((equipment, index) => {
                        const uniqueEquipIdTypes = [...new Set(equipmentReq.map(request => request.Equipment_Id))];

                        const isOffCanvasEnabled = uniqueEquipIdTypes.length >= 2;

                        return (
                            <tr key={index}>
                                <td> {index + 1} </td>
                                <td> {equipment.Equipment_Name} </td>
                                <td> {equipment.Equipment_Category_Id} </td>
                                <td>
                                    <div className="d-grid gap-2 d-sm-flex">
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => addToCart(equipment.Equipment_Id)}
                                            data-bs-toggle={isOffCanvasEnabled ? "offcanvas" : ""}
                                            data-bs-target={isOffCanvasEnabled ? "#offcanvasWithBackdrop2" : ""}
                                            aria-controls="offcanvasWithBackdrop"
                                        >
                                            add to cart
                                        </button>

                                        {isOffCanvasEnabled && (
                                            <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasWithBackdrop2" aria-labelledby="offcanvasWithBackdropLabel">
                                                <div className="offcanvas-header">
                                                    <h3 className="offcanvas-title" id="offcanvasWithBackdropLabel">{selectedEquipmentId.Equipment_Id} is added to cart</h3>
                                                    <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                                                </div> <hr />
                                                <div className="offcanvas-body">
                                                    {selectedEquipmentId && (
                                                        <div>
                                                            <h5> Equipment Suggestions </h5>
                                                            <ul>
                                                                {mostRequestedEquipIds.map((equipId, index) => (
                                                                    selectedEquipmentId.Equipment_Id !== equipId && (
                                                                        <li key={index}>
                                                                            {equipId}
                                                                            <button
                                                                                className="btn btn-primary ms-2 mb-2"
                                                                                onClick={() => addEquipToCartFromOffcanvas(equipId)}
                                                                            >
                                                                                add to cart
                                                                            </button>
                                                                        </li>
                                                                    )
                                                                ))}
                                                            </ul>

                                                        </div>
                                                    )}
                                                    <hr />
                                                    <h5> Chemicals Suggestions </h5>
                                                    <ul>
                                                        {mostRequestedChemIds.map((chemId, index) => (
                                                            <li key={index}>
                                                                {chemId}
                                                                <button
                                                                    className="btn btn-primary ms-2 mb-2"
                                                                    onClick={() => addChemToCartFromOffcanvas(chemId)}
                                                                >
                                                                    add to cart
                                                                </button>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default StudentEquipmentList