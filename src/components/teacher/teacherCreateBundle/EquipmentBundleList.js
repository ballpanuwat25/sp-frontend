import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import '../../cssElement/Table.css'
import '../../cssElement/Form.css'
import '../../cssElement/Dashboard.css'

import logo from '../../assets/logo.png';

function EquipmentBundleList({ logout }) {
    const [teacherInfo, setTeacherInfo] = useState({
        teacherId: "",
        teacherFirstName: "",
        teacherLastName: "",
        teacherUsername: "",
        teacherPassword: "",
        teacherTel: "",
    });

    const [bundle, setBundle] = useState({
        Teacher_Id: "",
        Equipment_Id: "",
    });

    const [equipment, setEquipment] = useState([]);

    const [searchQuery, setSearchQuery] = useState("");
    const [filteredEquipment, setFilteredEquipment] = useState([]);

    const [selectedEquipmentId, setSelectedEquipmentId] = useState(null);

    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    useEffect(() => {
        setFilteredEquipment(equipment);
    }, [equipment]);

    useEffect(() => {
        getEquipment();

        axios.get(process.env.REACT_APP_API + "/teacher", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("teacherToken")}`,
            },
        }).then((response) => {
            if (response.data.Error) {
                alert(response.data.Error);
            } else {
                setTeacherInfo(response.data);
                setBundle({
                    ...bundle,
                    Teacher_Id: response.data.teacherId,
                    Equipment_Id: selectedEquipmentId,
                });
            }
        });
    }, []);

    const getEquipment = async () => {
        const response = await axios.get(process.env.REACT_APP_API + "/equipment-list");
        setEquipment(response.data);
        setIsLoading(false);
    }

    const addToCart = (Equipment_Id) => {
        const cartData = JSON.parse(localStorage.getItem('bundleCart')) || [];

        const existingEquipment = cartData.find(item => item.Teacher_Id === teacherInfo.teacherId && item.Equipment_Id === Equipment_Id);

        if (existingEquipment) {
            notify();
        } else {
            cartData.push({
                Teacher_Id: teacherInfo.teacherId,
                Equipment_Id,
            });
        }

        localStorage.setItem('bundleCart', JSON.stringify(cartData));
    };

    const notify = () => toast.warn("This equipment is already in your cart");

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        filterEquipment(e.target.value);
    };

    const filterEquipment = (searchQuery) => {
        const filteredEquipment = equipment.filter((equipment) => {
            return equipment.Equipment_Name.toLowerCase().includes(searchQuery.toLowerCase());
        });
        setFilteredEquipment(filteredEquipment);
    }

    const handleLogout = () => {
        axios.get(process.env.REACT_APP_API + "/teacher-logout").then((response) => {
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
            <ToastContainer />
            <div className='dashboard__container'>
                <aside className='sidebar'>
                    <div className='sidebar__header'>
                        <img src={logo} alt="logo" className='sidebar__logo' width={49} height={33} />
                        <div className='sidebar__title admin__name'>Welcome, {teacherInfo.teacherFirstName}</div>
                    </div>
                    <div className='sidebar__body'>
                        <Link to=" teacher-dashboard/teacher-chemicals-request" className='sidebar__item sidebar__item--hover'> <i className="fa-regular fa-clock" /> <div className="ms-1">Request</div></Link>
                        <Link to=" teacher-dashboard/chemicals-bundle-list" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-list" /> <div className='sidebar__item--active'>List</div></Link>
                        <Link to=" teacher-dashboard/bundle-list" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-boxes-stacked" /> Bundle</Link>
                        <Link to=" teacher-profile" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-user" /> Profile</Link>
                    </div>
                    <div className='sidebar__footer'>
                        <button onClick={handleLogout} className='sidebar__item sidebar__item--footer sidebar__item--hover '> <i className="fa-solid fa-arrow-right-from-bracket" /> Logout</button>
                    </div>
                </aside>

                <main className='dashboard__content'>
                    {isLoading ? (
                        <div className="spinner-border text-success" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    ) : (
                        <div>
                            <div className='component__header'>
                                <div className='component__headerGroup component__headerGroup--left'>
                                    <i className='fa-solid fa-magnifying-glass'></i>
                                    <input
                                        type="search"
                                        className='component__search'
                                        placeholder="ค้นหาด้วยชื่อ"
                                        value={searchQuery}
                                        onChange={handleSearch}
                                    />
                                </div>

                                <div className='component__headerGroup component__headerGroup--right'>
                                    <i className="fa-solid fa-circle-user" />
                                    <div className='username--text thai--font'>{teacherInfo.teacherUsername}</div>
                                </div>
                            </div>

                            <div >
                                <div className='table__tabs'>
                                    <Link to=" teacher-dashboard/chemicals-bundle-list" className='table__tab table__tab--chemicals table__tab--unactive'>รายการสารเคมี</Link>
                                    <Link className='table__tab table__tab--equipment table__tab--active'>รายการครุภัณฑ์</Link>
                                </div>

                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Equipment Name</th>
                                            <th scope="col">Equipment Category Id</th>
                                            <th scope="col"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredEquipment.map((equipment, index) => (
                                            <tr key={index} className="active-row">
                                                <td> {index + 1} </td>
                                                <td> {equipment.Equipment_Name} </td>
                                                <td> {equipment.Equipment_Category_Id} </td>
                                                <td>
                                                    <button className="table__button thai--font" onClick={() => addToCart(equipment.Equipment_Id)}>
                                                        <i className="fa-solid fa-circle-plus" />
                                                        เพิ่มครุภัณฑ์
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </main>

                <footer className='footer'>
                    <Link to=" teacher-dashboard/teacher-chemicals-request" className='footer__item'> <i className="fa-regular fa-clock" /></Link>
                    <Link to=" teacher-dashboard/chemicals-bundle-list" className='footer__item'> <i className="fa-solid fa-list" /></Link>
                    <Link to=" teacher-dashboard/bundle-list" className='footer__item'> <i className="fa-solid fa-boxes-stacked" /></Link>
                    <div className="dropup">
                        <button type="button" className='dropdown-toggle' data-bs-toggle="dropdown" aria-expanded="false">
                            <i className="fa-solid fa-user" />
                        </button>
                        <ul className="dropdown-menu">
                            <Link to=" teacher-profile" className='dropdown-menu__item dropdown-menu__item--hover'> <i className="fa-solid fa-user" /> Profile</Link>
                            <button onClick={handleLogout} className='dropdown-menu__item dropdown-menu__item--hover '> <i className="fa-solid fa-arrow-right-from-bracket" /> Logout</button>
                        </ul>
                    </div>
                </footer>
            </div>
        </div>
    )
}

export default EquipmentBundleList
