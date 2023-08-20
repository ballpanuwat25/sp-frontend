import axios from "axios";
import React, { useState, useEffect } from 'react'

function ChemicalsBundleList() {
    const [teacherId, setTeacherId] = useState("");
    const [chemicalsDetail, setChemicalsDetail] = useState([]);

    const [searchQuery, setSearchQuery] = useState("");
    const [filteredChemicals, setFilteredChemicals] = useState([]);

    const [bundle, setBundle] = useState({
        Teacher_Id: "",
        Chem_Id: "",
    });

    const [selectedChemicalsId, setSelectedChemicalsId] = useState(null);

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
        const cartData = JSON.parse(localStorage.getItem('bundleCart')) || [];

        const existingChemical = cartData.find(item => item.Teacher_Id === teacherId && item.Chem_Id === Chem_Id);

        if (existingChemical) {
            alert('This chemical is already in your cart');
        } else {
            cartData.push({
                Teacher_Id: teacherId,
                Chem_Id,
            });
        }

        localStorage.setItem('bundleCart', JSON.stringify(cartData));
    };

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        const filteredChemicals = chemicalsDetail.filter((chemical) => {
            return chemical.Chem_Name.toLowerCase().includes(query.toLowerCase());
        });

        setFilteredChemicals(filteredChemicals);
    
    };

    return (
        <div className="container-fluid">
            <div className='d-flex justify-content-between align-items-center'>
                <h2>Teacher Chemicals List</h2>
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

export default ChemicalsBundleList
