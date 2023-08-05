import axios from "axios";
import React, { useState, useEffect } from 'react'

function StudentChemicalsList() {
    const [studentId, setStudentId] = useState("");
    const [chemicalsDetail, setChemicalsDetail] = useState([]);

    const [searchQuery, setSearchQuery] = useState("");
    const [filteredChemicals, setFilteredChemicals] = useState([]);

    const [chemicalsRequest, setChemicalsRequest] = useState({
        Student_Id: "",
        Chem_Id: "",
        Requested_Quantity: "",
        Counting_Unit: "",
    });

    const [selectedChemicalsId, setSelectedChemicalsId] = useState(null);

    useEffect(() => {
        axios.get("http://localhost:3001/student").then((response) => {
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
        const cartData = JSON.parse(localStorage.getItem('cart')) || [];

        // Check if the selected chemicals are already in the cart
        const existingChemical = cartData.find(item => item.Student_Id === studentId && item.Chem_Id === Chem_Id);

        if (existingChemical) {
            // If the selected chemicals are already in the cart, update the quantity (optional)
            existingChemical.Requested_Quantity += chemicalsRequest.Requested_Quantity;
        } else {
            // If the selected chemicals are not in the cart, add them as a new item
            cartData.push({
                Student_Id: studentId,
                Chem_Id,
                Requested_Quantity: chemicalsRequest.Requested_Quantity,
                Counting_Unit: chemicalsRequest.Counting_Unit,
            });
        }

        localStorage.setItem('cart', JSON.stringify(cartData));
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
        <div className="container-fluid">
            <div className='d-flex justify-content-between align-items-center'>
                <h2>Chemicals List</h2>
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
                        <th scope="col">Chemicals Id</th>
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
                    {filteredChemicals.map((chemicalsDetail, index) => (
                        <tr key={index}>
                            <td> {index + 1} </td>
                            <td> {chemicalsDetail.Chem_Id} </td>
                            <td> {chemicalsDetail.Chem_Name} </td>
                            <td> {chemicalsDetail.Chem_CAS} </td>
                            <td> {chemicalsDetail.Chem_UN} </td>
                            <td> {chemicalsDetail.Chem_Type} </td>
                            <td> {chemicalsDetail.Chem_Grade} </td>
                            <td> {chemicalsDetail.Chem_State} </td>
                            <td>
                                <div className="d-grid gap-2 d-sm-flex">
                                    <button className="btn btn-primary" onClick={() => addToCart(chemicalsDetail.Chem_Id)}>add to cart</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default StudentChemicalsList