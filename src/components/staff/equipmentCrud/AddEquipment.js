import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import '../../cssElement/Table.css'
import '../../cssElement/Form.css'
import '../../cssElement/Dashboard.css'

import logo from '../../assets/logo.png';

function AddEquipment() {
    const [staffId, setStaffId] = useState("");
    const [logActivity, setLogActivity] = useState({
        LogActivity_Id: "",
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

    useEffect(() => {
        axios.get("http://localhost:3001/staff", {
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

            const equipmentIdExists = await axios.get(`http://localhost:3001/equipment-list/${Equipment_Id}`);
            if (equipmentIdExists.data) {
                alert("Equipment Id already exists. Please enter a different Equipment Id.");
                return;
            }

            const updatedLogActivity = { ...logActivity, LogActivity_Name: "Add Equipment", Equipment_Id: Equipment_Id };
            await axios.post("http://localhost:3001/log-activity", updatedLogActivity);
            await axios.post("http://localhost:3001/equipment-list", (equipment));

            alert("Equipment added successfully");
            navigate("/equipment-list");
        } catch (err) {
            console.log(err);
        }
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
        axios.get("http://localhost:3001/staff", {
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
        axios.get("http://localhost:3001/staff-logout").then((response) => {
            if (response.data.Error) {
                alert(response.data.Error);
            } else {
                localStorage.removeItem('staffToken');
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
                        <div className='sidebar__title admin__name'>Welcome, {staffInfo.staffFirstName}</div>
                    </div>

                    <div className='sidebar__body'>
                        <Link to="/staff-dashboard/staff-chemicals-request-list" className='sidebar__item sidebar__item--hover'> <i class="fa-regular fa-clock" /> <div className='ms-1'> Request</div></Link>
                        <Link to="/chemicals-list" className='sidebar__item sidebar__item--hover'> <i class="fa-solid fa-flask" /> Chemicals</Link>
                        <Link to="/equipment-list" className='sidebar__item sidebar__item--hover'> <i class="fa-solid fa-toolbox" /><div className='sidebar__item--active'> Equipment</div></Link>
                        <Link to="/chemicals-stock" className='sidebar__item sidebar__item--hover'> <i class="fa-solid fa-flask-vial" /> Stock</Link>
                        <Link to="/staff-profile" className='sidebar__item sidebar__item--hover'> <i class="fa-regular fa-user" /> Profile</Link>
                    </div>

                    <div className='sidebar__footer'>
                        <button onClick={handleLogout} className='sidebar__item sidebar__item--footer sidebar__item--hover '> <i class="fa-solid fa-arrow-right-from-bracket" /> Logout</button>
                    </div>
                </aside>

                <main className='dashboard__content'>
                    <div className='component__header'>
                        <div className='component__headerGroup component__headerGroup--left'>

                        </div>

                        <div className='component__headerGroup component__headerGroup--right'>
                            <i class="fa-solid fa-circle-user" />
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
                            <input type="text" className="profile__input" id="Equipment_Id" placeholder="รหัสครุภัณฑ์" required
                                onChange={(e) => {
                                    setEquipment({ ...equipment, Equipment_Id: e.target.value });
                                }}
                            />
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
                            <input type="number" className="profile__input" id="Quantity" placeholder="จำนวน" required
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
                            <input type="number" className="profile__input" id="Price" placeholder="ราคา"
                                onChange={(e) => {
                                    setEquipment({ ...equipment, Price: e.target.value });
                                }}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="Fixed_Cost" className="profile__label">ค่าซ่อม</label>
                            <input type="number" className="profile__input" id="Fixed_Cost" placeholder="หากยังไม่มีให้ใส่ 0"
                                onChange={(e) => {
                                    setEquipment({ ...equipment, Fixed_Cost: e.target.value });
                                }}
                            />
                        </div>

                        <button type="submit" className="table__tab table__button thai--font">ยืนยัน</button>
                    </form>
                </main>

                <footer className='footer'>
                    <Link to="/staff-dashboard/staff-chemicals-request-list" className='footer__item'> <i class="fa-regular fa-clock" /></Link>
                    <Link to="/chemicals-list" className='footer__item'> <i class="fa-solid fa-flask" /> </Link>
                    <Link to="/equipment-list" className='footer__item'> <i class="fa-solid fa-toolbox" /></Link>
                    <Link to="/chemicals-stock" className='footer__item'> <i class="fa-solid fa-flask-vial" /> </Link>
                    <div className="dropup">
                        <button type="button" className='dropdown-toggle' data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="fa-solid fa-user" />
                        </button>
                        <ul className="dropdown-menu">
                            <Link to="/staff-profile" className='footer__item'> <i class="fa-regular fa-user" /> Profile</Link>
                            <button onClick={handleLogout} className='dropdown-menu__item dropdown-menu__item--hover '> <i class="fa-solid fa-arrow-right-from-bracket" /> Logout</button>
                        </ul>
                    </div>
                </footer>
            </div>
        </div>
    )
}

export default AddEquipment