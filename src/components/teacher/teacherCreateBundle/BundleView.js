import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function BundleView() {
    const [studentId, setStudentId] = useState("");

    const [bundles, setBundles] = useState([]);
    const [chemicals, setChemicals] = useState([]);
    const [equipment, setEquipment] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [chemicalsRequest, setChemicalsRequest] = useState({
        Student_Id: "",
        Chem_Id: "",
        Requested_Quantity: "",
        Counting_Unit: "",
        Request_Purpose: "",
        Request_Room: "",
        Teacher_Id: "",
        Request_Status: "",
    });

    const [equipmentRequest, setEquipmentRequest] = useState({
        Student_Id: "",
        Equipment_Id: "",
        Requested_Quantity: "",
        Counting_Unit: "",
        Request_Purpose: "",
        Request_Room: "",
        Teacher_Id: "",
        Request_Status: "",
    });

    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:3001/student").then((response) => {
            if (response.data.Error) {
                alert(response.data.Error);
            } else {
                const fetchedStudentId = response.data.studentId;
                setStudentId(fetchedStudentId);
                setChemicalsRequest({
                    ...chemicalsRequest,
                    Student_Id: fetchedStudentId,
                });
                setEquipmentRequest({
                    ...equipmentRequest,
                    Student_Id: fetchedStudentId,
                });
            }
        });
    }, []);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const bundleResponse = await axios.get(`http://localhost:3001/bundle-list/${id}`);
            const chemicalsResponse = await axios.get("http://localhost:3001/chemicalsDetail-list");
            const equipmentResponse = await axios.get("http://localhost:3001/equipment-list");

            setBundles(bundleResponse.data);
            setChemicals(chemicalsResponse.data);
            setEquipment(equipmentResponse.data);
            setIsLoading(false); // Data fetching is complete
        } catch (error) {
            console.error('Error fetching data:', error);
            setIsLoading(false); // Set loading to false even if there's an error
        }
    };

    const sendBundleRequests = async (bundle) => {
        try {
            const allRequests = [];

            bundles.forEach((bundle) => {
                const requestData = {
                    Student_Id: studentId,
                    Requested_Quantity: bundle.Requested_Quantity,
                    Counting_Unit: bundle.Counting_Unit,
                    Request_Purpose: bundle.Request_Purpose,
                    Request_Room: bundle.Request_Room,
                    Teacher_Id: bundle.Teacher_Id,
                    Request_Status: "Pending",
                };

                if (bundle.Chem_Id) {
                    requestData.Chem_Id = bundle.Chem_Id;
                } else if (bundle.Equipment_Id) {
                    requestData.Equipment_Id = bundle.Equipment_Id;
                }

                allRequests.push(requestData);
            });

            await Promise.all(allRequests.map((requestData) => {
                if (requestData.Chem_Id) {
                    return axios.post("http://localhost:3001/chemicals-request-list", requestData);
                } else if (requestData.Equipment_Id) {
                    return axios.post("http://localhost:3001/equipment-request-list", requestData);
                }
                // You can add more conditions if needed
            }));

            navigate("/student-dashboard");
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="container-fluid">
            <h2>Bundle Details</h2>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Items Id</th>
                            <th scope="col">Items Name</th>
                            <th scope="col">Requested Quantity</th>
                            <th scope="col">Counting Unit</th>
                            <th scope="col">Teacher Id</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bundles.map((bundle, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{bundle.Chem_Id || bundle.Equipment_Id}</td>
                                <td>
                                    {bundle.Chem_Id
                                        ? chemicals.find((chemical) => chemical.Chem_Id === bundle.Chem_Id)?.Chem_Name
                                        : equipment.find((equipment) => equipment.Equipment_Id === bundle.Equipment_Id)?.Equipment_Name}
                                </td>
                                <td>{bundle.Requested_Quantity}</td>
                                <td>{bundle.Counting_Unit}</td>
                                <td>{bundle.Teacher_Id}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );

}

export default BundleView;
