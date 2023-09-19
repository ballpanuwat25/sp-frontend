import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import '../../../cssElement/Table.css'
import '../../../cssElement/Form.css'
import '../../../cssElement/Dashboard.css'

import logo from '../../../assets/logo.png';

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
            navigate("/student-dashboard/student-equipment-cart");
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

    const [studentInfo, setStudentInfo] = useState({
        studentId: "",
        studentFirstName: "",
        studentLastName: "",
        studentEmail: "",
        studentPassword: "",
        studentTel: "",
    });

    const navigate = useNavigate();

    axios.defaults.withCredentials = true;

    useEffect(() => {
        axios.get("http://localhost:3001/student", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("studentToken")}`,
            },
        }).then((response) => {
            if (response.data.Error) {
                alert(response.data.Error);
            } else {
                setStudentInfo(response.data);
            }
        });
    }, []);

    const handleLogout = () => {
        axios.get("http://localhost:3001/student-logout").then((response) => {
            if (response.data.Error) {
                alert(response.data.Error);
            } else {
                localStorage.removeItem('user_name');
                localStorage.removeItem('user_email');
                localStorage.removeItem('user_picture');
                localStorage.removeItem('studentToken');
                navigate("/");
            }
        });
    };

    return (
        <div className='container-fluid vh-100'>
            <div className='dashboard__container'>
                <aside className='sidebar'>
                    <div className='sidebar__header'>
                        <img src={logo} alt="logo" className='sidebar__logo' width={49} height={33} />
                        <div className='sidebar__title std__name'>Welcome, {studentInfo.studentFirstName}</div>
                    </div>
                    <div className='sidebar__body'>
                        <Link to="/student-dashboard/student-chemicals-list" className='sidebar__item sidebar__item--hover'> <i class="fa-solid fa-list" /> List</Link>
                        <Link to="/student-dashboard/bundle-list" className='sidebar__item sidebar__item--hover'> <i class="fa-solid fa-boxes-stacked" /> Bundle</Link>
                        <Link to="/student-dashboard/student-chemicals-cart" className='sidebar__item sidebar__item--hover'> <i class="fa-solid fa-cart-shopping" /> <div className='sidebar__item--active'>Cart</div></Link>
                        <Link to="/student-dashboard/student-chemicals-request" className='sidebar__item sidebar__item--hover'> <i class="fa-solid fa-clock-rotate-left" /> History</Link>
                        <Link to="/student-profile" className='sidebar__item sidebar__item--hover'> <i class="fa-solid fa-user" /> Profile</Link>
                    </div>
                    <div className='sidebar__footer'>
                        <button onClick={handleLogout} className='sidebar__item sidebar__item--footer sidebar__item--hover '> <i class="fa-solid fa-arrow-right-from-bracket" /> Logout</button>
                    </div>
                </aside>

                <main className='dashboard__content'>
                    {cartItems.length === 0 ? (
                        <p>Nothing in cart.</p>
                    ) : (
                        <div>
                            <div className='table-responsive'>
                                <div className='table__tabs'>
                                    <Link className='table__tab table__tab--chemicals table__tab--active'>ตระกร้าสารเคมี</Link>
                                    <Link to="/student-dashboard/student-equipment-cart" className='table__tab table__tab--equipment table__tab--unactive'>ตระกร้าครุภัณฑ์</Link>
                                </div>
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
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cartItems.map((item, index) => (
                                            <tr key={index}>
                                                <td>
                                                    <input
                                                        type="text"
                                                        className='table__form'
                                                        value={item.Student_Id}
                                                        readOnly
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        className='table__form'
                                                        value={item.Chem_Id}
                                                        readOnly
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        className='table__form table__form--input'
                                                        value={item.Requested_Quantity}
                                                        onChange={(e) =>
                                                            handleChange(index, 'Requested_Quantity', e.target.value)
                                                        }
                                                    />
                                                </td>
                                                <td>
                                                    <select
                                                        className='thai--font'
                                                        value={item.Counting_Unit}
                                                        onChange={(e) => handleChange(index, 'Counting_Unit', e.target.value)}
                                                        required
                                                    >
                                                        <option value="">Select</option>
                                                        <option value="g">กรัม</option>
                                                        <option value="ml">มิลลิลิตร</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        className='table__form table__form--input'
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
                                                        className='table__form table__form--input'
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
                                                        className='table__form table__form--input'
                                                        value={item.Teacher_Id}
                                                        onChange={(e) =>
                                                            handleChange(index, 'Teacher_Id', e.target.value)
                                                        }
                                                    />
                                                </td>
                                                <td>
                                                    <button
                                                        type="button"
                                                        className="btn btn-danger thai--font"
                                                        onClick={() => removeCartItem(index)}
                                                    >
                                                        <i class="fa-solid fa-square-minus"></i>
                                                        นำออกจากตระกร้า
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <button className="table__tab table__button thai--font" type="button" onClick={sendChemicalsRequest}>
                                ยืนยันการขอเบิกสารเคมี
                            </button>
                        </div>
                    )}
                </main>

                <footer className='footer'>
                    <Link to="/student-dashboard/student-chemicals-list" className='footer__item'> <i class="fa-solid fa-list" /></Link>
                    <Link to="/student-dashboard/bundle-list" className='footer__item'> <i class="fa-solid fa-boxes-stacked" /></Link>
                    <Link to="/student-dashboard/student-chemicals-cart" className='footer__item'> <i class="fa-solid fa-cart-shopping" /></Link>
                    <Link to="/student-dashboard/student-chemicals-request" className='footer__item'> <i class="fa-solid fa-clock-rotate-left" /></Link>
                    <div className="dropup">
                        <button type="button" className='dropdown-toggle' data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="fa-solid fa-user" />
                        </button>
                        <ul class="dropdown-menu">
                            <Link to="/student-profile" className='dropdown-menu__item dropdown-menu__item--hover'> <i class="fa-solid fa-user" /> Profile</Link>
                            <button onClick={handleLogout} className='dropdown-menu__item dropdown-menu__item--hover '> <i class="fa-solid fa-arrow-right-from-bracket" /> Logout</button>
                        </ul>
                    </div>
                </footer>
            </div>
        </div>
    );
}

export default StudentChemicalsCart;