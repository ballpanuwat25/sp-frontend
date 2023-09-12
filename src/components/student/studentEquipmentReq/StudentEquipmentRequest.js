import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';

function StudentEquipmentRequest() {
    const [studentId, setStudentId] = useState("");
    const [equipmentReq, setEquipmentReq] = useState([]);
    const [filteredEquipmentReq, setFilteredEquipmentReq] = useState([]);

    const searchInputRef = useRef();

    axios.defaults.withCredentials = true;

    const formatDate = (dateString) => {
        const options = { day: 'numeric', month: 'numeric', year: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', options);
    };

    const handleSearchButtonClick = () => {
        const inputValue = searchInputRef.current.value;

        const filteredRequests = equipmentReq.filter(
            (request) => request.Student_Id.includes(inputValue)
        );

        setFilteredEquipmentReq(filteredRequests);
    };

    useEffect(() => {
        const inputValue = searchInputRef.current.value;
        const filteredRequests = equipmentReq.filter(
            (request) => request.Student_Id.includes(inputValue)
        );
        setFilteredEquipmentReq(filteredRequests);
    }, [equipmentReq]);

    useEffect(() => {
        axios.get("http://localhost:3001/student", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("studentToken")}`,
            },
        }).then((response) => {
            if (response.data.Error) {
                alert(response.data.Error);
            } else {
                setStudentId(response.data.studentId);
            }
        });
        getEquipmentRequest();
    }, []);

    const getEquipmentRequest = async () => {
        const response = await axios.get("http://localhost:3001/equipment-request-list");
        setEquipmentReq(response.data);
    };

    return (
        <div className='container-fluid'>
            <div className='d-flex justify-content-between align-items-center'>
                <h2>Equipment Requests</h2>
                <div className='input-group w-25'>
                    <input
                        type="text"
                        className="form-control"
                        ref={searchInputRef}
                        defaultValue={studentId}
                        placeholder="Search Chemicals Request by Student ID"
                    />
                    <button
                        className="btn btn-primary"
                        type="button"
                        onClick={handleSearchButtonClick}
                    >
                        Search
                    </button>
                </div>
            </div>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">Student Id</th>
                        <th scope="col">Equipment Id</th>
                        <th scope="col">Equipment Category Id</th>
                        <th scope="col">Requested Quantity</th>
                        <th scope="col">Release Quantity</th>
                        <th scope="col">Staff Id</th>
                        <th scope="col">Teacher Id</th>
                        <th scope="col">Request Status</th>
                        <th scope="col">Request Comment</th>
                        <th scope="col">Request Date</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredEquipmentReq.map((equipmentReq) => (
                        <tr key={equipmentReq.Chem_Request_Id}>
                            <td> {equipmentReq.Student_Id} </td>
                            <td> {equipmentReq.Equipment_Id} </td>
                            <td> {equipmentReq.Equipment_Category_Id} </td>
                            <td> {equipmentReq.Requested_Quantity} </td>
                            <td> {equipmentReq.Release_Quantity} </td>
                            <td> {equipmentReq.Staff_Id} </td>
                            <td> {equipmentReq.Teacher_Id} </td>
                            <td> {equipmentReq.Request_Status} </td>
                            <td> {equipmentReq.Request_Comment} </td>
                            <td>{formatDate(equipmentReq.createdAt)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default StudentEquipmentRequest