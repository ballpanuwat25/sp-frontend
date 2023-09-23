import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react'
import html2canvas from "html2canvas";
import Barcode from "react-barcode";

import BarcodeScanner from "../barcode/BarcodeScanner";

import '../../cssElement/Table.css'
import '../../cssElement/Form.css'
import '../../cssElement/Dashboard.css'

import logo from '../../assets/logo.png';

function ChemicalsList() {
    const [chemicals, setChemicals] = useState([]);
    const [chemicalsDetail, setChemicalsDetail] = useState([]);

    const [searchQuery, setSearchQuery] = useState("");
    const [filteredChemicals, setFilteredChemicals] = useState([]);
    const [scannedText, setScannedText] = useState("");

    const [barcode, setBarcode] = useState("Barcode Content");
    const barcodeRef = useRef(null);

    const [staffId, setStaffId] = useState("");
    const [logActivity, setLogActivity] = useState({
        LogActivity_Id: "",
        LogActivity_Name: "",
        Chem_Bottle_Id: "",
        Staff_Id: "",
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
        const response = await axios.get("http://localhost:3001/chemicals-list");
        setChemicals(response.data);
    }

    const getChemicalsDetail = async () => {
        const response = await axios.get("http://localhost:3001/chemicalsDetail-list");
        setChemicalsDetail(response.data);
    }

    const deleteChemicals = async (id) => {
        try {
            const updatedLogActivity = { ...logActivity, LogActivity_Name: "Delete Chemicals", Chem_Bottle_Id: id, Staff_Id: staffId };
            await axios.post("http://localhost:3001/log-activity", updatedLogActivity);
            await axios.delete(`http://localhost:3001/chemicals-list/${id}`)
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

    const handleScannedTextChange = (scannedText) => {
        setScannedText(scannedText);
    };

    const downloadBarcode = () => {
        if (!barcodeRef.current) return;

        html2canvas(barcodeRef.current).then((canvas) => {
            const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
            const downloadLink = document.createElement("a");
            downloadLink.href = pngUrl;
            downloadLink.download = "mybarcode.png";
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        });
    };

    const handleChange = (event) => {
        setBarcode(event.target.value);
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
                        <Link to="/chemicals-list" className='sidebar__item sidebar__item--hover'> <i class="fa-solid fa-flask" /> <div className='sidebar__item--active'> Chemicals</div></Link>
                        <Link to="/equipment-list" className='sidebar__item sidebar__item--hover'> <i class="fa-solid fa-toolbox" />Equipment</Link>
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
                            <BarcodeScanner onScannedTextChange={handleScannedTextChange} />
                            <button className="btn btn-outline-success me-3" type="button" data-bs-toggle="modal" data-bs-dismiss="modal" data-bs-target="#exampleModalToggle2"><i class="fa-solid fa-barcode"></i></button>
                            <div className="modal fade" id="exampleModalToggle2" aria-hidden="true" aria-labelledby="exampleModalToggleLabel2" tabIndex="-1">
                                <div className="modal-dialog modal-dialog-centered">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="exampleModalToggleLabel2">Barcode Generator</h5>
                                            <button className="btn btn-outline-secondary" type="button" data-bs-target="#exampleModal" data-bs-toggle="modal" data-bs-dismiss="modal">Barcode Scanner</button>
                                        </div>
                                        <div className="modal-body">
                                            <input
                                                type="text"
                                                onChange={handleChange}
                                                value={barcode}
                                                placeholder="Barcode content"
                                                className="form-control mb-3"
                                            />
                                            <div ref={barcodeRef} className="d-flex justify-content-center align-items-center" >
                                                {barcode.trim() !== "" ? <Barcode value={barcode} background="#ffffff" /> : <p>No barcode preview</p>}
                                            </div>
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                            {barcode && (
                                                <button className="btn btn-success" onClick={downloadBarcode} data-bs-dismiss="modal">
                                                    Download Barcode
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <i class='fa-solid fa-magnifying-glass' />
                            <input
                                type="text"
                                className="component__search"
                                placeholder="ค้นหาด้วยรหัสขวดสารเคมี"
                                value={searchQuery}
                                onChange={handleSearchInputChange}
                            />
                        </div>

                        <div className='component__headerGroup component__headerGroup--right'>
                            <i class="fa-solid fa-circle-user" />
                            <div className='username--text thai--font'>{staffInfo.staffUsername}</div>
                        </div>
                    </div>

                    <div>
                        <div className='table__tabs'>
                            <Link className='table__tab table__tab--chemicals table__tab--active'>ขวดสารเคมี</Link>
                            <Link to="/chemicalsDetail-list" className='table__tab table__tab--equipment table__tab--unactive'>สารเคมี</Link>
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
                                        <Link to={`add-chemicals`} className="buttonTab-btn thai--font disable--link"><i class="fa-solid fa-square-plus me-2" /> เพิ่มขวดสารเคมี</Link>
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
                                                    <i class="fa-solid fa-pen-to-square" />
                                                    แก้ไข
                                                </Link>
                                                <button onClick={() => deleteChemicals(chemicals.Chem_Bottle_Id)} className="delete--btn btn-danger">
                                                    <i class="fa-solid fa-trash" />
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

export default ChemicalsList;