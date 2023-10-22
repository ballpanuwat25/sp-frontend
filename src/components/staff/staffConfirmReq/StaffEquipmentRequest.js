import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import '../../cssElement/Table.css'
import '../../cssElement/Form.css'
import '../../cssElement/Dashboard.css'

import logo from '../../assets/logo.png';

function StaffEquipmentRequest({ logout }) {
    const [Equipment_Request_Id, setEquipment_Request_Id] = useState("");
    const [Equipment_Id, setEquipment_Id] = useState("");
    const [Requested_Quantity, setRequested_Quantity] = useState("");
    const [Release_Quantity, setRelease_Quantity] = useState("");

    const [Quantity, setQuantity] = useState("");

    const [Staff_Id, setStaff_Id] = useState("");
    const [Request_Status, setRequest_Status] = useState("");
    const [Request_Comment, setRequest_Comment] = useState("");

    const [staffId, setStaffId] = useState("");
    const [staffIdInputValue, setStaffIdInputValue] = useState("");

    const [isRejectButtonClicked, setIsRejectButtonClicked] = useState(false);

    const [equipment, setEquipment] = useState([]);

    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        getStaffId();
        getEquipmentById();
        getEquipmentRequestById();
        getEquipment();
    }, []);

    const getStaffId = async () => {
        try {
            const response = await axios.get("https://special-problem.onrender.com/staff", {
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

    const getEquipmentById = async () => {
        const response = await axios.get(`https://special-problem.onrender.com/equipment-list/${Equipment_Id}`);
        const equipment = response.data;
        setEquipment_Id(equipment.Equipment_Id);
        setQuantity(equipment.Quantity);
    }

    const getEquipmentRequestById = async () => {
        const result = await axios.get(`https://special-problem.onrender.com/equipment-request-list/${id}`);
        setEquipment_Request_Id(result.data.Equipment_Request_Id);
        setEquipment_Id(result.data.Equipment_Id);
        setRequested_Quantity(result.data.Requested_Quantity);
        setRelease_Quantity(result.data.Release_Quantity);
        setStaff_Id(result.data.Staff_Id);
        setRequest_Status(result.data.Request_Status);
        setRequest_Comment(result.data.Request_Comment);
    };

    const updateEquipmentRequest = async (e) => {
        e.preventDefault();

        if (Release_Quantity > Quantity) {
            notifyWarn();
            return;
        }

        if (Release_Quantity === Quantity) {
            const userSucceed = window.confirm("Are you sure you want to release all the equipment?");
            if (!userSucceed) {
                return;
            }
        }

        const newQuantity = Quantity - Release_Quantity;

        try {
            const equipmentListResponse = await axios.patch(`https://special-problem.onrender.com/equipment-list/${Equipment_Id}`, {
                Quantity: newQuantity
            });

            if (equipmentListResponse.data.Error) {
                alert(equipmentListResponse.data.Error);
            } else {
                const requestData = {
                    Equipment_Request_Id,
                    Equipment_Id,
                    Requested_Quantity,
                    Release_Quantity,
                    Staff_Id: staffIdInputValue,
                    Request_Status,
                    Request_Comment
                };
                const equipmentRequestResponse = await axios.patch(`https://special-problem.onrender.com/equipment-request-list/${id}`, requestData);

                if (equipmentRequestResponse.data.Error) {
                    alert(equipmentRequestResponse.data.Error);
                } else {
                    navigate("/staff-dashboard");
                }
            }
        } catch (error) {
            console.error("Error updating equipment request:", error);
        }
    };

    const notifyWarn = () => toast.warn("Release quantity cannot be more than the quantity!");

    useEffect(() => {
        if (!staffIdInputValue && staffId) {
            setStaffIdInputValue(staffId);
        }
    }, [staffId, staffIdInputValue]);

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

    const getEquipment = async () => {
        const response = await axios.get("https://special-problem.onrender.com/equipment-list");
        setEquipment(response.data);
    }

    const getEquipmentNameById = (equipmentId) => {
        const equipmentDetail = equipment.find((equipment) => equipment.Equipment_Id === equipmentId);
        return equipmentDetail ? equipmentDetail.Equipment_Name : "N/A";
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
                        <Link to="/staff-dashboard/staff-chemicals-receipt" className='sidebar__item sidebar__item--hover'> <i className="me-3 fa-solid fa-receipt"/> Receipt</Link>
                        <Link to="/chemicals-list" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-flask" /> Chemicals</Link>
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

                        </div>

                        <div className='component__headerGroup component__headerGroup--right'>
                            <i className="fa-solid fa-circle-user" />
                            <div className='username--text thai--font'>{staffInfo.staffUsername}</div>
                        </div>
                    </div>

                    <form onSubmit={updateEquipmentRequest}>
                        <div className="mb-3 disable">
                            <label htmlFor="Staff_Id" className="profile__label">รหัสเจ้าหน้าที่</label>
                            <input
                                type="text"
                                className="profile__input profile__input--readonly"
                                id="Staff_Id"
                                placeholder="Enter Staff Id"
                                value={staffIdInputValue}
                                onChange={(e) => {
                                    setStaffIdInputValue(e.target.value);
                                }}
                                readOnly
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="Equipment_Name" className="profile__label">ครุภัณฑ์: {getEquipmentNameById(Equipment_Id)}</label>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="Equipment_Id" className="profile__label">รหัสครุภัณฑ์</label>
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="profile__input"
                                    id="Equipment_Id"
                                    placeholder="Enter Equipment Id"
                                    required={isRejectButtonClicked}
                                    value={Equipment_Id}
                                    onChange={(e) => {
                                        setEquipment_Id(e.target.value);
                                    }}
                                />
                            </div>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="Remaining_Quantity" className="profile__label">จำนวนที่เหลือ</label>
                            <input
                                type="number"
                                className="profile__input"
                                id="Quantity"
                                placeholder="Enter Remaining Quantity"
                                required={isRejectButtonClicked}
                                value={Quantity}
                                onChange={(e) => {
                                    setQuantity(e.target.value);
                                }}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="Requested_Quantity" className="profile__label">จำนวนที่ขอ</label>
                            <input type="text" className="profile__input" id="Requested_Quantity" required={isRejectButtonClicked} value={Requested_Quantity}
                                onChange={(e) => {
                                    setRequested_Quantity(e.target.value);
                                }}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="Release_Quantity" className="profile__label">จำนวนที่จ่าย</label>
                            <input type="text" className="profile__input" id="Release_Quantity" placeholder="Enter Release Quantity" required={isRejectButtonClicked} value={Release_Quantity}
                                onChange={(e) => {
                                    setRelease_Quantity(e.target.value);
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
                                                className="form-control"
                                                id="Request_Comment"
                                                placeholder="Enter Request Comment"
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
                            <button onClick={handleLogout} className='dropdown-menu__item dropdown-menu__item--hover '> <i className="fa-solid fa-arrow-right-from-bracket" /> Logout</button>
                        </ul>
                    </div>
                </footer>
            </div>
        </div>
    )
}

export default StaffEquipmentRequest