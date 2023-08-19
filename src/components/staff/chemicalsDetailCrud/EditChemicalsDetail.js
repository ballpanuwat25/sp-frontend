import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditChemicalsDetail() {
    const [staffId, setStaffId] = useState("");
    const [logActivity, setLogActivity] = useState({
        LogActivity_Id: "",
        LogActivity_Name: "",
        Chem_Id: "",
        Staff_Id: "",
    });

    const [Chem_Id, setChem_Id] = useState("");
    const [Chem_Name, setChem_Name] = useState("");
    const [Chem_CAS, setChem_CAS] = useState("");
    const [Chem_UN, setChem_UN] = useState("");
    const [Chem_Type, setChem_Type] = useState("");
    const [Chem_Grade, setChem_Grade] = useState("");
    const [Chem_State, setChem_State] = useState("");
    const [Chem_MSDS, setChem_MSDS] = useState("");
    const [Chem_GHS, setChem_GHs] = useState("");

    const { id } = useParams();
    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

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

    useEffect(() => {
        getChemicalsDetailById()
        // eslint-disable-next-line
    }, [])

    const getChemicalsDetailById = async () => {
        const response = await axios.get(`http://localhost:3001/chemicalsDetail-list/${id}`);
        const chemicalsDetail = response.data;
        setChem_Id(chemicalsDetail.Chem_Id);
        setChem_Name(chemicalsDetail.Chem_Name);
        setChem_CAS(chemicalsDetail.Chem_CAS);
        setChem_UN(chemicalsDetail.Chem_UN);
        setChem_Type(chemicalsDetail.Chem_Type);
        setChem_Grade(chemicalsDetail.Chem_Grade);
        setChem_State(chemicalsDetail.Chem_State);
        setChem_MSDS(chemicalsDetail.Chem_MSDS);
        setChem_GHs(chemicalsDetail.Chem_GHS);
    }

    const updateChemicalsDetail = async (e) => {
        e.preventDefault();
        const response = await axios.patch(`http://localhost:3001/chemicalsDetail-list/${id}`, {
            Chem_Id,
            Chem_Name,
            Chem_CAS,
            Chem_UN,
            Chem_Type,
            Chem_Grade,
            Chem_State,
            Chem_MSDS,
            Chem_GHS,
        });
        const updatedLogActivity = { ...logActivity, LogActivity_Name: "Updated Chemicals", Chem_Id: Chem_Id };
        await axios.post("http://localhost:3001/log-activity", updatedLogActivity);
        if (response.data.Error) {
            alert(response.data.Error);
        } else {
            navigate("/chemicalsDetail-list");
        }
    }

    return (
        <div className="container-fluid">
            <h1>Edit Chemicals Detail</h1>
            <form onSubmit={updateChemicalsDetail}>

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
                    <label htmlFor="Chem_Id" className="form-label">Chemicals Id</label>
                    <input type="text" className="form-control" id="Chem_Id" placeholder="Enter Chemicals Id" required
                        value={Chem_Id}
                        onChange={(e) => {
                            setChem_Id(e.target.value);
                        }}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="Chem_Name" className="form-label">Chemicals Name</label>
                    <input type="text" className="form-control" id="Chem_Name" placeholder="Enter Chemicals Name" required
                        value={Chem_Name}
                        onChange={(e) => {
                            setChem_Name(e.target.value);
                        }}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="Chem_CAS" className="form-label">Chemicals CAS</label>
                    <input type="text" className="form-control" id="Chem_CAS" placeholder="Enter Chemicals CAS" required
                        value={Chem_CAS}
                        onChange={(e) => {
                            setChem_CAS(e.target.value);
                        }}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="Chem_UN" className="form-label">Chemicals UN</label>
                    <input type="text" className="form-control" id="Chem_UN" placeholder="Enter Chemicals UN" required
                        value={Chem_UN}
                        onChange={(e) => {
                            setChem_UN(e.target.value);
                        }}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="Chem_Type" className="form-label">Chemicals Type</label>
                    <input type="text" className="form-control" id="Chem_Type" placeholder="Enter Chemicals Type" required
                        value={Chem_Type}
                        onChange={(e) => {
                            setChem_Type(e.target.value);
                        }}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="Chem_Grade" className="form-label">Chemicals Grade</label>
                    <input type="text" className="form-control" id="Chem_Grade" placeholder="Enter Chemicals Grade" required
                        value={Chem_Grade}
                        onChange={(e) => {
                            setChem_Grade(e.target.value);
                        }}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="Chem_State" className="form-label">Chemicals State</label>
                    <input type="text" className="form-control" id="Chem_State" placeholder="Enter Chemicals State" required
                        value={Chem_State}
                        onChange={(e) => {
                            setChem_State(e.target.value);
                        }}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="Chem_MSDS" className="form-label">Chemicals MSDS</label>
                    <input type="text" className="form-control" id="Chem_MSDS" placeholder="Enter Chemicals MSDS" required
                        value={Chem_MSDS}
                        onChange={(e) => {
                            setChem_MSDS(e.target.value);
                        }}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="Chem_GHS" className="form-label">Chemicals GHS</label>
                    <input type="text" className="form-control" id="Chem_GHS" placeholder="Enter Chemicals GHS" required
                        value={Chem_GHS}
                        onChange={(e) => {
                            setChem_GHs(e.target.value);
                        }}
                    />
                </div>

                <button type="submit" className="btn btn-primary">Update</button>
            </form>
        </div>
    )
}

export default EditChemicalsDetail