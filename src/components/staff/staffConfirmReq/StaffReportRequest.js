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

function ReportRequest({ logout }) {
    const [chemicals, setChemicals] = useState([]);
    const [chemicalsDetail, setChemicalsDetail] = useState([]);

    const [searchQuery, setSearchQuery] = useState("");
    const [filteredChemicals, setFilteredChemicals] = useState([]);

    const [staffId, setStaffId] = useState("");
    const [logActivity, setLogActivity] = useState({
        LogActivity_Name: "",
        Chem_Bottle_Id: "",
        Staff_Id: "",
    });

    const [staffInfo, setStaffInfo] = useState({
        staffId: "",
        staffFirstName: "",
        staffLastName: "",
        staffUsername: "",
        staffPassword: "",
        staffTel: "",
    })

    const [currentDateTime, setCurrentDateTime] = useState(new Date());

    const formattedDateTime = currentDateTime.toLocaleString();

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);

    axios.defaults.withCredentials = true;

    const [chemicalsReq, setChemicalsReq] = useState([]);
    const [filteredStatus, setFilteredStatus] = useState("Succeed");

    useEffect(() => {
        getChemicals();
        getChemicalsDetail();
    }, []);

    useEffect(() => {
        // Update the current date and time every second
        const intervalId = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 1000);

        // Clear the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, []);

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

    useEffect(() => {
        getChemicalsRequest();
    }, [searchQuery, filteredStatus]);

    const getChemicals = async () => {
        const response = await axios.get(process.env.REACT_APP_API + "/chemicals-list");
        setChemicals(response.data);
        setIsLoading(false);
    }

    const getChemicalsDetail = async () => {
        const response = await axios.get(process.env.REACT_APP_API + "/chemicalsDetail-list");
        setChemicalsDetail(response.data);
        setIsLoading(false);
    }

    const getChemicalsRequest = async () => {
        const response = await axios.get(process.env.REACT_APP_API + "/chemicals-request-list");
        const filteredChemicalsReq = response.data.filter(chemicalsReq => {
            return (
                (filteredStatus === "Succeed" && chemicalsReq.Request_Status === "Succeed") &&
                (chemicalsReq.Student_Id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    getChemNameById(chemicalsReq.Chem_Id).toLowerCase().includes(searchQuery.toLowerCase()) ||
                    chemicalsReq.Request_Purpose.toLowerCase().includes(searchQuery.toLowerCase())) &&
                chemicalsReq.Request_Status !== "Pending"
            );
        });

        filteredChemicalsReq.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setChemicalsReq(filteredChemicalsReq);
        setIsLoading(false);
    };

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

    const getChemGradeById = (chemId) => {
        const chemicalDetail = chemicalsDetail.find((chem) => chem.Chem_Id === chemId);
        return chemicalDetail ? chemicalDetail.Chem_Grade : "N/A";
    };

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

    const exportToExcel = () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('ChemicalsStock');

        // Add headers to the worksheet
        const headers = ['ลำดับ', 'รหัสนิสิต', 'ชื่อสาร', 'รหัสขวด', 'ปริมาณที่ขอ', 'ปริมาณที่จ่าย', 'หน่วยนับ', 'วัตถุประสงค์', 'วันที่ส่งคำร้อง'];
        worksheet.addRow(headers);

        // Add data rows to the worksheet
        chemicalsReq.forEach((chemicalsReq, index) => {
            worksheet.addRow([
                index + 1,
                chemicalsReq.Student_Id,
                getChemNameById(chemicalsReq.Chem_Id),
                chemicalsReq.Chem_Bottle_Id,
                chemicalsReq.Requested_Quantity,
                chemicalsReq.Release_Quantity,
                chemicalsReq.Counting_Unit,
                chemicalsReq.Request_Purpose,
                formatDate(chemicalsReq.createdAt),
            ]);
        });

        worksheet.addRow([]);

        // Add a row for the report generation timestamp
        const reportTimestampRow = ['วันเวลาที่ออกรายงาน', new Date().toLocaleString()];
        worksheet.addRow(reportTimestampRow);

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

    const formatDate = (dateString) => {
        const options = { day: 'numeric', month: 'numeric', year: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', options);
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
                        <Link to="/staff-dashboard/staff-chemicals-request-list" className='sidebar__item sidebar__item--hover'> <i className="fa-regular fa-clock" /> <div className='sidebar__item--active ms-1'> Request</div></Link>
                        <Link to="/chemicals-list" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-flask" /> Chemicals</Link>
                        <Link to="/equipment-list" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-toolbox" />Equipment</Link>
                        <Link to="/chemicals-stock" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-flask-vial" /> Stock</Link>
                        <Link to="/approve-students-list" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-users" /> Users</Link>
                        <Link to="/staff-profile" className='sidebar__item sidebar__item--hover'> <i className="fa-regular fa-user" /> Profile</Link>
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
                                    <i className='fa-solid fa-magnifying-glass' />
                                    <input
                                        type="text"
                                        className="component__search"
                                        placeholder="ค้นหาด้วยชื่อสารเคมีหรือวัตถุประสงค์"
                                        value={searchQuery}
                                        onChange={handleSearchInputChange}
                                    />
                                </div>

                                <div className='component__headerGroup component__headerGroup--right'>
                                    <i className="fa-solid fa-circle-user" />
                                    <div className='username--text thai--font'>{staffInfo.staffUsername}</div>
                                </div>
                            </div>

                            <div className="mb-3">
                                <button className="edit--btn me-2" onClick={exportToExcel}>
                                    <i className="fa-solid fa-file-excel me-2"></i>
                                    Export to Excel
                                </button>

                                <button className="delete--btn btn-danger" onClick={generatePDF}>
                                    <i className="fa-solid fa-file-pdf me-2"></i>
                                    Export to PDF
                                </button>
                            </div>

                            <div ref={conponentPDF} style={{ width: '100%' }}>
                                <div className="d-flex justify-content-between">
                                    <div className="report-header__title thai--font">รายงานการใช้สารเคมี</div>
                                    <div className="report-header__date thai--font">วันที่ออกรายงาน {formattedDateTime}</div>
                                </div>
                                <table className="table table-export table-striped" id="stock-table">
                                <thead>
                                        <tr>
                                            <th className="table-header" scope="col">รหัสนิสิต</th>
                                            <th className="table-header" scope="col">สารเคมี</th>
                                            <th className="table-header" scope="col">รหัสขวด</th>
                                            <th className="table-header" scope="col">ปริมาณที่ขอ</th>
                                            <th className="table-header" scope="col">ปริมาณที่จ่าย</th>
                                            <th className="table-header" scope="col">หน่วยนับ</th>
                                            <th className="table-header" scope="col">วัตถุประสงค์</th>
                                            <th className="table-header" scope="col">วันที่ส่งคำร้อง</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {chemicalsReq.map((chemicalsReq) => (
                                            <tr key={chemicalsReq.Chem_Request_Id} className="active-row">
                                                <td className="table-data"> {chemicalsReq.Student_Id} </td>
                                                <td className="table-data"> {getChemNameById(chemicalsReq.Chem_Id)} </td>
                                                <td className="table-data"> {chemicalsReq.Chem_Bottle_Id} </td>
                                                <td className="table-data"> {chemicalsReq.Requested_Quantity} </td>
                                                <td className="table-data"> {chemicalsReq.Release_Quantity} </td>
                                                <td className="table-data"> {chemicalsReq.Counting_Unit} </td>
                                                <td className="table-data"> {chemicalsReq.Request_Purpose} </td>
                                                <td className="table-data"> {formatDate(chemicalsReq.createdAt)} </td>
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

export default ReportRequest;