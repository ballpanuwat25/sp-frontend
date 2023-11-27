import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import '../../cssElement/Table.css'
import '../../cssElement/Form.css'
import '../../cssElement/Dashboard.css'

import logo from '../../assets/logo.png';

function AddChemicalsDetail({ logout }) {
    const [chemicalsDetail, setChemicalsDetail] = useState({
        Chem_Id: "",
        Chem_Name: "",
        Chem_CAS: "",
        Chem_UN: "",
        Chem_Type: "",
        Chem_Grade: "",
        Chem_State: "",
        Chem_MSDS: "",
        Chem_GHS: "",
    });

    const navigate = useNavigate();

    const saveChemicalsDetail = async (e) => {
        e.preventDefault();
        try {
            const { Chem_Id } = chemicalsDetail;

            // Check if Chem_Id already exists
            const chemIdExists = await axios.get(process.env.REACT_APP_API + `/chemicalsDetail-list/${Chem_Id}`);
            if (chemIdExists.data) {
                notifyWarn();
                return;
            }

            await axios.post(process.env.REACT_APP_API + "/chemicalsDetail-list", chemicalsDetail);

            notifySuccess();
            navigate(" chemicalsDetail-list");
        } catch (err) {
            console.log(err);
        }
    };

    const notifyWarn = () => toast.warn("Chem_Id already exists. Please enter a different Chem_Bottle_Id.");
    const notifySuccess = () => toast.success("Chemicals added successfully");

    const [staffInfo, setStaffInfo] = useState({
        staffId: "",
        staffFirstName: "",
        staffLastName: "",
        staffUsername: "",
        staffPassword: "",
        staffTel: "",
    });

    axios.defaults.withCredentials = true;

    useEffect(() => {
        axios.get(process.env.REACT_APP_API + "/staff", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("staffToken")}`,
            },
        }).then((response) => {
            if (response.data.Error) {
                alert(response.data.Error);
            } else {
                setStaffInfo(response.data);
            }
        });
    }, []);

    const handleLogout = () => {
        axios.get(process.env.REACT_APP_API + "/staff-logout").then((response) => {
            if (response.data.Error) {
                alert(response.data.Error);
            } else {
                localStorage.removeItem('staffToken');
                navigate("/");
                logout();
            }
        });
    };

    return (
        <div className='container-fluid vh-100'>
            <ToastContainer/>
            <div className='dashboard__container'>
                <aside className='sidebar'>
                    <div className='sidebar__header'>
                        <img src={logo} alt="logo" className='sidebar__logo' width={49} height={33} />
                        <div className='sidebar__title admin__name'>Welcome, {staffInfo.staffFirstName}</div>
                    </div>

                    <div className='sidebar__body'>
                        <Link to=" staff-dashboard/staff-chemicals-request-list" className='sidebar__item sidebar__item--hover'> <i className="fa-regular fa-clock" /> <div className='ms-1'> Request</div></Link>
                        <Link to=" chemicals-list" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-flask" /> <div className='sidebar__item--active'> Chemicals</div></Link>
                        <Link to=" equipment-list" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-toolbox" />Equipment</Link>
                        <Link to=" chemicals-stock" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-flask-vial" /> Stock</Link>
<Link to=" approve-students-list" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-users" /> Users</Link>
                        <Link to=" staff-profile" className='sidebar__item sidebar__item--hover'> <i className="fa-regular fa-user" /> Profile</Link>
                    </div>

                    <div className='sidebar__footer'>
                        <button onClick={handleLogout} className='sidebar__item sidebar__item--footer sidebar__item--hover '> <i className="fa-solid fa-arrow-right-from-bracket" /> Logout</button>
                    </div>
                </aside>

                <main className='dashboard__content'>
                    <div className='component__header'>
                        <div className='component__headerGroup component__headerGroup--left'>

                        </div>

                        <div className='component__headerGroup component__headerGroup--right'>
                            <i className="fa-solid fa-circle-user" />
                            <div className='username--text thai--font'>{staffInfo.staffUsername}</div>
                        </div>
                    </div>

                    <form onSubmit={saveChemicalsDetail}>

                        <div className="mb-3">
                            <label htmlFor="Chem_Id" className="profile__label">รหัสสารเคมี*</label>
                            <input type="text" className="profile__input" id="Chem_Id" placeholder="Enter Chemicals Id" required
                                onChange={(e) => {
                                    setChemicalsDetail({ ...chemicalsDetail, Chem_Id: e.target.value });
                                }}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="Chem_Name" className="profile__label">ชื่อสารเคมี*</label>
                            <input type="text" className="profile__input" id="Chem_Name" placeholder="Enter Chemicals Name" required
                                onChange={(e) => {
                                    setChemicalsDetail({ ...chemicalsDetail, Chem_Name: e.target.value });
                                }}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="Chem_CAS" className="profile__label">CAS</label>
                            <input type="text" className="profile__input" id="Chem_CAS" placeholder="Enter Chemicals CAS"
                                onChange={(e) => {
                                    setChemicalsDetail({ ...chemicalsDetail, Chem_CAS: e.target.value });
                                }}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="Chem_UN" className="profile__label">UN</label>
                            <input type="text" className="profile__input" id="Chem_UN" placeholder="Enter Chemicals UN"
                                onChange={(e) => {
                                    setChemicalsDetail({ ...chemicalsDetail, Chem_UN: e.target.value });
                                }}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="Chem_Type" className="profile__label">Type</label>
                            <input type="text" className="profile__input" id="Chem_Type" placeholder="Enter Chemicals Type"
                                onChange={(e) => {
                                    setChemicalsDetail({ ...chemicalsDetail, Chem_Type: e.target.value });
                                }}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="Chem_Grade" className="profile__label">Grade</label>
                            <input type="text" className="profile__input" id="Chem_Grade" placeholder="Enter Chemicals Grade"
                                onChange={(e) => {
                                    setChemicalsDetail({ ...chemicalsDetail, Chem_Grade: e.target.value });
                                }}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="Chem_State" className="profile__label">State</label>
                            <input type="text" className="profile__input" id="Chem_State" placeholder="Enter Chemicals State"
                                onChange={(e) => {
                                    setChemicalsDetail({ ...chemicalsDetail, Chem_State: e.target.value });
                                }}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="Chem_MSDS" className="profile__label">MSDS</label>
                            <input type="text" className="profile__input" id="Chem_MSDS" placeholder="Enter Chemicals MSDS"
                                onChange={(e) => {
                                    setChemicalsDetail({ ...chemicalsDetail, Chem_MSDS: e.target.value });
                                }}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="Chem_GHS" className="profile__label">GHs</label>
                            <input type="text" className="profile__input" id="Chem_GHS" placeholder="Enter Chemicals GHS"
                                onChange={(e) => {
                                    setChemicalsDetail({ ...chemicalsDetail, Chem_GHS: e.target.value });
                                }}
                            />
                        </div>

                        <button type="submit" className="table__tab table__button thai--font">ยืนยัน</button>
                    </form>
                </main>

                <footer className='footer'>
                    <Link to=" staff-dashboard/staff-chemicals-request-list" className='footer__item'> <i className="fa-regular fa-clock" /></Link>
                    <Link to=" chemicals-list" className='footer__item'> <i className="fa-solid fa-flask" /> </Link>
                    <Link to=" equipment-list" className='footer__item'> <i className="fa-solid fa-toolbox" /></Link>
                    <Link to=" chemicals-stock" className='footer__item'> <i className="fa-solid fa-flask-vial" /> </Link>
                    <div className="dropup">
                        <button type="button" className='dropdown-toggle' data-bs-toggle="dropdown" aria-expanded="false">
                            <i className="fa-solid fa-user" />
                        </button>
                        <ul className="dropdown-menu">
                            <Link to=" staff-profile" className='dropdown-menu__item dropdown-menu__item--hover'> <i className="fa-regular fa-user" /> Profile</Link>
                            <Link to=" approve-students-list" className='dropdown-menu__item dropdown-menu__item--hover'> <i className="fa-regular fa-users" /> Users</Link>
                            <button onClick={handleLogout} className='dropdown-menu__item dropdown-menu__item--hover '> <i className="fa-solid fa-arrow-right-from-bracket" /> Logout</button>
                        </ul>
                    </div>
                </footer>
            </div>
        </div>
    );
}

export default AddChemicalsDetail;