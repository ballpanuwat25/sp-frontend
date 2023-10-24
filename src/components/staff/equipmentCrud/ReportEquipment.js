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

function ReportEquipment({ logout }) {
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
    const [searchQuery, setSearchQuery] = useState(""); // State for search query
    const [filteredEquipment, setFilteredEquipment] = useState([]); // State for filtered equipment

    const [currentDateTime, setCurrentDateTime] = useState(new Date());

    const [isLoading, setIsLoading] = useState(true);

    const formattedDateTime = currentDateTime.toLocaleString();

    const navigate = useNavigate();

    axios.defaults.withCredentials = true;

    useEffect(() => {
        getEquipment();
        getEquipmentCategory();
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

    const getEquipmentCategoryName = (eqId) => {
        const eqCategory = equipmentCategory.find((eq) => eq.Equipment_Category_Id === eqId);
        return eqCategory ? eqCategory.Equipment_Category_Name : "N/A";
    };

    // Function to handle search input changes and filter equipment
    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        // Use the query to filter equipment based on Equipment_Id, Equipment_Name, or any other property
        const filteredEquipmentList = equipment.filter((item) => {
            return (
                item.Equipment_Id.toLowerCase().includes(query.toLowerCase()) ||
                item.Equipment_Name.toLowerCase().includes(query.toLowerCase())
                // Add more conditions as needed for other properties
            );
        });

        setFilteredEquipment(filteredEquipmentList);
    }

    const exportToExcel = () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('EquipmentStock');

        // Add headers to the worksheet
        const headers = ['ลำดับ', 'รหัสครุภัณฑ์', 'หมวดหมู่', 'ชื่อครุภัณฑ์', 'จำนวน', 'สถานที่เก็บ', 'ราคา', 'ค่าซ่อม'];
        worksheet.addRow(headers);

        equipment.forEach((equipment, index) => {
            worksheet.addRow([
                index + 1,
                equipment.Equipment_Id,
                getEquipmentCategoryName(equipment.Equipment_Category_Id),
                equipment.Equipment_Name,
                equipment.Quantity,
                equipment.Location,
                equipment.Price,
                equipment.Fixed_Cost
            ]);
        });

        worksheet.addRow([]);

        // Add a row for the report generation timestamp
        const reportTimestampRow = ['วันเวลาที่ออกรายงาน', new Date().toLocaleString()];
        worksheet.addRow(reportTimestampRow);

        // Save the workbook to a Blob
        workbook.xlsx.writeBuffer().then(buffer => {
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            saveAs(blob, 'equipment_stock.xlsx');
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
                                    <i className='fa-solid fa-magnifying-glass' />
                                    <input
                                        type="text"
                                        className="component__search"
                                        placeholder="ค้นหาด้วยรหัสครุภัณฑ์"
                                        value={searchQuery} // Bind input value to searchQuery state
                                        onChange={handleSearch} // Call handleSearch when input changes
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
                                    <div className="report-header__title thai--font">รายงานครุภัณฑ์</div>
                                    <div className="report-header__date thai--font">วันที่ออกรายงาน {formattedDateTime}</div>
                                </div>
                                <table className="table table-export table-striped">
                                    <thead>
                                        <tr>
                                            <th className="table-header" scope="col">#</th>
                                            <th className="table-header" scope="col">รหัสครุภัณฑ์</th>
                                            <th className="table-header" scope="col">หมวดหมู่</th>
                                            <th className="table-header" scope="col">ชื่อครุภัณฑ์</th>
                                            <th className="table-header" scope="col">จำนวน</th>
                                            <th className="table-header" scope="col">สถานที่เก็บ</th>
                                            <th className="table-header" scope="col">ราคา</th>
                                            <th className="table-header" scope="col">ค่าซ่อม</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredEquipment.map((equipment, index) => (
                                            <tr key={index} className="active-row">
                                                <td className="table-data"> {index + 1} </td>
                                                <td className="table-data"> {equipment.Equipment_Id} </td>
                                                <td className="table-data"> {getEquipmentCategoryName(equipment.Equipment_Category_Id)} </td>
                                                <td className="table-data"> {equipment.Equipment_Name} </td>
                                                <td className="table-data"> {equipment.Quantity} </td>
                                                <td className="table-data"> {equipment.Location} </td>
                                                <td className="table-data"> {equipment.Price} </td>
                                                <td className="table-data"> {equipment.Fixed_Cost} </td>
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
                            <button onClick={handleLogout} className='dropdown-menu__item dropdown-menu__item--hover '> <i className="fa-solid fa-arrow-right-from-bracket" /> Logout</button>
                        </ul>
                    </div>
                </footer>
            </div>
        </div>
    )
}

export default ReportEquipment