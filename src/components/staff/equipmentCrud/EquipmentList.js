import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react'

import BarcodeScanner2 from "../barcode/BarcodeScanner2";

import '../../cssElement/Table.css'
import '../../cssElement/Form.css'
import '../../cssElement/Dashboard.css'

import logo from '../../assets/logo.png';

function EquipmentList({ logout }) {
    const [staffId, setStaffId] = useState("");
    const [staffInfo, setStaffInfo] = useState({
        staffId: "",
        staffFirstName: "",
        staffLastName: "",
        staffUsername: "",
        staffPassword: "",
        staffTel: "",
    })

    const [logActivity, setLogActivity] = useState({
        LogActivity_Name: "",
        Equipment_Id: "",
        Staff_Id: "",
    });

    const [equipment, setEquipment] = useState([]);
    const [equipmentCategory, setEquipmentCategory] = useState([]);

    const [searchQuery, setSearchQuery] = useState("");
    const [filteredEquipment, setFilteredEquipment] = useState([]);

    const [scannedCode, setScannedCode] = useState("");
    const [inputValue, setInputValue] = useState("");

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);

    axios.defaults.withCredentials = true;

    useEffect(() => {
        getEquipment();
        getEquipmentCategory();
    }, []);

    useEffect(() => {
        if (scannedCode) {
            setInputValue(scannedCode);
        } else {
            setInputValue(searchQuery);
        }
    }, [scannedCode, searchQuery]);

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

    const getEquipment = async () => {
        try {
            const response = await axios.get("https://special-problem.onrender.com/equipment-list");
            setEquipment(response.data);
            setFilteredEquipment(response.data); // Initialize filtered equipment with all equipment
            setIsLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    const getEquipmentCategory = async () => {
        try {
            const response = await axios.get("https://special-problem.onrender.com/equipmentCategory-list");
            setEquipmentCategory(response.data);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

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

    const deleteEquipment = async (id) => {
        try {
            const updatedLogActivity = { ...logActivity, LogActivity_Name: "Delete Equipment", Equipment_Id: id, Staff_Id: staffId };
            await axios.post("https://special-problem.onrender.com/log-activity", updatedLogActivity);
            await axios.delete(`https://special-problem.onrender.com/equipment-list/${id}`)
            getEquipment();
        } catch (error) {
            console.log(error)
        }
    }

    const handleSearchInputChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        const filteredEquipmentList = equipment.filter((item) => {
            return (
                item.Equipment_Id.toLowerCase().includes(query.toLowerCase()) ||
                item.Equipment_Name.toLowerCase().includes(query.toLowerCase())
            );
        });

        setFilteredEquipment(filteredEquipmentList);
    };

    const getEquipmentCategoryName = (eqId) => {
        const eqCategory = equipmentCategory.find((eq) => eq.Equipment_Category_Id === eqId);
        return eqCategory ? eqCategory.Equipment_Category_Name : "N/A";
    }

    const handleSave = (scannedText) => {
        setScannedCode(scannedText);
        setInputValue(scannedText);
        handleSearchInputChange({ target: { value: scannedText } }); // Pass a mock event object
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
                        <Link to="/staff-dashboard/staff-chemicals-request-list" className='sidebar__item sidebar__item--hover'> <i className="fa-regular fa-clock" /> <div className='ms-1'> Request</div></Link>
                        <Link to="/chemicals-list" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-flask" /> Chemicals</Link>
                        <Link to="/equipment-list" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-toolbox" /><div className='sidebar__item--active'> Equipment</div></Link>
                        <Link to="/chemicals-stock" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-flask-vial" /> Stock</Link>
                        <Link to="/staff-profile" className='sidebar__item sidebar__item--hover'> <i className="fa-regular fa-user" /> Profile</Link>
                    </div>

                    <div className='sidebar__footer'>
                        <button onClick={handleLogout} className='sidebar__item sidebar__item--footer sidebar__item--hover '> <i className="fa-solid fa-arrow-right-from-bracket" /> Logout</button>
                    </div>
                </aside>

                <main className='dashboard__content'>
                    {isLoading ? (
                        <div class="spinner-border text-success" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    ) : (
                        <div>
                            <div className='component__header'>
                                <div className='component__headerGroup component__headerGroup--left'>
                                    <BarcodeScanner2 onSave={handleSave} />
                                    <Link to="/barcode-equipment" className="btn btn-outline-success me-3"><i className="fa-solid fa-barcode"></i></Link>

                                    <i className='fa-solid fa-magnifying-glass' />
                                    <input
                                        type="text"
                                        className="component__search"
                                        placeholder="ค้นหาด้วยรหัสครุภัณฑ์"
                                        value={searchQuery} // Bind input value to searchQuery state
                                        onChange={handleSearchInputChange} // Call handleSearch when input changes
                                    />
                                </div>

                                <div className='component__headerGroup component__headerGroup--right'>
                                    <i className="fa-solid fa-circle-user" />
                                    <div className='username--text thai--font'>{staffInfo.staffUsername}</div>
                                </div>
                            </div>

                            <div>
                                <div className='table__tabs'>
                                    <Link className='table__tab table__tab--chemicals table__tab--active'>ครุภัณฑ์</Link>
                                    <Link to="/equipmentCategory-list" className='table__tab table__tab--equipment table__tab--unactive'>หมวดหมู่ครุภัณฑ์</Link>
                                    <Link to="/report-equipment" className='table__tab table__tab--equipment table__tab--unactive'>ออกรายงาน</Link>
                                </div>

                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">รหัสครุภัณฑ์</th>
                                            <th scope="col">หมวดหมู่ครุภัณฑ์</th>
                                            <th scope="col">ชื่อครุภัณฑ์</th>
                                            <th scope="col">จำนวน</th>
                                            <th scope="col">สถานที่เก็บ</th>
                                            <th scope="col">ราคา</th>
                                            <th scope="col">ค่าซ่อม</th>
                                            <th scope="col">
                                                <Link to={`add-equipment`} className="buttonTab-btn thai--font disable--link"><i className="fa-solid fa-square-plus me-2" />เพิ่มครุภัณฑ์</Link>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredEquipment.map((equipment, index) => (
                                            <tr key={index} className="active-row">
                                                <td> {index + 1} </td>
                                                <td> {equipment.Equipment_Id} </td>
                                                <td> {getEquipmentCategoryName(equipment.Equipment_Category_Id)} </td>
                                                <td> {equipment.Equipment_Name} </td>
                                                <td> {equipment.Quantity} </td>
                                                <td> {equipment.Location} </td>
                                                <td> {equipment.Price} </td>
                                                <td> {equipment.Fixed_Cost} </td>
                                                <td>
                                                    <div className="d-grid gap-2 d-sm-flex">
                                                        <Link to={`edit-equipment/${equipment.Equipment_Id}`} className="edit--btn">
                                                            <i className="fa-solid fa-pen-to-square" />
                                                            แก้ไข
                                                        </Link>
                                                        <button className="delete--btn btn-danger" type="button" onClick={() => deleteEquipment(equipment.Equipment_Id)}>
                                                            <i className="fa-solid fa-trash" />
                                                            ลบ
                                                        </button>
                                                    </div>
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
                    <Link to="/staff-dashboard/staff-chemicals-request-list" className='footer__item'> <i className="fa-regular fa-clock" /></Link>
                    <Link to="/chemicals-list" className='footer__item'> <i className="fa-solid fa-flask" /> </Link>
                    <Link to="/equipment-list" className='footer__item'> <i className="fa-solid fa-toolbox" /></Link>
                    <Link to="/chemicals-stock" className='footer__item'> <i className="fa-solid fa-flask-vial" /> </Link>
                    <div className="dropup">
                        <button type="button" className='dropdown-toggle' data-bs-toggle="dropdown" aria-expanded="false">
                            <i className="fa-solid fa-user" />
                        </button>
                        <ul className="dropdown-menu">
                            <Link to="/staff-profile" className='footer__item'> <i className="fa-regular fa-user" /> Profile</Link>
                            <button onClick={handleLogout} className='dropdown-menu__item dropdown-menu__item--hover '> <i className="fa-solid fa-arrow-right-from-bracket" /> Logout</button>
                        </ul>
                    </div>
                </footer>
            </div>
        </div>
    )
}

export default EquipmentList