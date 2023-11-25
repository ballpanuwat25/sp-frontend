import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import '../../../cssElement/Table.css'
import '../../../cssElement/Form.css'
import '../../../cssElement/Dashboard.css'

import logo from '../../../assets/logo.png';

function StudentEquipmentCart() {
    const cartData = JSON.parse(localStorage.getItem('equipmentCart')) || [];
    const [equipmentRequest, setEquipmentRequest] = useState({
        Student_Id: "",
        Equip_Id: "",
        Requested_Quantity: "",
        Counting_Unit: "",
        Request_Purpose: "",
        Request_Room: "",
        Teacher_Id: "",
        Request_Status: "Pending",
    });

    const [cartItems, setCartItems] = useState(cartData);
    const [equipment, setEquipment] = useState([]);

    useEffect(() => {
        getEquipment();
    }, []);

    const handleChange = (index, key, value) => {
        const updatedCartItems = [...cartItems];
        updatedCartItems[index][key] = value;
        setCartItems(updatedCartItems);
    };

    const sendEquipmentRequest = async (e) => {
        e.preventDefault();
    
        try {
            for (const item of cartItems) {
                const requestData = {
                    ...equipmentRequest,
                    Student_Id: item.Student_Id,
                    Equipment_Id: item.Equipment_Id,
                    Requested_Quantity: item.Requested_Quantity,
                    Request_Purpose: item.Request_Purpose,
                    Request_Room: item.Request_Room,
                    Teacher_Id: item.Teacher_Id,
                };
                await axios.post(process.env.REACT_APP_API + "/equipment-request-list", requestData);
            }
    
            // Move these lines inside the try block
            console.log('Equipment request sent successfully!');
            // Clear localStorage
            localStorage.removeItem('equipmentCart');
    
            // Redirect to the student dashboard or any other page
            navigate("/chem/student-dashboard/student-chemicals-request");
        } catch (err) {
            console.log('Error:', err);
    
            // Check if the server responded with an error message
            if (err.response && err.response.data) {
                console.log('Server Error Message:', err.response.data);
            }
    
            // You may want to rethrow the error here if needed
            throw err;
        }
    }    

    const removeCartItem = (index) => {
        const updatedCartItems = [...cartItems];
        updatedCartItems.splice(index, 1);
        setCartItems(updatedCartItems);
        localStorage.setItem('equipmentCart', JSON.stringify(updatedCartItems)); // Update localStorage
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
        axios.get(process.env.REACT_APP_API + "/student", {
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

    const user_picture = localStorage.getItem('user_picture') ? <img src={localStorage.getItem('user_picture')} alt="user" className='user__avatar' /> : <i className="fa-solid fa-circle-user" />;
    const user_email = localStorage.getItem('user_email') ? <div className='user__email'>{localStorage.getItem('user_email')}</div> : <div className='user__email'>{studentInfo.studentEmail}</div>;

    const handleLogout = () => {
        axios.get(process.env.REACT_APP_API + "/student-logout").then((response) => {
            if (response.data.Error) {
                alert(response.data.Error);
            } else {
                localStorage.removeItem('user_name');
                localStorage.removeItem('user_email');
                localStorage.removeItem('user_picture');
                localStorage.removeItem('studentToken');
                navigate("/chem");
            }
        });
    };

    const getEquipment = async () => {
        const response = await axios.get(process.env.REACT_APP_API + "/equipment-list");
        setEquipment(response.data);
    }

    const getEquipmentNameById = (equipmentId) => {
        const equipmentDetail = equipment.find((equipment) => equipment.Equipment_Id === equipmentId);
        return equipmentDetail ? equipmentDetail.Equipment_Name : "N/A";
    };

    return (
        <div className='container-fluid vh-100'>
            <div className='dashboard__container'>
                <aside className='sidebar'>
                    <div className='sidebar__header'>
                        <img src={logo} alt="logo" className='sidebar__logo' width={49} height={33} />
                        <div className='sidebar__title std__name thai--font'>Welcome, {studentInfo.studentFirstName}</div>
                    </div>
                    <div className='sidebar__body'>
                        <Link to="/chem/student-dashboard/student-chemicals-list" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-list" /> List</Link>
                        <Link to="/chem/student-dashboard/bundle-list" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-boxes-stacked" /> Bundle</Link>
                        <Link to="/chem/student-dashboard/student-chemicals-cart" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-cart-shopping" /> <div className='sidebar__item--active'>Cart</div></Link>
                        <Link to="/chem/student-dashboard/student-chemicals-request" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-clock-rotate-left" /> History</Link>
                        <Link to="/chem/student-profile" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-user" /> Profile</Link>
                        <Link to="/chem/student-dashboard/student-view-teacher" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-users" /> Teacher</Link>
                    </div>
                    <div className='sidebar__footer'>
                        <button onClick={handleLogout} className='sidebar__item sidebar__item--footer sidebar__item--hover '> <i className="fa-solid fa-arrow-right-from-bracket" /> Logout</button>
                    </div>
                </aside>

                <main className='dashboard__content'>
                    <div>
                        <div className='component__header'>
                            <div className='component__headerGroup component__headerGroup--left' />

                            <div className='component__headerGroup component__headerGroup--right'>
                                <div>{user_picture}</div>
                                <div>{user_email}</div>
                            </div>
                        </div>
                        <div >
                            <div className='table__tabs'>
                                <Link to="/chem/student-dashboard/student-chemicals-cart" className='table__tab table__tab--chemicals table__tab--unactive'>ตระกร้าสารเคมี</Link>
                                <Link className='table__tab table__tab--equipment table__tab--active'>ตระกร้าครุภัณฑ์</Link>
                            </div>

                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>รหัสนิสิต</th>
                                        <th>ครุภัณฑ์</th>
                                        <th>ปริมาณที่ขอ</th>
                                        <th>วัตถุประสงค์</th>
                                        <th>ห้องที่ใช้</th>
                                        <th>รหัสอาจารย์</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                {cartItems.length === 0 ? (
                                    <p>Nothing in cart.</p>
                                ) : (
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
                                                        value={getEquipmentNameById(item.Equipment_Id)}
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
                                                        <i className="fa-solid fa-square-minus"></i>
                                                        นำออกจากตระกร้า
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                )}
                            </table>
                        </div>
                        <button className="table__tab table__button thai--font floating-button" type="button" onClick={sendEquipmentRequest}>
                            ยืนยันการขอเบิกครุภัณฑ์
                        </button>
                    </div>
                </main>

                <footer className='footer'>
                    <Link to="/chem/student-dashboard/student-chemicals-list" className='footer__item'> <i className="fa-solid fa-list" /></Link>
                    <Link to="/chem/student-dashboard/bundle-list" className='footer__item'> <i className="fa-solid fa-boxes-stacked" /></Link>
                    <Link to="/chem/student-dashboard/student-chemicals-cart" className='footer__item'> <i className="fa-solid fa-cart-shopping" /></Link>
                    <Link to="/chem/student-dashboard/student-chemicals-request" className='footer__item'> <i className="fa-solid fa-clock-rotate-left" /></Link>
                    <div className="dropup">
                        <button type="button" className='dropdown-toggle' data-bs-toggle="dropdown" aria-expanded="false">
                            <i className="fa-solid fa-user" />
                        </button>
                        <ul className="dropdown-menu">
                            <Link to="/chem/student-profile" className='dropdown-menu__item dropdown-menu__item--hover'> <i className="fa-solid fa-user" /> Profile</Link>
                            <Link to="/chem/student-dashboard/student-view-teacher" className='dropdown-menu__item dropdown-menu__item--hover'> <i className="fa-solid fa-users" /> Teacher</Link>
                            <button onClick={handleLogout} className='dropdown-menu__item dropdown-menu__item--hover '> <i className="fa-solid fa-arrow-right-from-bracket" /> Logout</button>
                        </ul>
                    </div>
                </footer>
            </div>
        </div>
    );
}

export default StudentEquipmentCart;