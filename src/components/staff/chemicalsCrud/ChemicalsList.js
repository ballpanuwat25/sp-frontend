import axios from "axios";
import { Link } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react'
import html2canvas from "html2canvas";
import Barcode from "react-barcode";

import BarcodeScanner from "../barcode/BarcodeScanner";

function ChemicalsList() {
    const [chemicals, setChemicals] = useState([]);
    const [chemicalsDetail, setChemicalsDetail] = useState([]);

    const [searchQuery, setSearchQuery] = useState("");
    const [filteredChemicals, setFilteredChemicals] = useState([]);
    const [scannedText, setScannedText] = useState("");

    const [barcode, setBarcode] = useState("Barcode Content");
    const barcodeRef = useRef(null);

    const [staffId, setStaffId] = useState("");
    const [logActivity, setLogActivity] = useState({
        LogActivity_Id: "",
        LogActivity_Name: "",
        Chem_Bottle_Id: "",
        Staff_Id: "",
    });

    axios.defaults.withCredentials = true;

    useEffect(() => {
        axios.get("http://localhost:3001/staff", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("staffToken")}`,
            },
        }).then((response) => {
            if (response.data.Error) {
                alert(response.data.Error);
            } else {
                setStaffId(response.data.staffId);
                setLogActivity({ ...logActivity, Staff_Id: response.data.staffId });
            }
        });
    }, [logActivity]);

    useEffect(() => {
        getChemicals();
        getChemicalsDetail();
    }, []);

    const getChemicals = async () => {
        const response = await axios.get("http://localhost:3001/chemicals-list");
        setChemicals(response.data);
    }

    const getChemicalsDetail = async () => {
        const response = await axios.get("http://localhost:3001/chemicalsDetail-list");
        setChemicalsDetail(response.data);
    }

    const deleteChemicals = async (id) => {
        try {
            const updatedLogActivity = { ...logActivity, LogActivity_Name: "Delete Chemicals", Chem_Bottle_Id: id, Staff_Id: staffId };
            await axios.post("http://localhost:3001/log-activity", updatedLogActivity);
            await axios.delete(`http://localhost:3001/chemicals-list/${id}`)
            getChemicals();
        } catch (error) {
            console.log(error)
        }
    }

    const handleSearchInputChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        const filteredChemicals = chemicals.filter((chemical) =>
            chemical.Chem_Bottle_Id.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredChemicals(filteredChemicals);
    };

    const handleScannedTextChange = (scannedText) => {
        setScannedText(scannedText);
    };

    const downloadBarcode = () => {
        if (!barcodeRef.current) return;

        html2canvas(barcodeRef.current).then((canvas) => {
            const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
            const downloadLink = document.createElement("a");
            downloadLink.href = pngUrl;
            downloadLink.download = "mybarcode.png";
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        });
    };

    const handleChange = (event) => {
        setBarcode(event.target.value);
    };

    const getChemNameById = (chemId) => {
        const chemicalDetail = chemicalsDetail.find((chem) => chem.Chem_Id === chemId);
        return chemicalDetail ? chemicalDetail.Chem_Name : "N/A";
    };

    return (
        <div className="container-fluid">
            <div className='d-flex justify-content-between align-items-center'>
                <h2>Chemicals Bottle List</h2>
                <div className="btn-group">
                    <form className="d-flex" onSubmit={(e) => e.preventDefault()}>
                        <div className="input-group">
                            <BarcodeScanner onScannedTextChange={handleScannedTextChange} />
                            <input
                                className="form-control me-2"
                                type="search"
                                placeholder="Search"
                                aria-label="Search"
                                value={searchQuery}
                                onChange={handleSearchInputChange}
                                aria-describedby="basic-addon1"
                            />
                        </div>
                    </form>
                    <div className="btn-group">
                        <Link to={`add-chemicals`} className="btn btn-outline-success"> Add Chemicals</Link>
                        <Link to="/chemicalsDetail-list" className="btn btn-outline-success"> Chemicals Detail</Link>
                        <button className="btn btn-outline-secondary" type="button" data-bs-toggle="modal" data-bs-dismiss="modal" data-bs-target="#exampleModalToggle2">Barcode Generator</button>
                    </div>
                    
                    <div className="modal fade" id="exampleModalToggle2" aria-hidden="true" aria-labelledby="exampleModalToggleLabel2" tabIndex="-1">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalToggleLabel2">Barcode Generator</h5>
                                    <button className="btn btn-outline-secondary" type="button" data-bs-target="#exampleModal" data-bs-toggle="modal" data-bs-dismiss="modal">Barcode Scanner</button>
                                </div>
                                <div className="modal-body">
                                    <input
                                        type="text"
                                        onChange={handleChange}
                                        value={barcode}
                                        placeholder="Barcode content"
                                        className="form-control mb-3"
                                    />
                                    <div ref={barcodeRef} className="d-flex justify-content-center align-items-center" >
                                        {barcode.trim() !== "" ? <Barcode value={barcode} background="#ffffff" /> : <p>No barcode preview</p>}
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                    {barcode && (
                                        <button className="btn btn-success" onClick={downloadBarcode} data-bs-dismiss="modal">
                                            Download Barcode
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">No</th>
                        <th scope="col">Chemicals Bottle Id</th>
                        <th scope="col">Chemicals Name</th>
                        <th scope="col">Package Size</th>
                        <th scope="col">Remaining Quantity</th>
                        <th scope="col">Counting Unit</th>
                        <th scope="col">Location</th>
                        <th scope="col">Price</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {(searchQuery ? filteredChemicals : chemicals).map((chemicals, index) => (
                        <tr key={index}>
                            <td> {index + 1} </td>
                            <td> {chemicals.Chem_Bottle_Id} </td>
                            <td> {getChemNameById(chemicals.Chem_Id)} </td>
                            <td> {chemicals.Package_Size} </td>
                            <td> {chemicals.Remaining_Quantity} </td>
                            <td> {chemicals.Counting_Unit} </td>
                            <td> {chemicals.Location} </td>
                            <td> {chemicals.Price} </td>
                            <td>
                                <div className="d-grid gap-2 d-sm-flex">
                                    <Link to={`edit-chemicals/${chemicals.Chem_Bottle_Id}`} className="btn btn-primary">Update</Link>
                                    <button onClick={() => deleteChemicals(chemicals.Chem_Bottle_Id)} className="btn btn-danger">Delete</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default ChemicalsList;