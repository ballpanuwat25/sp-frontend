import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import BarcodeScanner2 from '../barcode/BarcodeScanner2';

import '../../cssElement/Table.css'
import '../../cssElement/Form.css'
import '../../cssElement/Dashboard.css'

import logo from '../../assets/logo.png';

function AddEquipment({ logout }) {
    const [staffId, setStaffId] = useState("");
    const [logActivity, setLogActivity] = useState({
        LogActivity_Name: "",
        Equipment_Id: "",
        Staff_Id: "",
    });

    const [equipment, setEquipment] = useState({
        Equipment_Id: "",
        Equipment_Category_Id: "",
        Equipment_Name: "",
        Quantity: "",
        Location: "",
        Price: "",
        Fixed_Cost: ""
    });

    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    const [scannedCode, setScannedCode] = useState("");
    const [inputValue, setInputValue] = useState("");

    useEffect(() => {
        if (scannedCode) {
            setInputValue(scannedCode);
        } else {
            setInputValue(equipment.Equipment_Id);
        }
    }, [scannedCode, equipment.Equipment_Id]);

    useEffect(() => {
        axios.get("https://special-problem.onrender.com/staff", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("staffToken")}`,
            },
        }).then((response) => {
            if (response.data.Error) {
                alert(response.data.Error);
            } else {
                setStaffId(response.data.staffId);
                setLogActivity({ ...logActivity, Staff_Id: response.data.staffId });
            }
        });
    }, [logActivity]);

    const saveEquipment = async (e) => {
        e.preventDefault();
        try {
            const { Equipment_Id } = equipment;

            const equipmentIdExists = await axios.get(`https://special-problem.onrender.com/equipment-list/${Equipment_Id}`);
            if (equipmentIdExists.data) {
                notifyWarn();
                return;
            }

            const updatedLogActivity = { ...logActivity, LogActivity_Name: "Add Equipment", Equipment_Id: Equipment_Id };
            await axios.post("https://special-problem.onrender.com/log-activity", updatedLogActivity);
            await axios.post("https://special-problem.onrender.com/equipment-list", (equipment));

            notifySuccess();
            navigate("/equipment-list");
        } catch (err) {
            console.log(err);
        }
    };

    const notifyWarn = () => toast.warn("Equipment Id already exists. Please enter a different Chem_Bottle_Id.");
    const notifySuccess = () => toast.success("Equipment added successfully");

    const handleEquipmentIdChange = (e) => {
        setEquipment({ ...equipment, Equipment_Id: e.target.value });
    };

    const handleSave = (scannedText) => {
        setScannedCode(scannedText);

        // Update inputValue and chemicals.Chem_Bottle_Id
        setInputValue(scannedText);
        setEquipment({ ...equipment, Equipment_Id: scannedText });
    };

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
        axios.get("https://special-problem.onrender.com/staff", {
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
        axios.get("https://special-problem.onrender.com/staff-logout").then((response) => {
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
            <ToastContainer />
            <div className='dashboard__container'>
                <aside className='sidebar'>
                    <div className='sidebar__header'>
                        <img src={logo} alt="logo" className='sidebar__logo' width={49} height={33} />
                        <div className='sidebar__title admin__name'>Welcome, {staffInfo.staffFirstName}</div>
                    </div>

                    <div className='sidebar__body'>
                        <Link to="/staff-dashboard/staff-chemicals-request-list" className='sidebar__item sidebar__item--hover'> <i className="fa-regular fa-clock" /> <div className='ms-1'> Request</div></Link>
                         
<Link to="/chemicals-list" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-flask" /> Chemicals</Link>
                        <Link to="/equipment-list" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-toolbox" /><div className='sidebar__item--active'> Equipment</div></Link>
                        <Link to="/chemicals-stock" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-flask-vial" /> Stock</Link>
<Link to="/approve-students-list" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-users" /> Users</Link>
                        <Link to="/staff-profile" className='sidebar__item sidebar__item--hover'> <i className="fa-regular fa-user" /> Profile</Link>
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

                    <form onSubmit={saveEquipment}>
                        <div className='mb-3 disable'>
                            <label htmlFor='Staff_Id' className='form-label'>Staff_Id</label>
                            <input type='text'
                                className="profile__input"
                                placeholder='Enter Staff Id'
                                defaultValue={staffId}
                                readOnly
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="Equipment_Id" className="profile__label">รหัสครุภัณฑ์*</label>
                            <div className="input-group">
                                <BarcodeScanner2 onSave={handleSave} />
                                <input
                                    type="text"
                                    className="form-control form-control-scan2"
                                    id="Equipment_Id"
                                    placeholder="รหัสครุภัณฑ์"
                                    required
                                    value={inputValue}
                                    onChange={handleEquipmentIdChange}
                                />
                            </div>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="Equipment_Category_Id" className="profile__label">รหัสหมวดหมู่ครุภัณฑ์*</label>
                            <input type="text" className="profile__input" id="Equipment_Category_Id" placeholder="รหัสหมวดหมู่ครุภัณฑ์" required
                                onChange={(e) => {
                                    setEquipment({ ...equipment, Equipment_Category_Id: e.target.value });
                                }}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="Equipment_Name" className="profile__label">ชื่อครุภัณฑ์*</label>
                            <input type="text" className="profile__input" id="Equipment_Name" placeholder="ชื่อครุภัณฑ์" required
                                onChange={(e) => {
                                    setEquipment({ ...equipment, Equipment_Name: e.target.value });
                                }}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="Quantity" className="profile__label">จำนวน*</label>
                            <input type="number" min="0" className="profile__input" id="Quantity" placeholder="จำนวน" required
                                onChange={(e) => {
                                    setEquipment({ ...equipment, Quantity: e.target.value });
                                }}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="Location" className="profile__label">สถานที่เก็บ</label>
                            <input type="text" className="profile__input" id="Location" placeholder="สถานที่เก็บ"
                                onChange={(e) => {
                                    setEquipment({ ...equipment, Location: e.target.value });
                                }}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="Price" className="profile__label">ราคา</label>
                            <input type="number" min="0" className="profile__input" id="Price" placeholder="ราคา"
                                onChange={(e) => {
                                    setEquipment({ ...equipment, Price: e.target.value });
                                }}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="Fixed_Cost" className="profile__label">ค่าซ่อม</label>
                            <input type="number" min="0" className="profile__input" id="Fixed_Cost" placeholder="หากยังไม่มีให้ใส่ 0"
                                onChange={(e) => {
                                    setEquipment({ ...equipment, Fixed_Cost: e.target.value });
                                }}
                            />
                        </div>

                        <button type="submit" className="table__tab table__button thai--font">ยืนยัน</button>
                    </form>
                </main>

                <footer className='footer'>
                    <Link to="/staff-dashboard/staff-chemicals-request-list" className='footer__item'> <i className="fa-regular fa-clock" /></Link>
                    <Link to="/chemicals-list" className='footer__item'> <i className="fa-solid fa-flask" /> </Link>
                    <Link to="/equipment-list" className='footer__item'> <i className="fa-solid fa-toolbox" /></Link>
                    <Link to="/chemicals-stock" className='footer__item'> <i className="fa-solid fa-flask-vial" /> </Link>
                    <div className="dropup">
                        <button type="button" className='dropdown-toggle' data-bs-toggle="dropdown" aria-expanded="false">
                            <i className="fa-solid fa-user" />
                        </button>
                        <ul className="dropdown-menu">
                            <Link to="/staff-profile" className='dropdown-menu__item dropdown-menu__item--hover'> <i className="fa-regular fa-user" /> Profile</Link>
                            <Link to="/approve-students-list" className='dropdown-menu__item dropdown-menu__item--hover'> <i className="fa-regular fa-users" /> Users</Link>
                            <button onClick={handleLogout} className='dropdown-menu__item dropdown-menu__item--hover '> <i className="fa-solid fa-arrow-right-from-bracket" /> Logout</button>
                        </ul>
                    </div>
                </footer>
            </div>
        </div>
    )
}

export default AddEquipment