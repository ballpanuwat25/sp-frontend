import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import BarcodeScanner2 from "../barcode/BarcodeScanner2";

import '../../cssElement/Table.css'
import '../../cssElement/Form.css'
import '../../cssElement/Dashboard.css'

import logo from '../../assets/logo.png';

function StaffChemicalsRequest({ logout }) {
    const [Chem_Request_Id, setChem_Request_Id] = useState("");
    const [Chem_Id, setChem_Id] = useState("");
    const [Chem_Bottle_Id, setChem_Bottle_Id] = useState("");
    const [Requested_Quantity, setRequested_Quantity] = useState("");
    const [Release_Quantity, setRelease_Quantity] = useState("");

    const [Remaining_Quantity, setRemaining_Quantity] = useState("");

    const [Counting_Unit, setCounting_Unit] = useState("");
    const [Staff_Id, setStaff_Id] = useState("");
    const [Request_Status, setRequest_Status] = useState("");
    const [Request_Comment, setRequest_Comment] = useState("");

    const [staffId, setStaffId] = useState("");
    const [staffIdInputValue, setStaffIdInputValue] = useState("");

    const [isRejectButtonClicked, setIsRejectButtonClicked] = useState(false);

    const { id } = useParams();
    const navigate = useNavigate();

    const [scannedCode, setScannedCode] = useState("");
    const [inputValue, setInputValue] = useState("");

    const [chemicalsDetail, setChemicalsDetail] = useState([]);

    useEffect(() => {
        getStaffId();
        getChemicalsById();
        getChemicalsRequestById();
        getChemicalsDetail();
    }, []);

    useEffect(() => {
        if (scannedCode) {
            setInputValue(scannedCode);
        } else {
            setInputValue(Chem_Bottle_Id);
        }
    }, [scannedCode, Chem_Bottle_Id]);

    const getStaffId = async () => {
        try {
            const response = await axios.get(process.env.REACT_APP_API + "/staff", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("staffToken")}`,
                },
            });

            if (response.data.Error) {
                alert(response.data.Error);
            } else {
                setStaffId(response.data.staffId);
            }
        } catch (error) {
            console.error("Error fetching staff data:", error);
        }
    };

    const getChemicalsById = async () => {
        try {
            const response = await axios.get(process.env.REACT_APP_API + `/chemicals-list/${Chem_Bottle_Id}`);
            const chemicals = response.data;

            if (chemicals) {
                setChem_Bottle_Id(chemicals.Chem_Bottle_Id);
                setRemaining_Quantity(chemicals.Remaining_Quantity);
            } else {
                // Handle the case where chemicals is null or undefined
                console.error("Chemicals data is null or undefined");
            }
        } catch (error) {
            console.error("Error fetching chemicals data:", error);
        }
    }

    const getChemicalsRequestById = async () => {
        const result = await axios.get(process.env.REACT_APP_API + `/chemicals-request-list/${id}`);
        setChem_Request_Id(result.data.Chem_Request_Id);
        setChem_Id(result.data.Chem_Id);
        setChem_Bottle_Id(result.data.Chem_Bottle_Id);
        setRequested_Quantity(result.data.Requested_Quantity);
        setRelease_Quantity(result.data.Release_Quantity);
        setCounting_Unit(result.data.Counting_Unit);
        setStaff_Id(result.data.Staff_Id);
        setRequest_Status(result.data.Request_Status);
        setRequest_Comment(result.data.Request_Comment);
    };

    const notifyError = () => toast.error("Chemicals are not enough.");
    const notifyWarn = () => toast.warn("Chemicals bottle id is not found, try again.");

    const updateChemicalsRequest = async (e) => {
        e.preventDefault();

        // Check if Release_Quantity is greater than Remaining_Quantity
        if (Release_Quantity > Remaining_Quantity) {
            notifyError();
            return;
        }

        // Check if Release_Quantity is equal to Remaining_Quantity
        if (Release_Quantity === Remaining_Quantity) {
            const userSucceed = window.confirm("Chemicals are empty now. Do you still want to proceed?");
            if (!userSucceed) {
                return;
            }
        }

        // Calculate newRemaining_Quantity
        const newRemaining_Quantity = Remaining_Quantity - Release_Quantity;

        try {
            // Make the API call to update the chemicals-list
            const chemicalsListResponse = await axios.patch(process.env.REACT_APP_API + `/chemicals-list/${Chem_Bottle_Id}`, {
                Remaining_Quantity: newRemaining_Quantity,
            });

            if (chemicalsListResponse.data.Error) {
                alert(chemicalsListResponse.data.Error);
            } else {
                // If the update to chemicals-list is successful, proceed with updating chemicals-request-list
                const requestData = {
                    Chem_Request_Id,
                    Chem_Id,
                    Chem_Bottle_Id,
                    Requested_Quantity,
                    Release_Quantity,
                    Counting_Unit,
                    Staff_Id: staffIdInputValue,
                    Request_Status,
                    Request_Comment,
                };
                const chemicalsRequestResponse = await axios.patch(process.env.REACT_APP_API + `/chemicals-request-list/${id}`, requestData);

                if (chemicalsRequestResponse.data.Error) {
                    alert(chemicalsRequestResponse.data.Error);
                } else {
                    // If both updates are successful, navigate to the staff dashboard
                    navigate("/staff-dashboard");
                }
            }
        } catch (error) {
            console.error("Error updating chemicals data:", error);
        }
    };

    useEffect(() => {
        if (!staffIdInputValue && staffId) {
            setStaffIdInputValue(staffId);
        }
    }, [staffId, staffIdInputValue]);

    const handleQuery = async () => {
        try {
            const response = await axios.get(
                process.env.REACT_APP_API + `/chemicals-list/${Chem_Bottle_Id}`
            );
            const chemicals = response.data;

            if (response.data.Error || chemicals.Remaining_Quantity === undefined) {
                notifyWarn();
            } else {
                setRemaining_Quantity(chemicals.Remaining_Quantity);
            }
        } catch (error) {
            console.error("Error fetching chemicals data:", error);
            alert("An error occurred while fetching data. Please try again.");
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

    const handleChemBotleIdChange = (e) => {
        setChem_Bottle_Id(e.target.value);
    };

    const handleSave = (scannedText) => {
        setScannedCode(scannedText);

        // Update inputValue and chemicals.Chem_Bottle_Id
        setInputValue(scannedText);
        setChem_Bottle_Id(scannedText);
    };

    const getChemicalsDetail = async () => {
        const response = await axios.get(process.env.REACT_APP_API + "/chemicalsDetail-list");
        setChemicalsDetail(response.data);
    }

    const getChemNameById = (chemId) => {
        const chemicalDetail = chemicalsDetail.find((chem) => chem.Chem_Id === chemId);
        return chemicalDetail ? chemicalDetail.Chem_Name : "N/A";
    };

    return (
        <div className='container-fluid vh-100'>
            <ToastContainer />
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
                    <div className='component__header'>
                        <div className='component__headerGroup component__headerGroup--left'>

                        </div>

                        <div className='component__headerGroup component__headerGroup--right'>
                            <i className="fa-solid fa-circle-user" />
                            <div className='username--text thai--font'>{staffInfo.staffUsername}</div>
                        </div>
                    </div>

                    <form onSubmit={updateChemicalsRequest}>
                        <div className="mb-3 disable">
                            <label htmlFor="Staff_Id" className='profile__label'>รหัสเจ้าหน้าที่</label>
                            <input
                                type="text"
                                className="profile__input profile__input--readonly"
                                id="Staff_Id"
                                value={staffIdInputValue}
                                onChange={(e) => {
                                    setStaffIdInputValue(e.target.value);
                                }}
                                readOnly
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="Chem_Id" className='profile__label'>สารเคมี: {getChemNameById(Chem_Id)}</label>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="Chem_Bottle_Id" className='profile__label'>ใส่รหัสขวดสารเคมี (เจ้าหน้าที่เลือกใช้ขวดไหนก็ได้)</label>
                            <div className="input-group">
                                <BarcodeScanner2 onSave={handleSave} />
                                <input
                                    type="text"
                                    className="form-control form-control-scan2"
                                    id="Chem_Bottle_Id"
                                    placeholder="Enter Chemicals Bottle Id"
                                    required={isRejectButtonClicked}
                                    value={inputValue} // Use 'value' instead of 'defaultValue'
                                    onChange={handleChemBotleIdChange}
                                />
                                <button
                                    className="btn btn-outline-secondary"
                                    type="button"
                                    onClick={handleQuery}
                                >
                                    ค้นหาขวดสารเคมี
                                </button>
                            </div>


                        </div>

                        <div className="mb-3">
                            <label htmlFor="Remaining_Quantity" className='profile__label'>ปริมาณที่เหลือ</label>
                            <input
                                type="number"
                                className="profile__input"
                                id="Remaining_Quantity"
                                placeholder="Remaining Quantity"
                                required={isRejectButtonClicked}
                                value={Remaining_Quantity}
                                onChange={(e) => {
                                    setRemaining_Quantity(e.target.value);
                                }}
                                min="0"
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="Requested_Quantity" className='profile__label'>ปริมาณที่ขอ</label>
                            <input type="text" className="profile__input" id="Requested_Quantity" required={isRejectButtonClicked} value={Requested_Quantity}
                                onChange={(e) => {
                                    setRequested_Quantity(e.target.value);
                                }}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="Release_Quantity" className='profile__label'>ปริมาณที่จ่าย</label>
                            <input type="number" min="0" className="profile__input" id="Release_Quantity" placeholder="Enter Release Quantity" required={isRejectButtonClicked} value={Release_Quantity}
                                onChange={(e) => {
                                    setRelease_Quantity(e.target.value);
                                }}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="Counting_Unit" className='profile__label'>หน่วยนับ</label>
                            <input type="text" className="profile__input profile__input--readonly" readOnly id="Counting_Unit" placeholder="Enter Counting Unit" required={isRejectButtonClicked} value={Counting_Unit}
                                onChange={(e) => {
                                    setCounting_Unit(e.target.value);
                                }}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="Request_Comment" className='profile__label'>หมายเหตุ (ไม่บังคับ)</label>
                            <input type="text" className="profile__input" id="Request_Comment" placeholder="เช่น ให้มารับในวันที่..." value={Request_Comment}
                                onChange={(e) => {
                                    setRequest_Comment(e.target.value);
                                }}
                            />
                        </div>

                        <div className="d-flex">
                            <button
                                type="submit"
                                className="edit--btn"
                                onClick={() => {
                                    setRequest_Status("Succeed");
                                }}
                            >
                                <i className='fa-solid fa-circle-check' />
                                อนุมัติ
                            </button>
                            <button
                                type="button"
                                className="delete--btn btn-danger mx-2"
                                data-bs-toggle="modal"
                                data-bs-target="#rejectModal"
                                onClick={() => {
                                    setIsRejectButtonClicked(true); // Set the flag to indicate the Reject button is clicked
                                }}
                            >
                                <i className='fa-solid fa-circle-xmark' />
                                ปฏิเสธ
                            </button>

                            <div className="modal fade thai--font" id="rejectModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title " id="exampleModalLabel">เหตุผลในการปฏิเสธ</h5>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body">
                                            <label htmlFor="Request_Comment" className="form-label">หมายเหตุ*</label>
                                            <input
                                                type="text"
                                                className='form-control'
                                                id="Request_Comment"
                                                placeholder="เช่น สารเคมีหมด ฯลฯ"
                                                required={isRejectButtonClicked} // Make the input required only when Reject button is clicked
                                                value={Request_Comment}
                                                onChange={(e) => {
                                                    setRequest_Comment(e.target.value);
                                                }}
                                            />
                                        </div>
                                        <div className="modal-footer">
                                            <button
                                                type="submit"
                                                className="btn edit--btn modal-btn"
                                                onClick={() => {
                                                    setRequest_Status("Failed");
                                                    setIsRejectButtonClicked(false); // Reset the flag when modal is closed
                                                }}
                                                data-bs-dismiss="modal"
                                            >
                                                <i className='fa-solid fa-circle-check' />ยืนยัน
                                            </button>

                                            <button
                                                type="button"
                                                className="btn btn-danger modal-btn"
                                                data-bs-dismiss="modal"
                                                onClick={() => {
                                                    setRequest_Comment(""); // Clear the comment input field
                                                    setIsRejectButtonClicked(false); // Reset the flag when modal is closed
                                                }}
                                            >
                                                <i className='fa-solid fa-circle-xmark' /> ยกเลิก
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
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

export default StaffChemicalsRequest