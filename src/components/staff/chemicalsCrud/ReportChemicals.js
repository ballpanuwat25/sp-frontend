import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react'
import { useReactToPrint } from "react-to-print";

import { saveAs } from 'file-saver';
import ExcelJS from 'exceljs'; // Import exceljs library


import '../../cssElement/Table.css'
import '../../cssElement/Form.css'
import '../../cssElement/Dashboard.css'

import logo from '../../assets/logo.png';

function ReportChemicals({ logout }) {
    const [chemicals, setChemicals] = useState([]);
    const [chemicalsDetail, setChemicalsDetail] = useState([]);

    const [searchQuery, setSearchQuery] = useState("");
    const [filteredChemicals, setFilteredChemicals] = useState([]);
    const [scannedText, setScannedText] = useState("");

    const [staffId, setStaffId] = useState("");
    const [logActivity, setLogActivity] = useState({
        LogActivity_Name: "",
        Chem_Bottle_Id: "",
        Staff_Id: "",
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

    const exportToExcel = () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('ChemicalsStock');

        // Add headers to the worksheet
        const headers = ['ลำดับ', 'รหัสขวด', 'ชื่อสาร', 'ขนาดบรรจุ', 'ปริมาณคงเหลือ', 'หน่วยนับ', 'สถานที่เก็บ', 'ราคา'];
        worksheet.addRow(headers);

        // Add data rows to the worksheet
        chemicals.forEach((chemical, index) => {
            worksheet.addRow([
                index + 1,
                chemical.Chem_Bottle_Id,
                getChemNameById(chemical.Chem_Id),
                chemical.Package_Size,
                chemical.Remaining_Quantity,
                chemical.Counting_Unit,
                chemical.Location,
                chemical.Price,
            ]);
        });

        // Save the workbook to a Blob
        workbook.xlsx.writeBuffer().then(buffer => {
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            saveAs(blob, 'chemicals_stock.xlsx');
        });
    };

    const conponentPDF = useRef();

    const generatePDF = useReactToPrint({
        content: () => conponentPDF.current,
        documentTitle: "Chemicals Stock",
    });

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
                            <i className='fa-solid fa-magnifying-glass' />
                            <input
                                type="text"
                                className="component__search"
                                placeholder="ค้นหาด้วยรหัสขวดสารเคมี"
                                value={searchQuery}
                                onChange={handleSearchInputChange}
                            />
                        </div>

                        <div className='component__headerGroup component__headerGroup--right'>
                            <i className="fa-solid fa-circle-user" />
                            <div className='username--text thai--font'>{staffInfo.staffUsername}</div>
                        </div>
                    </div>

                    <div>
                        <button className="edit--btn me-2" onClick={exportToExcel}>
                            <i className="fa-solid fa-file-excel me-2"></i>
                            Export to Excel
                        </button>

                        <button className="delete--btn btn-danger" onClick={generatePDF}>
                            <i className="fa-solid fa-file-pdf me-2"></i>
                            Export to PDF
                        </button>
                    </div>

                    <div className="mt-3" ref={conponentPDF} style={{ width: '100%' }}>
                        <table className="table table-export table-striped" id="stock-table">
                            <thead>
                                <tr>
                                    <th className="table-header" scope="col">#</th>
                                    <th className="table-header" scope="col">รหัสขวด</th>
                                    <th className="table-header" scope="col">ชื่อสารเคมี</th>
                                    <th className="table-header" scope="col">ขนาดบรรจุ</th>
                                    <th className="table-header" scope="col">ปริมาณคงเหลือ</th>
                                    <th className="table-header" scope="col">หน่วยนับ</th>
                                    <th className="table-header" scope="col">สถานที่เก็บ</th>
                                    <th className="table-header" scope="col">ราคา</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(searchQuery ? filteredChemicals : chemicals).map((chemicals, index) => (
                                    <tr key={index} className="active-row">
                                        <td className="table-data"> {index + 1} </td>
                                        <td className="table-data"> {chemicals.Chem_Bottle_Id} </td>
                                        <td className="table-data"> {getChemNameById(chemicals.Chem_Id)} </td>
                                        <td className="table-data"> {chemicals.Package_Size} </td>
                                        <td className="table-data"> {chemicals.Remaining_Quantity} </td>
                                        <td className="table-data"> {chemicals.Counting_Unit} </td>
                                        <td className="table-data"> {chemicals.Location} </td>
                                        <td className="table-data"> {chemicals.Price} </td>
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

export default ReportChemicals;