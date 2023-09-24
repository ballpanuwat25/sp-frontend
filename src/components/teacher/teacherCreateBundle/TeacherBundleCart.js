import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import '../../cssElement/Table.css'
import '../../cssElement/Form.css'
import '../../cssElement/Dashboard.css'

import logo from '../../assets/logo.png';

function TeacherBundleCart({ logout }) {
    const cartData = JSON.parse(localStorage.getItem('bundleCart')) || [];
    const [bundle, setBundle] = useState({
        Bundle_Name: "",
        Bundle_Description: "",
        Chem_Id: "",
        Equipment_Id: "",
        Requested_Quantity: "",
        Counting_Unit: "",
        Request_Purpose: "",
        Request_Room: "",
        Teacher_Id: "",
    });

    const [bundleName, setBundleName] = useState(""); // State for Bundle Name
    const [bundleDescription, setBundleDescription] = useState(""); // State for Bundle Description
    const [bundlePurpose, setBundlePurpose] = useState(""); // State for Bundle Purpose
    const [bundleRoom, setBundleRoom] = useState(""); // State for Bundle Room

    const navigate = useNavigate();

    const [cartItems, setCartItems] = useState(cartData);

    const handleChange = (index, key, value) => {
        const updatedCartItems = [...cartItems];
        updatedCartItems[index][key] = value;
        setCartItems(updatedCartItems);
    };

    const createBundle = async (e) => {
        e.preventDefault();
        try {
            for (const item of cartItems) {
                const requestData = {
                    ...bundle,
                    Bundle_Name: bundleName, // Use bundleName for all items
                    Bundle_Description: bundleDescription, // Use bundleDescription for all items
                    Chem_Id: item.Chem_Id,
                    Equipment_Id: item.Equipment_Id,
                    Requested_Quantity: item.Requested_Quantity,
                    Counting_Unit: item.Counting_Unit,
                    Request_Purpose: bundlePurpose, // Use bundlePurpose for all items
                    Request_Room: bundleRoom, // Use bundleRoom for all items
                    Teacher_Id: item.Teacher_Id,
                };
                await axios.post("http://localhost:3001/bundle-list", requestData);
            }

            localStorage.removeItem('bundleCart');

            navigate("/teacher-dashboard");
        } catch (err) {
            console.log('Error:', err);

            if (err.response && err.response.data) {
                console.log('Server Error Message:', err.response.data);
            }
        }
    };

    const removeCartItem = (index) => {
        const updatedCartItems = [...cartItems];
        updatedCartItems.splice(index, 1);
        setCartItems(updatedCartItems);
        localStorage.setItem('bundleCart', JSON.stringify(updatedCartItems));
    };

    const [teacherInfo, setTeacherInfo] = useState({
        teacherId: "",
        teacherFirstName: "",
        teacherLastName: "",
        teacherUsername: "",
        teacherPassword: "",
        teacherTel: "",
    });

    useEffect(() => {
        axios.get("http://localhost:3001/teacher", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("teacherToken")}`,
            },
        }).then((response) => {
            if (response.data.Error) {
                alert(response.data.Error);
            } else {
                setTeacherInfo(response.data);
            }
        });
    }, []);

    axios.defaults.withCredentials = true;

    const handleLogout = () => {
        axios.get("http://localhost:3001/teacher-logout").then((response) => {
            if (response.data.Error) {
                alert(response.data.Error);
            } else {
                logout();
                localStorage.removeItem('teacherToken');
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
                        <div className='sidebar__title admin__name'>Welcome, {teacherInfo.teacherFirstName}</div>
                    </div>
                    <div className='sidebar__body'>
                        <Link to="/teacher-dashboard/teacher-chemicals-request" className='sidebar__item sidebar__item--hover'> <i class="fa-regular fa-clock" /> <div className="ms-1">Request</div></Link>
                        <Link to="/teacher-dashboard/chemicals-bundle-list" className='sidebar__item sidebar__item--hover'> <i class="fa-solid fa-list" /> List</Link>
                        <Link to="/teacher-dashboard/bundle-list" className='sidebar__item sidebar__item--hover'> <i class="fa-solid fa-boxes-stacked" /> <div className='sidebar__item--active'>Bundle</div></Link>
                        <Link to="/teacher-profile" className='sidebar__item sidebar__item--hover'> <i class="fa-solid fa-user" /> Profile</Link>
                    </div>
                    <div className='sidebar__footer'>
                        <button onClick={handleLogout} className='sidebar__item sidebar__item--footer sidebar__item--hover '> <i class="fa-solid fa-arrow-right-from-bracket" /> Logout</button>
                    </div>
                </aside>

                <main className='dashboard__content'>
                    <div className='component__header'>
                        <div className='component__headerGroup component__headerGroup--left' />

                        <div className='component__headerGroup component__headerGroup--right'>
                            <i class="fa-solid fa-circle-user" />
                            <div className='username--text thai--font'>{teacherInfo.teacherUsername}</div>
                        </div>
                    </div>

                    {cartItems && cartItems.length === 0 ? (
                        <p>Nothing in bundle. Please Select item into bundle before.</p>
                    ) : (

                        <form onSubmit={createBundle}>
                            <div className="mb-3">
                                <label className='profile__label'>ชื่อ Bundle* :</label>
                                <input
                                    type="text"
                                    name="Bundle_Name"
                                    onChange={(e) => setBundleName(e.target.value)}
                                    value={bundleName}
                                    className='profile__input'
                                    placeholder='เช่น ชุดทดลองที่ 1'
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className='profile__label'>รายละเอียด Bundle :</label>
                                <input
                                    type="text"
                                    name="Bundle_Description"
                                    onChange={(e) => setBundleDescription(e.target.value)}
                                    value={bundleDescription}
                                    className='profile__input'
                                    placeholder='เช่น ชุดทดลองที่ใช้ในการทดลองเรื่อง...'
                                />
                            </div>

                            <div className="mb-3">
                                <label className='profile__label'>วัตถุประสงค์* :</label>
                                <input
                                    type="text"
                                    name="Bundle_Purpose"
                                    onChange={(e) => setBundlePurpose(e.target.value)}
                                    value={bundlePurpose}
                                    className='profile__input'
                                    placeholder='เช่น สำหรับการทดลองในรายวิชา...'
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className='profile__label'>ใช้ที่ห้อง* :</label>
                                <input
                                    type="text"
                                    name="Bundle_Room"
                                    onChange={(e) => setBundleRoom(e.target.value)}
                                    value={bundleRoom}
                                    className='profile__input'
                                    placeholder='เช่น ห้องปฏิบัติการวิทยาศาสตร์ ชั้น 2'
                                    required
                                />
                            </div> <hr />

                            <div>
                                <div className='table__tabs'>
                                    <Link className='table__tab table__tab--chemicals table__tab--active'>สร้าง Bundle</Link>
                                </div>

                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>รหัสอาจารย์</th>
                                            <th>รหัสสารเคมี</th>
                                            <th>ปริมาณสาร</th>
                                            <th>หน่วยนับ</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cartItems.map((item, index) => (
                                            <tr key={index} className="active-row">
                                                <td>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={item.Teacher_Id}
                                                        readOnly
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={item.Chem_Id || item.Equipment_Id}
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
                                                        <option value="pcs">pcs</option>
                                                        <option value="g">g</option>
                                                        <option value="ml">ml</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <button
                                                        type="button"
                                                        className="btn btn-danger thai--font"
                                                        onClick={() => removeCartItem(index)}
                                                    >
                                                        <i class="fa-solid fa-square-minus"></i>
                                                        นำออกจาก Bundle
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <button type="submit" className="table__tab table__button thai--font">
                                สร้าง Bundle
                            </button>
                        </form>
                    )}
                </main>

                <footer className='footer'>
                    <Link to="/teacher-dashboard/teacher-chemicals-request" className='footer__item'> <i class="fa-regular fa-clock" /></Link>
                    <Link to="/teacher-dashboard/chemicals-bundle-list" className='footer__item'> <i class="fa-solid fa-list" /></Link>
                    <Link to="/teacher-dashboard/bundle-list" className='footer__item'> <i class="fa-solid fa-boxes-stacked" /></Link>
                    <div className="dropup">
                        <button type="button" className='dropdown-toggle' data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="fa-solid fa-user" />
                        </button>
                        <ul class="dropdown-menu">
                            <Link to="/teacher-profile" className='dropdown-menu__item dropdown-menu__item--hover'> <i class="fa-solid fa-user" /> Profile</Link>
                            <button onClick={handleLogout} className='dropdown-menu__item dropdown-menu__item--hover '> <i class="fa-solid fa-arrow-right-from-bracket" /> Logout</button>
                        </ul>
                    </div>
                </footer>
            </div>
        </div>
    )
}

export default TeacherBundleCart
