import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import BarcodeScanner from '../barcode/BarcodeScanner';

function AddChemicals() {
    const [staffId, setStaffId] = useState("");
    const [logActivity, setLogActivity] = useState({
        LogActivity_Id: "",
        LogActivity_Name: "",
        Chem_Bottle_Id: "",
        Staff_Id: "",
    });

    const [chemicals, setChemicals] = useState({
        Chem_Bottle_Id: "",
        Chem_Id: "",
        Package_Size: "",
        Remaining_Quantity: "",
        Counting_Unit: "",
        Location: "",
        Price: "",
    });

    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    const [scannedText, setScannedText] = useState("");

    useEffect(() => {
        axios.get("http://localhost:3001/staff").then((response) => {
            if (response.data.Error) {
                alert(response.data.Error);
            } else {
                setStaffId(response.data.staffId);
                setLogActivity({ ...logActivity, Staff_Id: response.data.staffId });
            }
        });
    }, [logActivity]);

    const saveChemicals = async (e) => {
        e.preventDefault();
        try {
            const { Chem_Bottle_Id } = chemicals;

            // Check if Chem_Id already exists
            const chemBottleIdExists = await axios.get(`http://localhost:3001/chemicals-list/${Chem_Bottle_Id}`);
            if (chemBottleIdExists.data) {
                alert("Chem_Id already exists. Please enter a different Chem_Bottle_Id.");
                return;
            }

            const updatedLogActivity = { ...logActivity, LogActivity_Name: "Add Chemicals", Chem_Bottle_Id: Chem_Bottle_Id };
            await axios.post("http://localhost:3001/log-activity", updatedLogActivity);
            await axios.post("http://localhost:3001/chemicals-list", chemicals);

            alert("Chemicals added successfully");
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
                <div className='mb-3'>
                    <label htmlFor='Staff_Id' className='form-label'>Staff_Id</label>
                    <input type='text'
                        className='form-control'
                        placeholder='Enter Staff Id'
                        defaultValue={staffId}
                        readOnly
                    />
                </div>

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