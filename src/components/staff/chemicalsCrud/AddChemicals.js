import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import BarcodeScanner from '../barcode/BarcodeScanner';

function AddChemicals() {
    const [chemicals, setChemicals] = useState({
        Chem_Bottle_Id: "",
        Chem_Id: "",
        Package_Size: "",
        Remaining_Quantity: "",
        Counting_Unit: "",
        Location: "",
        Price: "",
    });

    const [scannedText, setScannedText] = useState("");
    const navigate = useNavigate();

    const saveChemicals = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:3001/chemicals-list", (chemicals));
            navigate("/chemicals-list");
        } catch (err) {
            console.log(err);
        }
    };

    const handleScannedTextChange = (scannedText) => {
        setScannedText(scannedText);
    };

    const handleApplyButtonClick = () => {
        setChemicals({ ...chemicals, Chem_Bottle_Id: scannedText });
    };

    return (
        <div className='container-fluid'>
            <form onSubmit={saveChemicals}>
                <div className="mb-3">
                    <label htmlFor="Chem_Bottle_Id" className="form-label">Chemicals Bottle Id</label>
                    <div className="input-group">
                        <BarcodeScanner onScannedTextChange={handleScannedTextChange} />
                        <input type="text" className="form-control" id="Chem_Bottle_Id" placeholder="Enter Chemicals Bottle Id" required value={chemicals.Chem_Bottle_Id}
                            onChange={(e) => {
                                setChemicals({ ...chemicals, Chem_Bottle_Id: e.target.value });
                            }}
                        />
                    </div>
                </div>

                <div className="mb-3">
                    <label htmlFor="Chem_Id" className="form-label">Chemicals Id</label>
                    <input type="text" className="form-control" id="Chem_Id" placeholder="Enter Chemicals Id" required
                        onChange={(e) => {
                            setChemicals({ ...chemicals, Chem_Id: e.target.value });
                        }}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="Package_Size" className="form-label">Package Size</label>
                    <input type="number" className="form-control" id="Package_Size" placeholder="Enter Package Size" required
                        onChange={(e) => {
                            setChemicals({ ...chemicals, Package_Size: e.target.value });
                        }}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="Remaining_Quantity" className="form-label">Remaining Quantity</label>
                    <input type="number" className="form-control" id="Remaining_Quantity" placeholder="Enter Remaining Quantity" required
                        onChange={(e) => {
                            setChemicals({ ...chemicals, Remaining_Quantity: e.target.value });
                        }}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="Counting_Unit" className="form-label">Counting Unit</label>
                    <input type="text" className="form-control" id="Counting_Unit" placeholder="Enter Counting Unit" required
                        onChange={(e) => {
                            setChemicals({ ...chemicals, Counting_Unit: e.target.value });
                        }}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="Location" className="form-label">Location</label>
                    <input type="text" className="form-control" id="Location" placeholder="Enter Location" required
                        onChange={(e) => {
                            setChemicals({ ...chemicals, Location: e.target.value });
                        }}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="Price" className="form-label">Price</label>
                    <input type="number" className="form-control" id="Price" placeholder="Enter Price" required
                        onChange={(e) => {
                            setChemicals({ ...chemicals, Price: e.target.value });
                        }}
                    />
                </div>

                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    );
}

export default AddChemicals;