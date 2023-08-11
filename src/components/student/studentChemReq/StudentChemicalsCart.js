import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function StudentChemicalsCart() {
    const cartData = JSON.parse(localStorage.getItem('chemicalsCart')) || [];
    const [chemicalsRequest, setChemicalsRequest] = useState({
        Student_Id: "",
        Chem_Id: "",
        Requested_Quantity: "",
        Counting_Unit: "",
        Request_Purpose: "",
        Request_Room: "",
        Teacher_Id: "",
        Request_Status: "Pending",
    });

    const navigate = useNavigate();

    const [cartItems, setCartItems] = useState(cartData);

    const handleChange = (index, key, value) => {
        const updatedCartItems = [...cartItems];
        updatedCartItems[index][key] = value;
        setCartItems(updatedCartItems);
    };

    const sendChemicalsRequest = async (e) => {
        e.preventDefault();
        try {
            // Log each attribute separately
            for (const item of cartItems) {
                const requestData = {
                    ...chemicalsRequest,
                    Student_Id: item.Student_Id,
                    Chem_Id: item.Chem_Id,
                    Requested_Quantity: item.Requested_Quantity,
                    Counting_Unit: item.Counting_Unit,
                    Request_Purpose: item.Request_Purpose,
                    Request_Room: item.Request_Room,
                    Teacher_Id: item.Teacher_Id,
                };
                await axios.post("http://localhost:3001/chemicals-request-list", requestData);
            }

            // Clear localStorage
            localStorage.removeItem('chemicalsCart');

            // Redirect to the student dashboard or any other page
            navigate("/student-dashboard");
        } catch (err) {
            console.log('Error:', err);

            // Check if the server responded with an error message
            if (err.response && err.response.data) {
                console.log('Server Error Message:', err.response.data);
            }
        }
    };

    const removeCartItem = (index) => {
        const updatedCartItems = [...cartItems];
        updatedCartItems.splice(index, 1);
        setCartItems(updatedCartItems);
        localStorage.setItem('chemicalsCart', JSON.stringify(updatedCartItems)); // Update localStorage
    };


    return (
        <div className="container">
            <h2>Student Cart</h2>
            {cartItems.length === 0 ? (
                <p>Nothing in cart.</p>
            ) : (
                <form onSubmit={sendChemicalsRequest}>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Student Id</th>
                                <th>Chemicals Id</th>
                                <th>Requested Quantity</th>
                                <th>Counting Unit</th>
                                <th>Request Purpose</th>
                                <th>Request Room</th>
                                <th>Teacher Id</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map((item, index) => (
                                <tr key={index}>
                                    <td>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={item.Student_Id}
                                            readOnly
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={item.Chem_Id}
                                            readOnly
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={item.Requested_Quantity}
                                            onChange={(e) =>
                                                handleChange(index, 'Requested_Quantity', e.target.value)
                                            }
                                        />
                                    </td>
                                    <td>
                                        <select
                                            className="form-control"
                                            value={item.Counting_Unit}
                                            onChange={(e) => handleChange(index, 'Counting_Unit', e.target.value)}
                                            required
                                        >
                                            <option value="">Select counting unit</option>
                                            <option value="g">g</option>
                                            <option value="ml">ml</option>
                                        </select>
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={item.Request_Purpose}
                                            onChange={(e) =>
                                                handleChange(index, 'Request_Purpose', e.target.value)
                                            }
                                            required
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={item.Request_Room}
                                            onChange={(e) =>
                                                handleChange(index, 'Request_Room', e.target.value)
                                            }
                                            required
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={item.Teacher_Id}
                                            onChange={(e) =>
                                                handleChange(index, 'Teacher_Id', e.target.value)
                                            }
                                        />
                                    </td>
                                    <td>
                                        <button
                                            type="button"
                                            className="btn btn-danger"
                                            onClick={() => removeCartItem(index)}
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button type="submit" className="btn btn-primary">
                        Save Changes
                    </button>
                </form>
            )}
        </div>
    );
}

export default StudentChemicalsCart;