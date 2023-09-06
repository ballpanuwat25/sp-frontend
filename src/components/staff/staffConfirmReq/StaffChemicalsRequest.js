import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import BarcodeScanner from "../barcode/BarcodeScanner";

function StaffChemicalsRequest() {
    const [Chem_Request_Id, setChem_Request_Id] = useState("");
    const [Chem_Id, setChem_Id] = useState("");
    const [Chem_Bottle_Id, setChem_Bottle_Id] = useState("");
    const [Requested_Quantity, setRequested_Quantity] = useState("");
    const [Release_Quantity, setRelease_Quantity] = useState("");

    const [Remaining_Quantity, setRemaining_Quantity] = useState("");

    const [Counting_Unit, setCounting_Unit] = useState("");
    const [Staff_Id, setStaff_Id] = useState("");
    const [Request_Status, setRequest_Status] = useState("");
    const [Request_Comment, setRequest_Comment] = useState("");

    const [staffId, setStaffId] = useState("");
    const [staffIdInputValue, setStaffIdInputValue] = useState("");

    const [isRejectButtonClicked, setIsRejectButtonClicked] = useState(false);

    const { id } = useParams();
    const navigate = useNavigate();
    const [scannedText, setScannedText] = useState("");

    useEffect(() => {
        getStaffId();
        getChemicalsById();
        getChemicalsRequestById();
    }, []);

    const getStaffId = async () => {
        try {
            const response = await axios.get("https://special-problem.onrender.com/staff");
            if (response.data.Error) {
                alert(response.data.Error);
            } else {
                setStaffId(response.data.staffId);
            }
        } catch (error) {
            console.error("Error fetching staff data:", error);
        }
    };

    const getChemicalsById = async () => {
        try {
            const response = await axios.get(`https://special-problem.onrender.com/chemicals-list/${Chem_Bottle_Id}`);
            const chemicals = response.data;
            
            if (chemicals) {
                setChem_Bottle_Id(chemicals.Chem_Bottle_Id);
                setRemaining_Quantity(chemicals.Remaining_Quantity);
            } else {
                // Handle the case where chemicals is null or undefined
                console.error("Chemicals data is null or undefined");
            }
        } catch (error) {
            console.error("Error fetching chemicals data:", error);
        }
    }    

    const getChemicalsRequestById = async () => {
        const result = await axios.get(`https://special-problem.onrender.com/chemicals-request-list/${id}`);
        setChem_Request_Id(result.data.Chem_Request_Id);
        setChem_Id(result.data.Chem_Id);
        setChem_Bottle_Id(result.data.Chem_Bottle_Id);
        setRequested_Quantity(result.data.Requested_Quantity);
        setRelease_Quantity(result.data.Release_Quantity);
        setCounting_Unit(result.data.Counting_Unit);
        setStaff_Id(result.data.Staff_Id);
        setRequest_Status(result.data.Request_Status);
        setRequest_Comment(result.data.Request_Comment);
    };

    const updateChemicalsRequest = async (e) => {
        e.preventDefault();

        // Check if Release_Quantity is greater than Remaining_Quantity
        if (Release_Quantity > Remaining_Quantity) {
            alert("Chemicals are not enough.");
            return;
        }

        // Check if Release_Quantity is equal to Remaining_Quantity
        if (Release_Quantity === Remaining_Quantity) {
            const userConfirmed = window.confirm("Chemicals are empty now. Do you still want to proceed?");
            if (!userConfirmed) {
                return;
            }
        }

        // Calculate newRemaining_Quantity
        const newRemaining_Quantity = Remaining_Quantity - Release_Quantity;

        try {
            // Make the API call to update the chemicals-list
            const chemicalsListResponse = await axios.patch(`https://special-problem.onrender.com/chemicals-list/${Chem_Bottle_Id}`, {
                Remaining_Quantity: newRemaining_Quantity,
            });

            if (chemicalsListResponse.data.Error) {
                alert(chemicalsListResponse.data.Error);
            } else {
                // If the update to chemicals-list is successful, proceed with updating chemicals-request-list
                const requestData = {
                    Chem_Request_Id,
                    Chem_Id,
                    Chem_Bottle_Id,
                    Requested_Quantity,
                    Release_Quantity,
                    Counting_Unit,
                    Staff_Id: staffIdInputValue,
                    Request_Status,
                    Request_Comment,
                };
                const chemicalsRequestResponse = await axios.patch(`https://special-problem.onrender.com/chemicals-request-list/${id}`, requestData);

                if (chemicalsRequestResponse.data.Error) {
                    alert(chemicalsRequestResponse.data.Error);
                } else {
                    // If both updates are successful, navigate to the staff dashboard
                    navigate("/staff-dashboard");
                }
            }
        } catch (error) {
            console.error("Error updating chemicals data:", error);
        }
    };

    useEffect(() => {
        if (!staffIdInputValue && staffId) {
            setStaffIdInputValue(staffId);
        }
    }, [staffId, staffIdInputValue]);

    const handleScannedTextChange = (scannedText) => {
        setScannedText(scannedText);
    };

    const handleApplyButtonClick = () => {
        setChem_Bottle_Id(scannedText);
    };

    const handleQuery = async () => {
        try {
            const response = await axios.get(
                `https://special-problem.onrender.com/chemicals-list/${Chem_Bottle_Id}`
            );
            const chemicals = response.data;

            if (response.data.Error || chemicals.Remaining_Quantity === undefined) {
                alert("Chemicals bottle id is not found, try again.");
            } else {
                setRemaining_Quantity(chemicals.Remaining_Quantity);
            }
        } catch (error) {
            console.error("Error fetching chemicals data:", error);
            alert("An error occurred while fetching data. Please try again.");
        }
    };

    return (
        <div className="container-fluid">
            <h1>StaffChemicalsRequest</h1>
            <form onSubmit={updateChemicalsRequest}>
                <div className="mb-3">
                    <label htmlFor="Chem_Request_Id" className="form-label">Chemicals Request Id</label>
                    <input type="text" className="form-control" id="Chem_Request_Id" placeholder="Enter Chemicals Request Id" required={isRejectButtonClicked} value={Chem_Request_Id}
                        onChange={(e) => {
                            setChem_Request_Id(e.target.value);
                        }}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="Chem_Id" className="form-label">Chemicals Id</label>
                    <input type="text" className="form-control" id="Chem_Id" placeholder="Enter Chemicals Id" required={isRejectButtonClicked} value={Chem_Id}
                        onChange={(e) => {
                            setChem_Id(e.target.value);
                        }}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="Chem_Bottle_Id" className="form-label">Find Chemicals Bottle Id</label>
                    <div className="input-group">
                        <button
                            className="btn btn-outline-secondary"
                            type="button"
                            data-bs-toggle="modal"
                            data-bs-target="#exampleModal"
                        >
                            Scan
                        </button>
                        <input
                            type="text"
                            className="form-control"
                            id="Chem_Bottle_Id"
                            placeholder="Enter Chemicals Bottle Id"
                            required={isRejectButtonClicked}
                            value={Chem_Bottle_Id}
                            onChange={(e) => {
                                setChem_Bottle_Id(e.target.value);
                            }}
                        />
                        <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={handleQuery}
                        >
                            Query
                        </button>
                    </div>

                    <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLabel">Modal title</h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <BarcodeScanner onScannedTextChange={handleScannedTextChange} />
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                    <button type="button" className="btn btn-primary" onClick={handleApplyButtonClick} data-bs-dismiss="modal">
                                        Apply
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mb-3">
                    <label htmlFor="Requested_Quantity" className="form-label">Requested Quantity</label>
                    <input type="text" className="form-control" id="Requested_Quantity" placeholder="Enter Requested Quantity" required={isRejectButtonClicked} value={Requested_Quantity}
                        onChange={(e) => {
                            setRequested_Quantity(e.target.value);
                        }}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="Remaining_Quantity" className="form-label">Remaining Quantity</label>
                    <input
                        type="number"
                        className="form-control"
                        id="Remaining_Quantity"
                        placeholder="Enter Remaining Quantity"
                        required={isRejectButtonClicked}
                        value={Remaining_Quantity}
                        onChange={(e) => {
                            setRemaining_Quantity(e.target.value);
                        }}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="Release_Quantity" className="form-label">Release Quantity</label>
                    <input type="text" className="form-control" id="Release_Quantity" placeholder="Enter Release Quantity" required={isRejectButtonClicked} value={Release_Quantity}
                        onChange={(e) => {
                            setRelease_Quantity(e.target.value);
                        }}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="Counting_Unit" className="form-label">Counting Unit</label>
                    <input type="text" className="form-control" id="Counting_Unit" placeholder="Enter Counting Unit" required={isRejectButtonClicked} value={Counting_Unit}
                        onChange={(e) => {
                            setCounting_Unit(e.target.value);
                        }}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="Staff_Id" className="form-label">Staff Id</label>
                    <input
                        type="text"
                        className="form-control"
                        id="Staff_Id"
                        placeholder="Enter Staff Id"
                        value={staffIdInputValue}
                        onChange={(e) => {
                            setStaffIdInputValue(e.target.value);
                        }}
                    />
                </div>

                <div className="d-flex">
                    <button
                        type="submit"
                        className="btn btn-primary"
                        onClick={() => {
                            setRequest_Status("Confirmed");
                        }}
                    >
                        Confirmed
                    </button>
                    <button
                        type="button"
                        className="btn btn-outline-secondary mx-2"
                        data-bs-toggle="modal"
                        data-bs-target="#rejectModal"
                        onClick={() => {
                            setIsRejectButtonClicked(true); // Set the flag to indicate the Reject button is clicked
                        }}
                    >
                        Rejected Chemicals Request
                    </button>

                    <div className="modal fade" id="rejectModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLabel">Rejected Comment</h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <label htmlFor="Request_Comment" className="form-label">Rejected Comment</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="Request_Comment"
                                        placeholder="Enter Request Comment"
                                        required={isRejectButtonClicked} // Make the input required only when Reject button is clicked
                                        value={Request_Comment}
                                        onChange={(e) => {
                                            setRequest_Comment(e.target.value);
                                        }}
                                    />
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        data-bs-dismiss="modal"
                                        onClick={() => {
                                            setRequest_Comment(""); // Clear the comment input field
                                            setIsRejectButtonClicked(false); // Reset the flag when modal is closed
                                        }}
                                    >
                                        Close
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        onClick={() => {
                                            setRequest_Status("Rejected");
                                            setIsRejectButtonClicked(false); // Reset the flag when modal is closed
                                        }}
                                        data-bs-dismiss="modal"
                                    >
                                        Save changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default StaffChemicalsRequest