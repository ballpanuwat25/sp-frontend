import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';

function StudentChemicalsRequest() {
    const [studentId, setStudentId] = useState("");
    const [chemicalsReq, setChemicalsReq] = useState([]);
    const [filteredChemicalsReq, setFilteredChemicalsReq] = useState([]);

    const searchInputRef = useRef();

    axios.defaults.withCredentials = true;

    const formatDate = (dateString) => {
        const options = { day: 'numeric', month: 'numeric', year: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', options);
    };

    const handleSearchButtonClick = () => {
        const inputValue = searchInputRef.current.value;

        const filteredRequests = chemicalsReq.filter(
            (request) => request.Student_Id.includes(inputValue)
        );

        setFilteredChemicalsReq(filteredRequests);
    };

    useEffect(() => {
        const inputValue = searchInputRef.current.value;
        const filteredRequests = chemicalsReq.filter(
            (request) => request.Student_Id.includes(inputValue)
        );
        setFilteredChemicalsReq(filteredRequests);
    }, [chemicalsReq]);

    useEffect(() => {
        axios.get("https://backup-test.onrender.com/student", {
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
        getChemicalsRequest();
    }, []);

    const getChemicalsRequest = async () => {
        const response = await axios.get("https://backup-test.onrender.com/chemicals-request-list");
        setChemicalsReq(response.data);
    };

    return (
        <div className='container-fluid'>
            <div className='d-flex justify-content-between align-items-center'>
                <h2>Chemicals Requests</h2>
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
                        <th scope="col">Chem Id</th>
                        <th scope="col">Chem Bottle Id</th>
                        <th scope="col">Requested Quantity</th>
                        <th scope="col">Release Quantity</th>
                        <th scope="col">Counting Unit</th>
                        <th scope="col">Staff Id</th>
                        <th scope="col">Teacher Id</th>
                        <th scope="col">Request Status</th>
                        <th scope="col">Request Comment</th>
                        <th scope="col">Request Date</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredChemicalsReq.map((chemicalsReq) => (
                        <tr key={chemicalsReq.Chem_Request_Id}>
                            <td> {chemicalsReq.Student_Id} </td>
                            <td> {chemicalsReq.Chem_Id} </td>
                            <td> {chemicalsReq.Chem_Bottle_Id} </td>
                            <td> {chemicalsReq.Requested_Quantity} </td>
                            <td> {chemicalsReq.Release_Quantity} </td>
                            <td> {chemicalsReq.Counting_Unit} </td>
                            <td> {chemicalsReq.Staff_Id} </td>
                            <td> {chemicalsReq.Teacher_Id} </td>
                            <td> {chemicalsReq.Request_Status} </td>
                            <td> {chemicalsReq.Request_Comment} </td>
                            <td>{formatDate(chemicalsReq.createdAt)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default StudentChemicalsRequest
