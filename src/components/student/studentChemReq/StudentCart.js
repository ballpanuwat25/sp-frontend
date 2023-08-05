import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function StudentCart() {
    const cartData = JSON.parse(localStorage.getItem('cart')) || [];
    const [chemicalsRequest, setChemicalsRequest] = useState({
        Student_Id: "",
        Chem_Id: "",
        Requested_Quantity: "",
        Counting_Unit: "",
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
                };
                await axios.post("http://localhost:3001/chemicals-request-list", requestData);
            }

            // Clear localStorage
            localStorage.removeItem('cart');

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

    return (
        <div className="container">
            <h2>Student Cart</h2>
            <form onSubmit={sendChemicalsRequest}>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Student Id</th>
                            <th>Chemicals Id</th>
                            <th>Requested Quantity</th>
                            <th>Counting Unit</th>
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
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={item.Counting_Unit}
                                        onChange={(e) =>
                                            handleChange(index, 'Counting_Unit', e.target.value)
                                        }
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button type="submit" className="btn btn-primary">
                    Save Changes
                </button>
            </form>
        </div>
    );
}

export default StudentCart;