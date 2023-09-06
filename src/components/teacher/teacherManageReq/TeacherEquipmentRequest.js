import axios from "axios";
import React, { useState, useEffect } from "react";

function TeacherEquipmentRequest() {
    const [teacherId, setTeacherId] = useState("");
    const [equipmentReq, setEquipmentReq] = useState([]);

    const [Request_Comment, setRequest_Comment] = useState("");
    const [activeRequestId, setActiveRequestId] = useState(null);
    const [selectedIds, setSelectedIds] = useState([]);

    const [studentIdSearch, setStudentIdSearch] = useState("");
    const [teacherIdSearch, setTeacherIdSearch] = useState("");

    axios.defaults.withCredentials = true;

    useEffect(() => {
        axios.get("https://special-problem.onrender.com/teacher").then((response) => {
            if (response.data.Error) {
                alert(response.data.Error);
            } else {
                setTeacherId(response.data.teacherId);
            }
        });
    }, []);

    useEffect(() => {
        getEquipmentRequest();
    }, []);

    const getEquipmentRequest = async () => {
        const response = await axios.get("https://special-problem.onrender.com/equipment-request-list");
        setEquipmentReq(response.data);
    };

    const formatDate = (dateString) => {
        const options = { day: 'numeric', month: 'numeric', year: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', options);
    };

    const approveEquipmentRequest = async (id) => {
        try {
            await updateEquipmentRequestStatus(id, "Approved");
        } catch (err) {
            console.log(err);
        }
    }

    const declineEquipmentRequest = async () => {
        try {
            if (activeRequestId) {
                await updateEquipmentRequestStatus(activeRequestId, "Declined", Request_Comment);
                setRequest_Comment("");
                setActiveRequestId(null);
            }
        } catch (err) {
            console.log(err);
        }
    }

    const updateEquipmentRequestStatus = async (id, status, comment) => {
        try {
            const data = {
                Request_Status: status,
                Request_Comment: comment,
            };
            await axios.patch(`https://special-problem.onrender.com/equipment-request-list/${id}`, data);
            getEquipmentRequest();
        } catch (err) {
            console.log(err);
        }
    }

    const handleCheckAll = () => {
        const allIds = equipmentReq.map((req) => req.Equipment_Request_Id);
        setSelectedIds(allIds);
    }

    const handleApproveChecked = () => {
        selectedIds.forEach((id) => approveEquipmentRequest(id));
        setSelectedIds([]);
    }

    const handleCheckboxChange = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    }

    const filterEquipmentReq = (data) => {
        const studentIdRegex = new RegExp(studentIdSearch, "i"); // "i" flag for case-insensitive search
        const teacherIdRegex = new RegExp(teacherIdSearch, "i"); // "i" flag for case-insensitive search

        return data.filter((req) => {
            const studentIdMatch = studentIdSearch ? studentIdRegex.test(req.Student_Id) : true;
            const teacherIdMatch = teacherIdSearch ? teacherIdRegex.test(req.Teacher_Id) : true;

            return studentIdMatch && teacherIdMatch;
        });
    };

    const filteredEquipmentReq = filterEquipmentReq(equipmentReq);

    useEffect(() => {
        setTeacherIdSearch(teacherId); 
    }, [teacherId]);

    return (
        <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center">
                <h1>TeacherId: {teacherId} Equipment Request</h1>
                <div>
                    <button className="btn btn-warning me-2" onClick={handleCheckAll}>
                        Check ALL
                    </button>
                    <button className="btn btn-success" onClick={handleApproveChecked}>
                        Approved by Checked
                    </button>
                    <div className="mb-3">
                        <label htmlFor="studentIdSearch" className="form-label">Search by Student Id</label>
                        <input
                            type="text"
                            className="form-control"
                            id="studentIdSearch"
                            placeholder="Enter Student Id"
                            value={studentIdSearch}
                            onChange={(e) => setStudentIdSearch(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="teacherIdSearch" className="form-label">Search by Teacher Id</label>
                        <input
                            type="text"
                            className="form-control"
                            id="teacherIdSearch"
                            placeholder="Enter Teacher Id"
                            value={teacherIdSearch}
                            onChange={(e) => setTeacherIdSearch(e.target.value)}
                            readOnly
                        />
                    </div>
                </div>
            </div>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">Check</th>
                        <th scope="col">Student Id</th>
                        <th scope="col">Equipment Id</th>
                        <th scope="col">Requested Quantity</th>
                        <th scope="col">Teacher Id</th>
                        <th scope="col">Request Status</th>
                        <th scope="col">Request Comment</th>
                        <th scope="col">Request Date</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredEquipmentReq.map((equipmentReq) => (
                        <tr key={equipmentReq.Equipment_Request_Id}>
                            <td>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        value={equipmentReq.Equipment_Request_Id}
                                        id={`flexCheckDefault-${equipmentReq.Equipment_Request_Id}`}
                                        checked={selectedIds.includes(equipmentReq.Equipment_Request_Id)}
                                        onChange={() => handleCheckboxChange(equipmentReq.Equipment_Request_Id)}
                                    />
                                </div>
                            </td>
                            <td> {equipmentReq.Student_Id} </td>
                            <td> {equipmentReq.Equipment_Id} </td>
                            <td> {equipmentReq.Requested_Quantity} </td>
                            <td> {equipmentReq.Teacher_Id} </td>
                            <td> {equipmentReq.Request_Status} </td>
                            <td> {equipmentReq.Request_Comment} </td>
                            <td>{formatDate(equipmentReq.createdAt)}</td>
                            <td>
                                <div className="d-grid gap-2 d-sm-flex">
                                    <button onClick={() => approveEquipmentRequest(equipmentReq.Equipment_Request_Id)} className="btn btn-success mx-1">Approve</button>
                                    <button
                                        className="btn btn-danger mx-1"
                                        data-bs-toggle="modal" data-bs-target={`#exampleModal-${equipmentReq.Equipment_Request_Id}`}
                                        onClick={() => setActiveRequestId(equipmentReq.Equipment_Request_Id)}
                                    >
                                        Decline
                                    </button>

                                    <div className="modal fade" id={`exampleModal-${equipmentReq.Equipment_Request_Id}`} tabIndex="-1" aria-labelledby={`exampleModalLabel-${equipmentReq.Equipment_Request_Id}`} aria-hidden="true">
                                        <div className="modal-dialog">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h5 className="modal-title" id="exampleModalLabel">Decline Reason</h5>
                                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                </div>
                                                <div className="modal-body">
                                                    <div className="mb-3">
                                                        <label htmlFor="Request_Comment" className="form-label">Request Comment</label>
                                                        <input type="text" className="form-control" id="Request_Comment" placeholder="Enter Request Comment" value={Request_Comment} required
                                                            onChange={(e) => {
                                                                setRequest_Comment(e.target.value);
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="modal-footer">
                                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                    <button onClick={declineEquipmentRequest} type="button" className="btn btn-primary" data-bs-dismiss="modal">Save changes</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default TeacherEquipmentRequest;