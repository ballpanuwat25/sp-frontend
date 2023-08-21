import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import BarcodeScanner from "../barcode/BarcodeScanner";

function StaffEquipmentRequest() {
    const [Equipment_Request_Id, setEquipment_Request_Id] = useState("");
    const [Equipment_Id, setEquipment_Id] = useState("");
    const [Requested_Quantity, setRequested_Quantity] = useState("");
    const [Release_Quantity, setRelease_Quantity] = useState("");

    const [Quantity, setQuantity] = useState("");

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
        getEquipmentById();
        getEquipmentRequestById();
    }, []);

    const getStaffId = async () => {
        try {
            const response = await axios.get("http://localhost:3001/staff");
            if (response.data.Error) {
                alert(response.data.Error);
            } else {
                setStaffId(response.data.staffId);
            }
        } catch (error) {
            console.error("Error fetching staff data:", error);
        }
    };

    const getEquipmentById = async () => {
        const response = await axios.get(`http://localhost:3001/equipment-list/${Equipment_Id}`);
        const equipment = response.data;
        setEquipment_Id(equipment.Equipment_Id);
        setQuantity(equipment.Quantity);
    }

    const getEquipmentRequestById = async () => {
        const result = await axios.get(`http://localhost:3001/equipment-request-list/${id}`);
        setEquipment_Request_Id(result.data.Equipment_Request_Id);
        setEquipment_Id(result.data.Equipment_Id);
        setRequested_Quantity(result.data.Requested_Quantity);
        setRelease_Quantity(result.data.Release_Quantity);
        setStaff_Id(result.data.Staff_Id);
        setRequest_Status(result.data.Request_Status);
        setRequest_Comment(result.data.Request_Comment);
    };

    const updateEquipmentRequest = async (e) => {
        e.preventDefault();

        if (Release_Quantity > Quantity) {
            alert("Release quantity cannot be more than the quantity!");
            return;
        }

        if (Release_Quantity === Quantity) {
            const userConfirmed = window.confirm("Are you sure you want to release all the equipment?");
            if (!userConfirmed) {
                return;
            }
        }

        const newQuantity = Quantity - Release_Quantity;

        try {
            const equipmentListResponse = await axios.patch(`http://localhost:3001/equipment-list/${Equipment_Id}`, {
                Quantity: newQuantity
            });

            if (equipmentListResponse.data.Error) {
                alert(equipmentListResponse.data.Error);
            } else {
                const requestData = {
                    Equipment_Request_Id,
                    Equipment_Id,
                    Requested_Quantity,
                    Release_Quantity,
                    Staff_Id: staffIdInputValue,
                    Request_Status,
                    Request_Comment
                };
                const equipmentRequestResponse = await axios.patch(`http://localhost:3001/equipment-request-list/${id}`, requestData);

                if (equipmentRequestResponse.data.Error) {
                    alert(equipmentRequestResponse.data.Error);
                } else {
                    navigate("/staff-dashboard");
                }
            }
        } catch (error) {
            console.error("Error updating equipment request:", error);
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
        setEquipment_Id(scannedText);
    };

    const handleQuery = async () => {
        try {
            const response = await axios.get(
                `http://localhost:3001/equipment-list/${Equipment_Id}`
            );
            const equipment = response.data;

            if (response.data.Error || equipment.Quantity === undefined) {
                alert("Equipment not found!");
            } else {
                setQuantity(equipment.Quantity);
            }
        } catch (error) {
            console.error("Error fetching equipment data:", error);
            alert("Equipment not found!");
        }
    };

    return (
        <div className="container-fluid">
            <h1>Staff Equipment Request</h1>
            <form onSubmit={updateEquipmentRequest}>
                <div className="mb-3">
                    <label htmlFor="Equipment_Request_Id" className="form-label">Equipment Request Id</label>
                    <input type="text" className="form-control" id="Equipment_Request_Id" placeholder="Enter Equipment Request Id" required value={Equipment_Request_Id}
                        onChange={(e) => {
                            setEquipment_Request_Id(e.target.value);
                        }}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="Equipment_Id" className="form-label">Find Equipment Id</label>
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
                            id="Equipment_Id"
                            placeholder="Enter Equipment Id"
                            required
                            value={Equipment_Id}
                            onChange={(e) => {
                                setEquipment_Id(e.target.value);
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
                    <input type="text" className="form-control" id="Requested_Quantity" placeholder="Enter Requested Quantity" required value={Requested_Quantity}
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
                        id="Quantity"
                        placeholder="Enter Remaining Quantity"
                        required
                        value={Quantity}
                        onChange={(e) => {
                            setQuantity(e.target.value);
                        }}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="Release_Quantity" className="form-label">Release Quantity</label>
                    <input type="text" className="form-control" id="Release_Quantity" placeholder="Enter Release Quantity" required value={Release_Quantity}
                        onChange={(e) => {
                            setRelease_Quantity(e.target.value);
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

export default StaffEquipmentRequest