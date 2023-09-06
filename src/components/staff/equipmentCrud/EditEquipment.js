import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditEquipment() {
    const [staffId, setStaffId] = useState("");
    const [logActivity, setLogActivity] = useState({
        LogActivity_Id: "",
        LogActivity_Name: "",
        Equipment_Id: "",
        Staff_Id: "",
    });

    const [Equipment_Id, setEquipment_Id] = useState("");
    const [Equipment_Category_Id, setEquipment_Category_Id] = useState("");
    const [Equipment_Name, setEquipment_Name] = useState("");
    const [Quantity, setQuantity] = useState("");
    const [Location, setLocation] = useState("");
    const [Price, setPrice] = useState("");
    const [Fixed_Cost, setFixed_Cost] = useState("");

    const [initialFixedCost, setInitialFixedCost] = useState(0);

    const { id } = useParams();
    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    useEffect(() => {
        axios.get("https://special-problem.onrender.com/staff").then((response) => {
            if (response.data.Error) {
                alert(response.data.Error);
            } else {
                setStaffId(response.data.staffId);
                setLogActivity({ ...logActivity, Staff_Id: response.data.staffId });
            }
        });
    }, [logActivity]);

    useEffect(() => {
        getEquipmentById()
        // eslint-disable-next-line
    }, [])

    const getEquipmentById = async () => {
        const response = await axios.get(`https://special-problem.onrender.com/equipment-list/${id}`);
        const equipment = response.data;
        setEquipment_Id(equipment.Equipment_Id);
        setEquipment_Category_Id(equipment.Equipment_Category_Id);
        setEquipment_Name(equipment.Equipment_Name);
        setQuantity(equipment.Quantity);
        setLocation(equipment.Location);
        setPrice(equipment.Price);
        setFixed_Cost(equipment.Fixed_Cost);

        setInitialFixedCost(parseFloat(equipment.Fixed_Cost)); // Store initial Fixed_Cost value
    };

    const updateEquipment = async (e) => {
        e.preventDefault();
        const updatedFixedCost = initialFixedCost + parseFloat(Fixed_Cost);

        const response = await axios.patch(`https://special-problem.onrender.com/equipment-list/${id}`, {
            Equipment_Id,
            Equipment_Category_Id,
            Equipment_Name,
            Quantity,
            Location,
            Price,
            Fixed_Cost: updatedFixedCost, // Use the calculated updated Fixed_Cost value
        });

        const updatedLogActivity = { ...logActivity, LogActivity_Name: "Update Equipment", Equipment_Id: Equipment_Id };
        await axios.post("https://special-problem.onrender.com/log-activity", updatedLogActivity);

        if (response.data.Error) {
            alert(response.data.Error);
        } else {
            navigate("/equipment-list");
        }
    }

    return (
        <div className="container-fluid">
            <form onSubmit={updateEquipment}>

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
                    <label htmlFor="Equipment_Id" className="form-label">Equipment Id</label>
                    <input type="text" className="form-control" id="Equipment_Id" placeholder="Enter Equipment Id" required
                        onChange={(e) => {
                            setEquipment_Id(e.target.value);
                        }}
                        value={Equipment_Id}
                    />
                </div>

                <div className="mb-3">
                    <label type="text" htmlFor="Equipment_Category_Id" className="form-label">Equipment Category Id</label>
                    <input type="text" className="form-control" id="Equipment_Category_Id" placeholder="Enter Equipment Category Id" required
                        onChange={(e) => {
                            setEquipment_Category_Id(e.target.value);
                        }}
                        value={Equipment_Category_Id}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="Equipment_Name" className="form-label">Equipment Name</label>
                    <input type="text" className="form-control" id="Equipment_Name" placeholder="Enter Equipment Name" required
                        onChange={(e) => {
                            setEquipment_Name(e.target.value);
                        }}
                        value={Equipment_Name}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="Quantity" className="form-label">Quantity</label>
                    <input type="number" className="form-control" id="Quantity" placeholder="Enter Quantity" required
                        onChange={(e) => {
                            setQuantity(e.target.value);
                        }}
                        value={Quantity}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="Location" className="form-label">Location</label>
                    <input type="text" className="form-control" id="Location" placeholder="Enter Location" required
                        onChange={(e) => {
                            setLocation(e.target.value);
                        }}
                        value={Location}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="Price" className="form-label">Price</label>
                    <input type="number" className="form-control" id="Price" placeholder="Enter Price" required
                        onChange={(e) => {
                            setPrice(e.target.value);
                        }}
                        value={Price}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="Fixed_Cost" className="form-label">Fixed Cost</label>
                    <input
                        type="number"
                        className="form-control"
                        id="Fixed_Cost"
                        placeholder="Enter Fixed Cost"
                        required
                        onChange={(e) => {
                            setFixed_Cost(e.target.value);
                        }}
                    />
                </div>

                <button type="submit" className="btn btn-primary">Update</button>
            </form>
        </div>
    )
}

export default EditEquipment