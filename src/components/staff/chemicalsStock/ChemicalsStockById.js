import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function ChemicalsStockById() {
    const [chemicals, setChemicals] = useState([]);
    const { id } = useParams();

    const getChemicalsByChemId = async (chemId) => {
        try {
            const response = await axios.get(`https://special-problem.onrender.com/chemicals-list/chemid/${chemId}`);
            setChemicals(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getChemicalsByChemId(id);
    }, [id]);

    return (
        <div className='container-fluid'>
            <h2>Chemicals Stock Details</h2>
            <table className='table table-striped'>
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Chemicals Bottle Id</th>
                        <th>Chemicals Id</th>
                        <th>Package Size</th>
                        <th>Remaining Quantity</th>
                        <th>Counting Unit</th>
                        <th>Location</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {chemicals.map((chemical, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{chemical.Chem_Bottle_Id}</td>
                            <td>{chemical.Chem_Id}</td>
                            <td>{chemical.Package_Size}</td>
                            <td>{chemical.Remaining_Quantity}</td>
                            <td>{chemical.Counting_Unit}</td>
                            <td>{chemical.Location}</td>
                            <td>{chemical.Price}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default ChemicalsStockById;
