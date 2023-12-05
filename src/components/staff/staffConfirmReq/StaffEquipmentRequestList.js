import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react'

import '../../cssElement/Table.css'
import '../../cssElement/Form.css'
import '../../cssElement/Dashboard.css'

import logo from '../../assets/logo.png';

function StaffEquipmentRequestList({ logout }) {
    const [staffInfo, setStaffInfo] = useState({
        staffId: "",
        staffFirstName: "",
        staffLastName: "",
        staffUsername: "",
        staffPassword: "",
        staffTel: "",
    })

    const [equipmentReq, setEquipmentReq] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedIds, setSelectedIds] = useState([]);
    const [Request_Comment, setRequest_Comment] = useState("");

    const [isLoading, setIsLoading] = useState(true);
    const [activeRequestId, setActiveRequestId] = useState(null);

    const [student, setStudent] = useState([]);
    const [equipment, setEquipment] = useState([]);

    const navigate = useNavigate();

    const [filteredStatus, setFilteredStatus] = useState("All");

    const handleStatusChange = (event) => {
        setFilteredStatus(event.target.value);
    }

    axios.defaults.withCredentials = true;

    useEffect(() => {
        getStudent();
        getEquipment();
    }, []);

    useEffect(() => {
        getEquipmentRequest();
    }, [searchQuery, filteredStatus]);

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

    const getEquipmentRequest = async () => {
        const response = await axios.get(process.env.REACT_APP_API + "/equipment-request-list");
        const filteredEquipmentReq = response.data.filter((equipmentReq) => {
            return (
                (filteredStatus === "All" || equipmentReq.Request_Status === filteredStatus) &&
                (equipmentReq.Student_Id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    getEquipmentNameById(equipmentReq.Equipment_Id).toLowerCase().includes(searchQuery.toLowerCase())) &&
                equipmentReq.Request_Status !== "Pending"
            )
        });

        filteredEquipmentReq.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setEquipmentReq(filteredEquipmentReq);
        setIsLoading(false);
    };

    const handleCheckboxChange = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    }

    const handleDisapprovedChecked = async () => {
        try {
            const promises = selectedIds.map((id) =>
                declineEquipmentRequest(id, Request_Comment)
            );

            await Promise.all(promises); // Wait for all requests to complete
            setSelectedIds([]); // Clear selectedIds after declining
            setRequest_Comment(""); // Clear the comment after successful decline
            getEquipmentRequest(); // Refresh the equipment request list after declining
        } catch (error) {
            console.log(error);
        }
    }

    const handleDeleteChecked = async () => {
        try {
            for (const id of selectedIds) {
                await axios.delete(process.env.REACT_APP_API + `/equipment-request-list/${id}`);
            }
            getEquipmentRequest();
            setSelectedIds([]);
        } catch (err) {
            console.log(err);
        }
    }

    const handleDelete = async (id) => {
        try {
            await axios.delete(process.env.REACT_APP_API + `/equipment-request-list/${id}`);
            getEquipmentRequest();
        } catch (err) {
            console.log(err);
        }
    }

    const declineEquipmentRequest = async (id, comment) => {
        try {
            const data = {
                Request_Status: "Disapproved",
                Request_Comment: comment,
            };
            await axios.patch(process.env.REACT_APP_API + `/equipment-request-list/${id}`, data);
        } catch (error) {
            console.log(error);
        }
    }

    const deleteEquipmentRequest = async (id) => {
        try {
            await axios.delete(process.env.REACT_APP_API + `/equipment-request-list/${id}`)
            getEquipmentRequest();
        } catch (error) {
            console.log(error)
        }
    }

    const formatDate = (dateString) => {
        const options = { day: 'numeric', month: 'numeric', year: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', options);
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

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Approved':
                return 'fa-solid fa-circle-check';
            case 'Disapproved':
                return 'fa-solid fa-circle-xmark';
            case 'Pending':
                return 'fa-regular fa-clock';
            case 'Succeed':
                return 'fa-solid fa-vial-circle-check';
            case 'Failed':
                return 'fa-solid fa-filter-circle-xmark';
            default:
                return ''
        }
    };

    const getStudent = async () => {
        const response = await axios.get(process.env.REACT_APP_API + "/student-list");
        setStudent(response.data);
    }

    const getEquipment = async () => {
        const response = await axios.get(process.env.REACT_APP_API + "/equipment-list");
        setEquipment(response.data);
    }

    const getStudentNameById = (studentId) => {
        const studentDetail = student.find((student) => student.Student_Id === studentId);
        return studentDetail ? studentDetail.Student_FName + " " + studentDetail.Student_LName : "N/A";
    };

    const getEquipmentNameById = (equipmentId) => {
        const equipmentDetail = equipment.find((equipment) => equipment.Equipment_Id === equipmentId);
        return equipmentDetail ? equipmentDetail.Equipment_Name : "N/A";
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
                                        placeholder="ค้นหาด้วยรหัสนิสิตหรือชื่อครุภัณฑ์"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>

                                <div className='component__headerGroup component__headerGroup--right'>
                                    <i className="fa-solid fa-circle-user" />
                                    <div className='username--text thai--font'>{staffInfo.staffUsername}</div>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label htmlFor="Request_Comment" className="profile__label">เหตุผลในการปฏิเสธ</label>
                                <textarea
                                    className="form-control thai--font"
                                    id="Request_Comment"
                                    rows="1"
                                    value={Request_Comment}
                                    onChange={(e) => setRequest_Comment(e.target.value)}
                                    placeholder="กรุณาระบุเหตุผลในการปฏิเสธก่อนใช้ปุ่มปฏิเสธจากที่เลือก"
                                ></textarea>
                            </div>

                            <div>
                                <div className='table__tabs'>
                                    <Link to="/staff-dashboard/staff-chemicals-request-list" className='table__tab table__tab--chemicals table__tab--unactive'>คำขอเบิกสารเคมี</Link>
                                    <Link className='table__tab table__tab--equipment table__tab--active'>คำขอเบิกครุภัณฑ์</Link>
                                    <Link to="/report-request" className='table__tab table__tab--equipment table__tab--unactive'>ออกรายงาน</Link>
                                </div>

                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th scope="col"></th>
                                            <th scope="col">รหัสนิสิต</th>
                                            <th scope="col">ชื่อ-สกุล</th>
                                            <th scope="col">ครุภัณฑ์</th>
                                            <th scope="col">จำนวนที่ขอ</th>
                                            <th scope="col">จำนวนที่ให้</th>
                                            <th scope="col">
                                                <select
                                                    id="statusFilter"
                                                    className="form-select"
                                                    onChange={handleStatusChange}
                                                    value={filteredStatus}
                                                >
                                                    <option value="All">ทั้งหมด</option>
                                                    <option value="Approved">อนุมัติ</option>
                                                    <option value="Disapproved">ไม่อนุมัติ</option>
                                                    <option value="Succeed">สำเร็จ</option>
                                                    <option value="Failed">ล้มเหลว</option>
                                                </select>
                                            </th>
                                            <th scope="col">หมายเหตุ</th>
                                            <th scope="col">วันที่ส่งคำขอ</th>
                                            <th scope="col">
                                                <button onClick={handleDisapprovedChecked} className="buttonTab-reject-btn thai--font">
                                                    ปฏิเสธจากที่เลือก
                                                </button>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {equipmentReq.map((equipmentReq) => (
                                            <tr key={equipmentReq.Equipment_Request_Id} className="active-row">
                                                <td>
                                                    <div className="form-check">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            value={equipmentReq.Equipment_Request_Id}
                                                            id={`flexCheckDefault-${equipmentReq.Equipment_Request_Id}`}
                                                            checked={selectedIds.includes(equipmentReq.Equipment_Request_Id)}
                                                            onChange={() => handleCheckboxChange(equipmentReq.Equipment_Request_Id)}
                                                        />
                                                    </div>
                                                </td>
                                                <td> {equipmentReq.Student_Id} </td>
                                                <td> {getStudentNameById(equipmentReq.Student_Id)} </td>
                                                <td> {getEquipmentNameById(equipmentReq.Equipment_Id)} </td>
                                                <td> {equipmentReq.Requested_Quantity} </td>
                                                <td> {equipmentReq.Release_Quantity} </td>
                                                <td> <i className={`${getStatusIcon(equipmentReq.Request_Status)}`} /> {equipmentReq.Request_Status} </td>
                                                <td> {equipmentReq.Request_Comment} </td>
                                                <td>{formatDate(equipmentReq.createdAt)}</td>
                                                <td>
                                                    <div className="d-grid gap-2 d-sm-flex">
                                                        <Link to={`/staff-dashboard/staff-equipment-request/${equipmentReq.Equipment_Request_Id}`} className='disable--link thai--font'>
                                                            <div className="table__button">
                                                                <i className="fa-solid fa-eye"></i>
                                                                ดูรายละเอียด
                                                            </div>
                                                        </Link>
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

export default StaffEquipmentRequestList