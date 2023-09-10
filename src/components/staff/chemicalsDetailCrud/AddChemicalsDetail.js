import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AddChemicalsDetail() {
    const [chemicalsDetail, setChemicalsDetail] = useState({
        Chem_Id: "",
        Chem_Name: "",
        Chem_CAS: "",
        Chem_UN: "",
        Chem_Type: "",
        Chem_Grade: "",
        Chem_State: "",
        Chem_MSDS: "",
        Chem_GHS: "",
    });

    const navigate = useNavigate();

    const saveChemicalsDetail = async (e) => {
        e.preventDefault();
        try {
            const { Chem_Id } = chemicalsDetail;
    
            // Check if Chem_Id already exists
            const chemIdExists = await axios.get(`https://backup-test.onrender.com/chemicalsDetail-list/${Chem_Id}`);
            if (chemIdExists.data) {
                alert("Chem_Id already exists. Please enter a different Chem_Id.");
                return;
            }

            await axios.post("https://backup-test.onrender.com/chemicalsDetail-list", chemicalsDetail);
            
            alert("Chemicals added successfully");
            navigate("/chemicalsDetail-list");
        } catch (err) {
            console.log(err);
        }
    };    

    return (
        <div className='container-fluid'>
            <form onSubmit={saveChemicalsDetail}>

                <div className="mb-3">
                    <label htmlFor="Chem_Id" className="form-label">Chemicals Id</label>
                    <input type="text" className="form-control" id="Chem_Id" placeholder="Enter Chemicals Id" required
                        onChange={(e) => {
                            setChemicalsDetail({ ...chemicalsDetail, Chem_Id: e.target.value });
                        }}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="Chem_Name" className="form-label">Chemicals Name</label>
                    <input type="text" className="form-control" id="Chem_Name" placeholder="Enter Chemicals Name" required
                        onChange={(e) => {
                            setChemicalsDetail({ ...chemicalsDetail, Chem_Name: e.target.value });
                        }}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="Chem_CAS" className="form-label">Chemicals CAS</label>
                    <input type="text" className="form-control" id="Chem_CAS" placeholder="Enter Chemicals CAS" required
                        onChange={(e) => {
                            setChemicalsDetail({ ...chemicalsDetail, Chem_CAS: e.target.value });
                        }}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="Chem_UN" className="form-label">Chemicals UN</label>
                    <input type="text" className="form-control" id="Chem_UN" placeholder="Enter Chemicals UN" required
                        onChange={(e) => {
                            setChemicalsDetail({ ...chemicalsDetail, Chem_UN: e.target.value });
                        }}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="Chem_Type" className="form-label">Chemicals Type</label>
                    <input type="text" className="form-control" id="Chem_Type" placeholder="Enter Chemicals Type" required
                        onChange={(e) => {
                            setChemicalsDetail({ ...chemicalsDetail, Chem_Type: e.target.value });
                        }}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="Chem_Grade" className="form-label">Chemicals Grade</label>
                    <input type="text" className="form-control" id="Chem_Grade" placeholder="Enter Chemicals Grade" required
                        onChange={(e) => {
                            setChemicalsDetail({ ...chemicalsDetail, Chem_Grade: e.target.value });
                        }}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="Chem_State" className="form-label">Chemicals State</label>
                    <input type="text" className="form-control" id="Chem_State" placeholder="Enter Chemicals State" required
                        onChange={(e) => {
                            setChemicalsDetail({ ...chemicalsDetail, Chem_State: e.target.value });
                        }}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="Chem_MSDS" className="form-label">Chemicals MSDS</label>
                    <input type="text" className="form-control" id="Chem_MSDS" placeholder="Enter Chemicals MSDS" required
                        onChange={(e) => {
                            setChemicalsDetail({ ...chemicalsDetail, Chem_MSDS: e.target.value });
                        }}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="Chem_GHS" className="form-label">Chemicals GHs</label>
                    <input type="text" className="form-control" id="Chem_GHS" placeholder="Enter Chemicals GHS" required
                        onChange={(e) => {
                            setChemicalsDetail({ ...chemicalsDetail, Chem_GHS: e.target.value });
                        }}
                    />
                </div>

                <button type="submit" className="btn btn-primary">Submit</button>

            </form>
        </div>
    );
}

export default AddChemicalsDetail;