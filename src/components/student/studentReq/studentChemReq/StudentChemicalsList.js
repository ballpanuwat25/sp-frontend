import axios from "axios";
import React, { useState, useEffect } from 'react'

import '../../../cssElement/Table.css'
import '../css/StudentRequest.css'

function StudentChemicalsList() {
    const [studentId, setStudentId] = useState("");
    const [chemicalsDetail, setChemicalsDetail] = useState([]);

    const [searchQuery, setSearchQuery] = useState("");
    const [filteredChemicals, setFilteredChemicals] = useState([]);

    const [chemicalsRequest, setChemicalsRequest] = useState({
        Student_Id: "",
        Chem_Id: "",
    });

    const [selectedChemicalsId, setSelectedChemicalsId] = useState({});

    const [chemicalsReq, setChemicalsReq] = useState([]);
    const [mostRequestedChemIds, setMostRequestedChemIds] = useState([]);

    const [mostRequestedEquipIds, setMostRequestedEquipIds] = useState([]);

    useEffect(() => {
        getChemicalsRequest();
        getEquipmentRequest();
    }, []);

    const getChemicalsRequest = async () => {
        try {
            const response = await axios.get("http://localhost:3001/chemicals-request-list");
            setChemicalsReq(response.data);
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
        }

        cartData.push({
            Student_Id: studentId,
            Chem_Id: chemId,
        });

        localStorage.setItem('chemicalsCart', JSON.stringify(cartData));
    };

    const getEquipmentRequest = async () => {
        try {
            const response = await axios.get("http://localhost:3001/equipment-request-list");
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
        } else {
            cartData.push({
                Student_Id: studentId,
                Equipment_Id: equipId,
            });
        }

        localStorage.setItem('equipmentCart', JSON.stringify(cartData));
    };

    useEffect(() => {
        axios.get("http://localhost:3001/student", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("studentToken")}`,
            },
        }).then((response) => {
            if (response.data.Error) {
                alert(response.data.Error);
            } else {
                const fetchedStudentId = response.data.studentId;
                setStudentId(fetchedStudentId);
                setChemicalsRequest({
                    ...chemicalsRequest,
                    Student_Id: fetchedStudentId,
                    Chem_Id: selectedChemicalsId,
                });
            }
        });
        getChemicalsDetail();
    }, []);

    useEffect(() => {
        setFilteredChemicals(chemicalsDetail);
    }, [chemicalsDetail]);

    const getChemicalsDetail = async () => {
        const response = await axios.get("http://localhost:3001/chemicalsDetail-list");
        setChemicalsDetail(response.data);
    }

    const addToCart = (Chem_Id) => {
        // Get the existing cart data from localStorage (if any)
        const cartData = JSON.parse(localStorage.getItem('chemicalsCart')) || [];

        // Check if the selected chemicals are already in the cart
        const existingChemical = cartData.find(item => item.Student_Id === studentId && item.Chem_Id === Chem_Id);

        if (existingChemical) {
            alert('This chemical is already in your cart');
        } else {
            cartData.push({
                Student_Id: studentId,
                Chem_Id,
            });
        }
        setSelectedChemicalsId({ Chem_Id: Chem_Id });
        localStorage.setItem('chemicalsCart', JSON.stringify(cartData));
    };

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        // Filter the chemicalsDetail based on the search query
        const filteredChemicals = chemicalsDetail.filter((chemical) =>
            chemical.Chem_Name.toLowerCase().includes(query.toLowerCase())
        );

        // Set the filtered chemicals as the new data to be displayed
        setFilteredChemicals(filteredChemicals);
    };

    return (
        <div className='container-fluid'>
            <div className='component__header'>
                <input
                    className="form-control"
                    type="search"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={handleSearch}
                />

                <div className='component__header--group'>
                    <div>User pic</div>
                    <div>User email</div>
                </div>
            </div>
            <div className="table-responsive">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th scope="col">No</th>
                            <th scope="col">Chemicals Name</th>
                            <th scope="col">Chemicals CAS</th>
                            <th scope="col">Chemicals UN</th>
                            <th scope="col">Chemicals Type</th>
                            <th scope="col">Chemicals Grade</th>
                            <th scope="col">Chemicals State</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredChemicals.map((chemicalsDetail, index) => {
                            // Filter the chemicalsReq list to find unique Chem_Id types
                            const uniqueChemIdTypes = [...new Set(chemicalsReq.map(request => request.Chem_Id))];

                            // Check if the number of unique Chem_Id types is less than 3
                            const isOffCanvasEnabled = uniqueChemIdTypes.length >= 3;

                            return (
                                <tr key={index} className="active-row">
                                    <td> {index + 1} </td>
                                    <td> {chemicalsDetail.Chem_Name} </td>
                                    <td> {chemicalsDetail.Chem_CAS} </td>
                                    <td> {chemicalsDetail.Chem_UN} </td>
                                    <td> {chemicalsDetail.Chem_Type} </td>
                                    <td> {chemicalsDetail.Chem_Grade} </td>
                                    <td> {chemicalsDetail.Chem_State} </td>
                                    <td>
                                        <div className="d-grid gap-2 d-sm-flex">
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => addToCart(chemicalsDetail.Chem_Id)}
                                                data-bs-toggle={isOffCanvasEnabled ? "offcanvas" : ""}
                                                data-bs-target={isOffCanvasEnabled ? "#offcanvasWithBackdrop1" : ""}
                                                aria-controls="offcanvasWithBackdrop"
                                            >
                                                add to cart
                                            </button>

                                            {isOffCanvasEnabled && (
                                                <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasWithBackdrop1" aria-labelledby="offcanvasWithBackdropLabel">
                                                    <div className="offcanvas-header">
                                                        <h3 className="offcanvas-title" id="offcanvasWithBackdropLabel">{selectedChemicalsId.Chem_Id} is added to cart</h3>
                                                        <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                                                    </div> <hr />
                                                    <div className="offcanvas-body">
                                                        {selectedChemicalsId && (
                                                            <div>
                                                                <h5> Chemicals Suggestions </h5>
                                                                <ul>
                                                                    {mostRequestedChemIds.map((chemId, index) => (
                                                                        selectedChemicalsId.Chem_Id !== chemId && (
                                                                            <li key={index}>
                                                                                {chemId}
                                                                                <button
                                                                                    className="btn btn-primary ms-2 mb-2"
                                                                                    onClick={() => addChemToCartFromOffcanvas(chemId)}
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
                                                        <h5> Equipment Suggestions </h5>
                                                        <ul>
                                                            {mostRequestedEquipIds.map((equipId, index) => (
                                                                <li key={index}>
                                                                    {equipId}
                                                                    <button
                                                                        className="btn btn-primary ms-2 mb-2"
                                                                        onClick={() => addEquipToCartFromOffcanvas(equipId)}
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
        </div>
    )
}

export default StudentChemicalsList