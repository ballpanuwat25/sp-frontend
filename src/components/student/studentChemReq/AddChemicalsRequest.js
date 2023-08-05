import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AddChemicalsRequest() {
    const [studentId, setStudentId] = useState("");
    const [chemicalsRequest, setChemicalsRequest] = useState({
        Student_Id: "",
        Chem_Id: "",
        Requested_Quantity: "",
        Counting_Unit: "",
    });

    const navigate = useNavigate();

    const saveChemicalsRequest = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:3001/chemicals-request-list", (chemicalsRequest));
            navigate("/student-dashboard");
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        axios.get("http://localhost:3001/student").then((response) => {
            if (response.data.Error) {
                alert(response.data.Error);
            } else {
                setStudentId(response.data.studentId);
                setChemicalsRequest({ ...chemicalsRequest, Student_Id: response.data.studentId });
            }
        });
    })

    return (
        <div className='container-fluid'>
            <form onSubmit={saveChemicalsRequest}>
                <div className="mb-3">
                    <label htmlFor="Student_Id" className="form-label">Student Id</label>
                    <input type="text" className="form-control" id="Student_Id" placeholder="Enter Student Id" 
                        defaultValue={studentId}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="Chem_Id" className="form-label">Chemicals Id</label>
                    <input type="text" className="form-control" id="Chem_Id" placeholder="Enter Chemicals Id"  value={chemicalsRequest.Chem_Id}
                        onChange={(e) => {
                            setChemicalsRequest({ ...chemicalsRequest, Chem_Id: e.target.value });
                        }}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="Requested_Quantity" className="form-label">Requested Quantity</label>
                    <input type="text" className="form-control" id="Requested_Quantity" placeholder="Enter Requested Quantity"  value={chemicalsRequest.Requested_Quantity}
                        onChange={(e) => {
                            setChemicalsRequest({ ...chemicalsRequest, Requested_Quantity: e.target.value });
                        }}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="Counting_Unit" className="form-label">Counting Unit</label>
                    <input type="text" className="form-control" id="Counting_Unit" placeholder="Enter Counting Unit"  value={chemicalsRequest.Counting_Unit}
                        onChange={(e) => {
                            setChemicalsRequest({ ...chemicalsRequest, Counting_Unit: e.target.value });
                        }}
                    />
                </div>

                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}

export default AddChemicalsRequest
