import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditChemicals() {
    const [Chem_Bottle_Id, setChem_Bottle_Id] = useState("");
    const [Chem_Id, setChem_Id] = useState("");
    const [Package_Size, setPackage_Size] = useState("");
    const [Remaining_Quantity, setRemaining_Quantity] = useState("");
    const [Counting_Unit, setCounting_Unit] = useState("");
    const [Location, setLocation] = useState("");
    const [Price, setPrice] = useState("");
    
    const { id } = useParams();
    
    const navigate = useNavigate();
    
    useEffect(() => {
        getChemicalsById()
        // eslint-disable-next-line
    }, [])

    const getChemicalsById = async () => {
        const response = await axios.get(`http://localhost:3001/chemicals-list/${id}`);
        const chemicals = response.data;
        setChem_Bottle_Id(chemicals.Chem_Bottle_Id);
        setChem_Id(chemicals.Chem_Id);
        setPackage_Size(chemicals.Package_Size);
        setRemaining_Quantity(chemicals.Remaining_Quantity);
        setCounting_Unit(chemicals.Counting_Unit);
        setLocation(chemicals.Location);
        setPrice(chemicals.Price);
    }

    const updateChemicals = async (e) => {
        e.preventDefault();
        const response = await axios.patch(`http://localhost:3001/chemicals-list/${id}`, {
            Chem_Bottle_Id,
            Chem_Id,
            Package_Size,
            Remaining_Quantity,
            Counting_Unit,
            Location,
            Price,
        });
        if (response.data.Error) {
            alert(response.data.Error);
        } else {
            navigate("/chemicals-list");
        }
    }

    return (
        <div className="container-fluid">
            <form onSubmit={updateChemicals}>
                <div className="mb-3">
                    <label htmlFor="Chem_Bottle_Id" className="form-label">Chemicals Bottle Id</label>
                    <input type="text" className="form-control" id="Chem_Bottle_Id" placeholder="Enter Chemicals Bottle Id" required
                        value={Chem_Bottle_Id}
                        onChange={(e) => {
                            setChem_Bottle_Id(e.target.value);
                        }}
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
                    <label htmlFor="Package_Size" className="form-label">Package Size</label>
                    <input type="number" className="form-control" id="Package_Size" placeholder="Enter Package Size" required
                        value={Package_Size}
                        onChange={(e) => {
                            setPackage_Size(e.target.value);
                        }}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="Remaining_Quantity" className="form-label">Remaining Quantity</label>
                    <input type="number" className="form-control" id="Remaining_Quantity" placeholder="Enter Remaining Quantity" required
                        value={Remaining_Quantity}
                        onChange={(e) => {
                            setRemaining_Quantity(e.target.value);
                        }}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="Counting_Unit" className="form-label">Counting Unit</label>
                    <input type="text" className="form-control" id="Counting_Unit" placeholder="Enter Counting Unit" required
                        value={Counting_Unit}
                        onChange={(e) => {
                            setCounting_Unit(e.target.value);
                        }}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="Location" className="form-label">Location</label>
                    <input type="text" className="form-control" id="Location" placeholder="Enter Location" required
                        value={Location}
                        onChange={(e) => {
                            setLocation(e.target.value);
                        }}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="Price" className="form-label">Price</label>
                    <input type="number" className="form-control" id="Price" placeholder="Enter Price" required
                        value={Price}
                        onChange={(e) => {
                            setPrice(e.target.value);
                        }}
                    />
                </div>

                <button type="submit" className="btn btn-primary">Update</button>
            </form>
        </div>
    )
}

export default EditChemicals