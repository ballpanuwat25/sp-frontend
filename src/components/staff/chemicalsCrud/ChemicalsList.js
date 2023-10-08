import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react'

import BarcodeScanner2 from "../barcode/BarcodeScanner2";

import '../../cssElement/Table.css'
import '../../cssElement/Form.css'
import '../../cssElement/Dashboard.css'

import logo from '../../assets/logo.png';

function ChemicalsList({ logout }) {
    const [chemicals, setChemicals] = useState([]);
    const [chemicalsDetail, setChemicalsDetail] = useState([]);

    const [searchQuery, setSearchQuery] = useState("");
    const [filteredChemicals, setFilteredChemicals] = useState([]);

    const [scannedCode, setScannedCode] = useState("");
    const [inputValue, setInputValue] = useState("");

    const [staffId, setStaffId] = useState("");
    const [logActivity, setLogActivity] = useState({
        LogActivity_Name: "",
        Chem_Bottle_Id: "",
        Staff_Id: "",
    });

    axios.defaults.withCredentials = true;

    useEffect(() => {
        if (scannedCode) {
            // If scannedCode is available, set it as the input value
            setInputValue(scannedCode);
        } else {
            // Otherwise, use the searchQuery as the input value
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
        getChemicals();
        getChemicalsDetail();
    }, []);

    const getChemicals = async () => {
        const response = await axios.get("https://special-problem.onrender.com/chemicals-list");
        setChemicals(response.data);
    }

    const getChemicalsDetail = async () => {
        const response = await axios.get("https://special-problem.onrender.com/chemicalsDetail-list");
        setChemicalsDetail(response.data);
    }

    const deleteChemicals = async (id) => {
        try {
            const updatedLogActivity = { ...logActivity, LogActivity_Name: "Delete Chemicals", Chem_Bottle_Id: id, Staff_Id: staffId };
            await axios.post("https://special-problem.onrender.com/log-activity", updatedLogActivity);
            await axios.delete(`https://special-problem.onrender.com/chemicals-list/${id}`)
            getChemicals();
        } catch (error) {
            console.log(error)
        }
    }

    const handleSearchInputChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        
        const filteredChemicals = chemicals.filter((chemical) =>
            chemical.Chem_Bottle_Id.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredChemicals(filteredChemicals);
    };

    const getChemNameById = (chemId) => {
        const chemicalDetail = chemicalsDetail.find((chem) => chem.Chem_Id === chemId);
        return chemicalDetail ? chemicalDetail.Chem_Name : "N/A";
    };

    const [staffInfo, setStaffInfo] = useState({
        staffId: "",
        staffFirstName: "",
        staffLastName: "",
        staffUsername: "",
        staffPassword: "",
        staffTel: "",
    })

    const navigate = useNavigate();

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
                        <Link to="/chemicals-list" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-flask" /> <div className='sidebar__item--active'> Chemicals</div></Link>
                        <Link to="/equipment-list" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-toolbox" />Equipment</Link>
                        <Link to="/chemicals-stock" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-flask-vial" /> Stock</Link>
                        <Link to="/staff-profile" className='sidebar__item sidebar__item--hover'> <i className="fa-regular fa-user" /> Profile</Link>
                    </div>

                    <div className='sidebar__footer'>
                        <button onClick={handleLogout} className='sidebar__item sidebar__item--footer sidebar__item--hover '> <i className="fa-solid fa-arrow-right-from-bracket" /> Logout</button>
                    </div>
                </aside>

                <main className='dashboard__content'>
                    <div className='component__header'>
                        <div className='component__headerGroup component__headerGroup--left'>
                            <BarcodeScanner2 onSave={handleSave} />
                            <Link to="/barcode-chemicals" className="btn btn-outline-success me-3"><i className="fa-solid fa-barcode"></i></Link>

                            <i className='fa-solid fa-magnifying-glass' />
                            <input
                                type="text"
                                className="component__search"
                                placeholder="ค้นหาด้วยรหัสขวดสารเคมี"
                                defaultValue={inputValue}
                                onChange={handleSearchInputChange}
                            />
                        </div>

                        <div className='component__headerGroup component__headerGroup--right'>
                            <i className="fa-solid fa-circle-user" />
                            <div className='username--text thai--font'>{staffInfo.staffUsername}</div>
                        </div>
                    </div>

                    <div>
                        <div className='table__tabs'>
                            <Link className='table__tab table__tab--chemicals table__tab--active'>ขวดสารเคมี</Link>
                            <Link to="/chemicalsDetail-list" className='table__tab table__tab--equipment table__tab--unactive'>สารเคมี</Link>
                            <Link to="/report-chemicals" className='table__tab table__tab--equipment table__tab--unactive'>ออกรายงาน</Link>
                        </div>

                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">รหัสขวด</th>
                                    <th scope="col">ชื่อสารเคมี</th>
                                    <th scope="col">ขนาดบรรจุ</th>
                                    <th scope="col">ปริมาณคงเหลือ</th>
                                    <th scope="col">หน่วยนับ</th>
                                    <th scope="col">สถานที่เก็บ</th>
                                    <th scope="col">ราคา</th>
                                    <th scope="col">
                                        <Link to={`add-chemicals`} className="buttonTab-btn thai--font disable--link"><i className="fa-solid fa-square-plus me-2" /> เพิ่มขวดสารเคมี</Link>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {(searchQuery ? filteredChemicals : chemicals).map((chemicals, index) => (
                                    <tr key={index} className="active-row">
                                        <td> {index + 1} </td>
                                        <td> {chemicals.Chem_Bottle_Id} </td>
                                        <td> {getChemNameById(chemicals.Chem_Id)} </td>
                                        <td> {chemicals.Package_Size} </td>
                                        <td> {chemicals.Remaining_Quantity} </td>
                                        <td> {chemicals.Counting_Unit} </td>
                                        <td> {chemicals.Location} </td>
                                        <td> {chemicals.Price} </td>
                                        <td>
                                            <div className="d-grid gap-2 d-sm-flex">
                                                <Link to={`edit-chemicals/${chemicals.Chem_Bottle_Id}`} className="edit--btn">
                                                    <i className="fa-solid fa-pen-to-square" />
                                                    แก้ไข
                                                </Link>
                                                <button onClick={() => deleteChemicals(chemicals.Chem_Bottle_Id)} className="delete--btn btn-danger">
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

export default ChemicalsList;