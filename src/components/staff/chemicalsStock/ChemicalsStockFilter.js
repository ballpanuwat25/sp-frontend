import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import { saveAs } from 'file-saver';
import ExcelJS from 'exceljs'; // Import exceljs library
import { Link, useNavigate } from 'react-router-dom';
import { useReactToPrint } from "react-to-print"; // Import useReactToPrint hook

import '../../cssElement/Table.css'
import '../../cssElement/Form.css'
import '../../cssElement/Dashboard.css'

import logo from '../../assets/logo.png';

function ChemicalsStockList({ logout }) {
    const [chemicals, setChemicals] = useState([]);
    const [chemicalsDetail, setChemicalsDetail] = useState([]);

    const [searchFilter, setSearchFilter] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");

    const [exportData, setExportData] = useState([]);

    const [staffInfo, setStaffInfo] = useState({
        staffId: "",
        staffFirstName: "",
        staffLastName: "",
        staffUsername: "",
        staffPassword: "",
        staffTel: "",
    })

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);

    const [currentDateTime, setCurrentDateTime] = useState(new Date());
    const formattedDateTime = currentDateTime.toLocaleString();

    axios.defaults.withCredentials = true;

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
                setStaffInfo(response.data);
            }
        });
    }, []);

    useEffect(() => {
        // Filter the data and set it to the exportData state
        const filteredData = processChemicalsData().filter(chemical => {
            const remainingPercentage = (chemical.Remaining_Quantity / chemical.Package_Size) * 100;
            return remainingPercentage < 25;
        });
        setExportData(filteredData);
    }, []);

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

    // Function to process the chemicals data and return a new array with unique chemical IDs and summed up quantities
    const processChemicalsData = () => {
        const uniqueChemicals = {};

        chemicals.forEach((chemical) => {
            const { Chem_Id, Remaining_Quantity, Package_Size } = chemical;

            if (Remaining_Quantity / Package_Size >= 0.1) {
                if (uniqueChemicals[Chem_Id]) {
                    uniqueChemicals[Chem_Id].Package_Size += Package_Size;
                    uniqueChemicals[Chem_Id].Remaining_Quantity += Remaining_Quantity;
                } else {
                    uniqueChemicals[Chem_Id] = {
                        Package_Size: Package_Size,
                        Remaining_Quantity,
                    };
                }
            }
        });

        // Convert the object of unique chemicals to an array of objects
        let processedChemicals = Object.keys(uniqueChemicals).map((Chem_Id) => {
            // Find the corresponding chemicalsDetail based on Chem_Id
            const detail = chemicalsDetail.find((detail) => detail.Chem_Id === Chem_Id);

            // Set Counting_Unit based on Chem_State
            let Counting_Unit;
            if (detail) {
                Counting_Unit =
                    detail.Chem_State === "Solid"
                        ? "g"
                        : detail.Chem_State === "Liquid"
                            ? "ml"
                            : "N/A";
            } else {
                Counting_Unit = "N/A";
            }

            return {
                Chem_Id,
                Chem_Name: detail ? detail.Chem_Name : "N/A",
                Package_Size: uniqueChemicals[Chem_Id].Package_Size,
                Remaining_Quantity: uniqueChemicals[Chem_Id].Remaining_Quantity,
                Counting_Unit,
                Chem_State: detail ? detail.Chem_State : "N/A",
            };
        });

        // Filter chemicals based on the searchFilter (Chem_State)
        if (searchFilter !== "All") {
            processedChemicals = processedChemicals.filter(
                (chemical) => chemical.Chem_State === searchFilter
            );
        }

        // Filter chemicals based on the searchTerm (Chem_Name)
        if (searchTerm.trim() !== "") {
            processedChemicals = processedChemicals.filter((chemical) =>
                chemical.Chem_Name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        const maxPackageSizes = {};

        // Loop through chemicals to find the max package size for each Chem_Id
        chemicals.forEach((chemical) => {
            const { Chem_Id, Package_Size } = chemical;
            if (!maxPackageSizes[Chem_Id] || Package_Size > maxPackageSizes[Chem_Id]) {
                maxPackageSizes[Chem_Id] = Package_Size;
                console.log(maxPackageSizes);
            }
        });

        // Filter chemicals with remaining quantity greater than 25%
        processedChemicals = processedChemicals.filter(
            (chemical) =>
                chemical.Remaining_Quantity <= 0.25 * chemical.Package_Size ||
                chemical.Remaining_Quantity < maxPackageSizes[chemical.Chem_Id]
        );

        return processedChemicals;
    };

    const handleSearchFilterChange = (event) => {
        setSearchFilter(event.target.value);
    };

    const handleSearchInputChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const exportToExcel = () => {
        const filteredData = processChemicalsData().filter(chemical => {
            const remainingPercentage = (chemical.Remaining_Quantity / chemical.Package_Size) * 100;
            return remainingPercentage < 25;
        });

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('ChemicalsStock');

        // Add headers to the worksheet
        const headers = ['No', 'Chemicals Id', 'Chemicals Name', 'Remaining Quantity', 'Total Quantity', 'Counting Unit', 'Chemicals State'];
        worksheet.addRow(headers);

        // Add data rows to the worksheet
        filteredData.forEach((chemical, index) => {
            worksheet.addRow([
                index + 1,
                chemical.Chem_Id,
                chemical.Chem_Name,
                chemical.Remaining_Quantity,
                chemical.Package_Size,
                chemical.Counting_Unit,
                chemical.Chem_State,
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

    const handleLogout = () => {
        axios.get(process.env.REACT_APP_API + "/staff-logout").then((response) => {
            if (response.data.Error) {
                alert(response.data.Error);
            } else {
                localStorage.removeItem('staffToken');
                navigate("/chem");
                logout();
            }
        });
    };

    const getChemGradeById = (chemId) => {
        const chemicalDetail = chemicalsDetail.find((chem) => chem.Chem_Id === chemId);
        return chemicalDetail ? chemicalDetail.Chem_Grade : "N/A";
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
                        <Link to="/chem/staff-dashboard/staff-chemicals-request-list" className='sidebar__item sidebar__item--hover'> <i className="fa-regular fa-clock" /> <div className='ms-1'> Request</div></Link>
                        <Link to="/chem/chemicals-list" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-flask" /> Chemicals</Link>
                        <Link to="/chem/equipment-list" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-toolbox" />Equipment</Link>
                        <Link to="/chem/chemicals-stock" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-flask-vial" /> <div className='sidebar__item--active'> Stock</div></Link>
                        <Link to="/chem/approve-students-list" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-users" /> Users</Link>
                        <Link to="/chem/staff-profile" className='sidebar__item sidebar__item--hover'> <i className="fa-regular fa-user" /> Profile</Link>
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
                                        id="searchTerm"
                                        className="component__search"
                                        value={searchTerm}
                                        onChange={handleSearchInputChange}
                                        placeholder="Enter Chem_Name..."
                                    />
                                </div>

                                <div className='component__headerGroup component__headerGroup--right'>
                                    <i className="fa-solid fa-circle-user" />
                                    <div className='username--text thai--font'>{staffInfo.staffUsername}</div>
                                </div>
                            </div>

                            <div className="mb-3 d-flex justify-content-between align-items-center">
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

                                <div className="w-50 d-flex justify-content-between align-items-center">
                                    <label className="form-label thai--font">เลือกสถานะของสาร:</label>
                                    <select
                                        id="searchFilter"
                                        value={searchFilter}
                                        onChange={handleSearchFilterChange}
                                        className="form-control w-75 thai--font"
                                    >
                                        <option value="All">ทั้งหมด</option>
                                        <option value="Liquid">Liquid</option>
                                        <option value="Solid">Solid</option>
                                    </select>
                                </div>
                            </div>

                            <div ref={conponentPDF} style={{ width: '100%' }}>
                                <div className="d-flex justify-content-between">
                                    <div className="report-header__title thai--font">รายงานสารเคมี</div>
                                    <div className="report-header__date thai--font">วันที่ออกรายงาน {formattedDateTime}</div>
                                </div>
                                <table className="table table-export table-striped" id="stock-table">
                                    <thead>
                                        <tr>
                                            <th className="table-header">#</th>
                                            <th className="table-header">รหัสสารเคมี</th>
                                            <th className="table-header">ชื่อสารเคมี</th>
                                            <th className="table-header">เกรด</th>
                                            <th className="table-header">ปริมาณทั้งหมด</th>
                                            <th className="table-header">ปริมาณคงเหลือ</th>
                                            <th className="table-header">หน่วยนับ</th>
                                            <th className="table-header">สถานะของสาร</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {processChemicalsData().map((chemical, index) => (
                                            <tr key={index}>
                                                <td className="table-data"> {index + 1} </td>
                                                <td className="table-data"> {chemical.Chem_Id} </td>
                                                <td className="table-data"> {chemical.Chem_Name} </td>
                                                <td className="table-data"> {getChemGradeById(chemical.Chem_Id)} </td>
                                                <td className="table-data"> {chemical.Package_Size} </td>
                                                <td className="table-data"> {chemical.Remaining_Quantity} </td>
                                                <td className="table-data"> {chemical.Counting_Unit} </td>
                                                <td className="table-data"> {chemical.Chem_State} </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </main>

                <footer className='footer'>
                    <Link to="/chem/staff-dashboard/staff-chemicals-request-list" className='footer__item'> <i className="fa-regular fa-clock" /></Link>
                    <Link to="/chem/chemicals-list" className='footer__item'> <i className="fa-solid fa-flask" /> </Link>
                    <Link to="/chem/equipment-list" className='footer__item'> <i className="fa-solid fa-toolbox" /></Link>
                    <Link to="/chem/chemicals-stock" className='footer__item'> <i className="fa-solid fa-flask-vial" /> </Link>
                    <div className="dropup">
                        <button type="button" className='dropdown-toggle' data-bs-toggle="dropdown" aria-expanded="false">
                            <i className="fa-solid fa-user" />
                        </button>
                        <ul className="dropdown-menu">
                            <Link to="/chem/staff-profile" className='dropdown-menu__item dropdown-menu__item--hover'> <i className="fa-regular fa-user" /> Profile</Link>
                            <Link to="/chem/approve-students-list" className='dropdown-menu__item dropdown-menu__item--hover'> <i className="fa-regular fa-users" /> Users</Link>
                            <button onClick={handleLogout} className='dropdown-menu__item dropdown-menu__item--hover '> <i className="fa-solid fa-arrow-right-from-bracket" /> Logout</button>
                        </ul>
                    </div>
                </footer>
            </div>
        </div>
    );
}

export default ChemicalsStockList;