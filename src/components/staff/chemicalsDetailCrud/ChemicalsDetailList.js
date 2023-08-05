import axios from "axios";
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react'

function ChemicalsDetailList() {
    const [chemicalsDetail, setChemicalsDetail] = useState([]);

    useEffect(() => {
        getChemicalsDetail();
    }, []);

    const getChemicalsDetail = async () => {
        const response = await axios.get("http://localhost:3001/chemicalsDetail-list");
        setChemicalsDetail(response.data);
    }

    const deleteChemicalsDetail = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/chemicalsDetail-list/${id}`)
            getChemicalsDetail();
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="container-fluid">
            <div className='d-flex justify-content-between align-items-center'>
                <h2>Chemicals  Detail</h2>
                <Link to={`add-chemicalsDetail`} className="btn btn-success ms-2"> Add Chemicals Detail</Link>
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
                        <th scope="col">Chemicals MSDS</th>
                        <th scope="col">Chemicals GHS</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {chemicalsDetail.map((chemicalsDetail, index) => (
                        <tr key={index}>
                            <td> {index + 1} </td>
                            <td> {chemicalsDetail.Chem_Id} </td>
                            <td> {chemicalsDetail.Chem_Name} </td>
                            <td> {chemicalsDetail.Chem_CAS} </td>
                            <td> {chemicalsDetail.Chem_UN} </td>
                            <td> {chemicalsDetail.Chem_Type} </td>
                            <td> {chemicalsDetail.Chem_Grade} </td>
                            <td> {chemicalsDetail.Chem_State} </td>
                            <td> {chemicalsDetail.Chem_MSDS} </td>
                            <td> {chemicalsDetail.Chem_GHS} </td>
                            <td>
                                <div className="d-grid gap-2 d-sm-flex">
                                    <Link to={`edit-chemicalsDetail/${chemicalsDetail.Chem_Id}`} className="btn btn-primary">Edit</Link>
                                    <button onClick={() => deleteChemicalsDetail(chemicalsDetail.Chem_Id)} className="btn btn-danger">Delete</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default ChemicalsDetailList