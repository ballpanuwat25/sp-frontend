import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useReactToPrint } from "react-to-print";

import Barcode from "react-barcode";

import '../../cssElement/Table.css'
import '../../cssElement/Form.css'
import '../../cssElement/Dashboard.css'

import logo from '../../assets/logo.png';

function BarcodeEquipment({ logout }) {
    const [equipment, setEquipment] = useState([]);

    useEffect(() => {
        getEquipment();
    }, []);

    const getEquipment = async () => {
        const response = await axios.get(process.env.REACT_APP_API + "/equipment-list");
        setEquipment(response.data);
    }
    
    const conponentPDF = useRef();

    const generatePDF = useReactToPrint({
        content: () => conponentPDF.current,
        documentTitle: "Equipment Barcode List",
    });

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
            <div className='dashboard__container'>
                <aside className='sidebar'>
                    <div className='sidebar__header'>
                        <img src={logo} alt="logo" className='sidebar__logo' width={49} height={33} />
                        <div className='sidebar__title admin__name'>Welcome, {staffInfo.staffFirstName}</div>
                    </div>

                    <div className='sidebar__body'>
                        <Link to=" staff-dashboard/staff-equipment-request-list" className='sidebar__item sidebar__item--hover'> <i className="fa-regular fa-clock" /> <div className='ms-1'> Request</div></Link>
                        <Link to=" equipment-list" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-flask" />  Chemicals</Link>
                        <Link to=" equipment-list" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-toolbox" /><div className='sidebar__item--active'>Equipment</div></Link>
                        <Link to="/equipment-stock" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-flask-vial" /> Stock</Link>
                        <Link to=" staff-profile" className='sidebar__item sidebar__item--hover'> <i className="fa-regular fa-user" /> Profile</Link>
                    </div>

                    <div className='sidebar__footer'>
                        <button onClick={handleLogout} className='sidebar__item sidebar__item--footer sidebar__item--hover '> <i className="fa-solid fa-arrow-right-from-bracket" /> Logout</button>
                    </div>
                </aside>

                <main className='dashboard__content'>
                    <div className='component__header'>
                        <div className='component__headerGroup component__headerGroup--left'>
                            <button className="delete--btn btn-danger" onClick={generatePDF}>
                                <i className="fa-solid fa-file-pdf me-2"></i>
                                Export to PDF
                            </button>
                        </div>

                        <div className='component__headerGroup component__headerGroup--right'>
                            <i className="fa-solid fa-circle-user" />
                            <div className='username--text thai--font'>{staffInfo.staffUsername}</div>
                        </div>
                    </div>

                    <div ref={conponentPDF} style={{ width: '100%' }}>
                        <table className="table table-export table-striped" id="stock-table">
                            <thead>
                                <tr>
                                    <th className="table-header">#</th>
                                    <th className="table-header">ครุภัณฑ์</th>
                                    <th className="table-header">Barcode</th>
                                </tr>
                            </thead>
                            <tbody>
                                {equipment.map((equipment, index) => (
                                    <tr key={equipment.Equipment_Id} className="active-row">
                                        <td className="table-data">{index + 1}</td>
                                        <td className="table-data">{equipment.Equipment_Name}</td>
                                        <td className="table-data"><Barcode value={equipment.Equipment_Id} background="#fff"  height="40" fontSize="8" /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </main>

                <footer className='footer'>
                    <Link to=" staff-dashboard/staff-equipment-request-list" className='footer__item'> <i className="fa-regular fa-clock" /></Link>
                    <Link to=" equipment-list" className='footer__item'> <i className="fa-solid fa-flask" /> </Link>
                    <Link to=" equipment-list" className='footer__item'> <i className="fa-solid fa-toolbox" /></Link>
                    <Link to="/equipment-stock" className='footer__item'> <i className="fa-solid fa-flask-vial" /> </Link>
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
    )
}

export default BarcodeEquipment