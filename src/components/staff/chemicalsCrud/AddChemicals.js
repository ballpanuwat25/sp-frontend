import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import BarcodeScanner2 from "../barcode/BarcodeScanner2";

import '../../cssElement/Table.css'
import '../../cssElement/Form.css'
import '../../cssElement/Dashboard.css'

import logo from '../../assets/logo.png';

function AddChemicals({ logout }) {
    const [staffId, setStaffId] = useState("");
    const [logActivity, setLogActivity] = useState({
        LogActivity_Name: "",
        Chem_Bottle_Id: "",
        Staff_Id: "",
    });

    const [chemicals, setChemicals] = useState({
        Chem_Bottle_Id: "",
        Chem_Id: "",
        Package_Size: "",
        Remaining_Quantity: "",
        Counting_Unit: "",
        Location: "",
        Price: "",
    });

    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    const [scannedCode, setScannedCode] = useState("");
    const [inputValue, setInputValue] = useState("");

    useEffect(() => {
        if (scannedCode) {
            setInputValue(scannedCode);
        } else {
            setInputValue(chemicals.Chem_Bottle_Id);
        }
    }, [scannedCode, chemicals.Chem_Bottle_Id]);

    useEffect(() => {
        axios.get(process.env.REACT_APP_API + "/staff", {
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

    const saveChemicals = async (e) => {
        e.preventDefault();
        try {
            const { Chem_Bottle_Id } = chemicals;

            // Check if Chem_Id already exists
            const chemBottleIdExists = await axios.get(process.env.REACT_APP_API + `/chemicals-list/${Chem_Bottle_Id}`);
            if (chemBottleIdExists.data) {
                notifyWarn();
                return;
            }

            const updatedLogActivity = { ...logActivity, LogActivity_Name: "Add Chemicals", Chem_Bottle_Id: Chem_Bottle_Id };
            await axios.post(process.env.REACT_APP_API + "/log-activity", updatedLogActivity);
            await axios.post(process.env.REACT_APP_API + "/chemicals-list", chemicals);

            notifySuccess();
            navigate(" chemicals-list");
        } catch (err) {
            console.log(err);
        }
    };

    const notifyWarn = () => toast.warn("Chem_Id already exists. Please enter a different Chem_Bottle_Id.");
    const notifySuccess = () => toast.success("Chemicals added successfully");

    const handleChemBotleIdChange = (e) => {
        setChemicals({ ...chemicals, Chem_Bottle_Id: e.target.value });
    };

    const handleSave = (scannedText) => {
        setScannedCode(scannedText);

        // Update inputValue and chemicals.Chem_Bottle_Id
        setInputValue(scannedText);
        setChemicals({ ...chemicals, Chem_Bottle_Id: scannedText });
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
                        <Link to="staff-dashboard/staff-chemicals-request-list" className='sidebar__item sidebar__item--hover'> <i className="fa-regular fa-clock" /> <div className='ms-1'> Request</div></Link>
                        <Link to="chemicals-list" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-flask" /> <div className='sidebar__item--active'> Chemicals</div></Link>
                        <Link to="equipment-list" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-toolbox" />Equipment</Link>
                        <Link to="chemicals-stock" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-flask-vial" /> Stock</Link>
<Link to="approve-students-list" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-users" /> Users</Link>
                        <Link to="staff-profile" className='sidebar__item sidebar__item--hover'> <i className="fa-regular fa-user" /> Profile</Link>
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

                    <form onSubmit={saveChemicals}>
                        <div className='mb-3 disable'>
                            <label htmlFor='Staff_Id' className='profile__label'>รหัสเจ้าหน้าที่</label>
                            <input type='text'
                                className='profile__input profile__input--readonly'
                                defaultValue={staffId}
                                readOnly
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="Chem_Bottle_Id" className="profile__label">รหัสขวดสารเคมี*</label>
                            <div className="input-group">
                                <BarcodeScanner2 onSave={handleSave} />
                                <input
                                    type="text"
                                    className="form-control form-control-scan2"
                                    id="Chem_Bottle_Id"
                                    placeholder="Enter Chemicals Bottle Id"
                                    required
                                    value={inputValue} // Use 'value' instead of 'defaultValue'
                                    onChange={handleChemBotleIdChange}
                                />
                            </div>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="Chem_Id" className="profile__label">รหัสสารเคมี*</label>
                            <input type="text" className="profile__input" id="Chem_Id" placeholder="Enter Chemicals Id" required
                                onChange={(e) => {
                                    setChemicals({ ...chemicals, Chem_Id: e.target.value });
                                }}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="Package_Size" className="profile__label">ขนาดบรรจุ*</label>
                            <input type="number" min="0" className="profile__input" id="Package_Size" placeholder="Enter Package Size" required
                                onChange={(e) => {
                                    setChemicals({ ...chemicals, Package_Size: e.target.value });
                                }}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="Remaining_Quantity" className="profile__label">ปริมาณที่เหลือ*</label>
                            <input type="number" min="0" className="profile__input" id="Remaining_Quantity" placeholder="Enter Remaining Quantity" required
                                onChange={(e) => {
                                    setChemicals({ ...chemicals, Remaining_Quantity: e.target.value });
                                }}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="Counting_Unit" className="profile__label">หน่วยนับ*</label>
                            <input type="text" className="profile__input" id="Counting_Unit" placeholder="Enter Counting Unit" required
                                onChange={(e) => {
                                    setChemicals({ ...chemicals, Counting_Unit: e.target.value });
                                }}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="Location" className="profile__label">สถานที่เก็บ</label>
                            <input type="text" className="profile__input" id="Location" placeholder="Enter Location"
                                onChange={(e) => {
                                    setChemicals({ ...chemicals, Location: e.target.value });
                                }}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="Price" className="profile__label">ราคา</label>
                            <input type="number" min="0" className="profile__input" id="Price" placeholder="Enter Price"
                                onChange={(e) => {
                                    setChemicals({ ...chemicals, Price: e.target.value });
                                }}
                            />
                        </div>

                        <button type="submit" className="table__tab table__button thai--font">ยืนยัน</button>
                    </form>
                </main>

                <footer className='footer'>
                    <Link to="staff-dashboard/staff-chemicals-request-list" className='footer__item'> <i className="fa-regular fa-clock" /></Link>
                    <Link to="chemicals-list" className='footer__item'> <i className="fa-solid fa-flask" /> </Link>
                    <Link to="equipment-list" className='footer__item'> <i className="fa-solid fa-toolbox" /></Link>
                    <Link to="chemicals-stock" className='footer__item'> <i className="fa-solid fa-flask-vial" /> </Link>
                    <div className="dropup">
                        <button type="button" className='dropdown-toggle' data-bs-toggle="dropdown" aria-expanded="false">
                            <i className="fa-solid fa-user" />
                        </button>
                        <ul className="dropdown-menu">
                            <Link to="staff-profile" className='dropdown-menu__item dropdown-menu__item--hover'> <i className="fa-regular fa-user" /> Profile</Link>
                            <Link to="approve-students-list" className='dropdown-menu__item dropdown-menu__item--hover'> <i className="fa-regular fa-users" /> Users</Link>
                            <button onClick={handleLogout} className='dropdown-menu__item dropdown-menu__item--hover '> <i className="fa-solid fa-arrow-right-from-bracket" /> Logout</button>
                        </ul>
                    </div>
                </footer>
            </div>
        </div>
    );
}

export default AddChemicals;