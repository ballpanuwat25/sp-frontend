import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import '../../cssElement/Table.css'
import '../../cssElement/Form.css'
import '../../cssElement/Dashboard.css'

import logo from '../../assets/logo.png';

function TeacherEquipmentRequest({ logout }) {
    const [teacherInfo, setTeacherInfo] = useState({
        teacherId: "",
        teacherFirstName: "",
        teacherLastName: "",
        teacherUsername: "",
        teacherPassword: "",
        teacherTel: "",
    });

    const [equipmentReq, setEquipmentReq] = useState([]);

    const [Request_Comment, setRequest_Comment] = useState("");
    const [activeRequestId, setActiveRequestId] = useState(null);
    const [selectedIds, setSelectedIds] = useState([]);

    const [studentIdSearch, setStudentIdSearch] = useState("");
    const [teacherIdSearch, setTeacherIdSearch] = useState("");

    const [equipmentDetail, setEquipmentDetail] = useState([]);

    const [student, setStudent] = useState([]);

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);

    const [filteredStatus, setFilteredStatus] = useState('All'); 

    axios.defaults.withCredentials = true;

    useEffect(() => {
        getEquipmentRequest();
        getEquipmentDetail();
        getStudent();
    }, []);

    useEffect(() => {
        setTeacherIdSearch(teacherInfo.teacherId);
    }, [teacherInfo.teacherId]);

    useEffect(() => {
        axios.get(process.env.REACT_APP_API + "/teacher", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("teacherToken")}`,
            },
        }).then((response) => {
            if (response.data.Error) {
                alert(response.data.Error);
            } else {
                setTeacherInfo(response.data);
            }
        });
    }, []);

    const getEquipmentRequest = async () => {
        const response = await axios.get(process.env.REACT_APP_API + "/equipment-request-list");
        setEquipmentReq(response.data);
        setIsLoading(false);
    };

    const formatDate = (dateString) => {
        const options = { day: 'numeric', month: 'numeric', year: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', options);
    };

    const approveEquipmentRequest = async (id) => {
        try {
            await updateEquipmentRequestStatus(id, "Approved");
        } catch (err) {
            console.log(err);
        }
    }

    const declineEquipmentRequest = async () => {
        try {
            if (activeRequestId) {
                await updateEquipmentRequestStatus(activeRequestId, "Disapproved", Request_Comment);
                setRequest_Comment("");
                setActiveRequestId(null);
            }
        } catch (err) {
            console.log(err);
        }
    }

    const updateEquipmentRequestStatus = async (id, status, comment) => {
        try {
            const data = {
                Request_Status: status,
                Request_Comment: comment,
            };
            await axios.patch(process.env.REACT_APP_API + `/equipment-request-list/${id}`, data);
            getEquipmentRequest();
        } catch (err) {
            console.log(err);
        }
    }

    const handleCheckAll = () => {
        if (selectedIds.length === equipmentReq.length) {
            // If all checkboxes are already checked, uncheck them all
            setSelectedIds([]);
        } else {
            // Otherwise, check all checkboxes
            const allIds = equipmentReq.map((req) => req.Equipment_Request_Id);
            setSelectedIds(allIds);
        }
    };

    const handleApprovedChecked = () => {
        selectedIds.forEach((id) => approveEquipmentRequest(id));
        setSelectedIds([]);
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

    const handleCheckboxChange = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    }

    useEffect(() => {
        const filteredRequests = equipmentReq.filter((req) => {
            const studentIdRegex = new RegExp(studentIdSearch, "i");
            const teacherIdRegex = new RegExp(teacherIdSearch, "i");
            const studentIdMatch = studentIdSearch ? studentIdRegex.test(req.Student_Id) : true;
            const teacherIdMatch = teacherIdSearch ? teacherIdRegex.test(req.Teacher_Id) : true;
            const statusMatch = filteredStatus === 'All' ? true : req.Request_Status === filteredStatus;

            // Apply both teacher ID and status filters together
            return studentIdMatch && teacherIdMatch && statusMatch;
        });

        const sortedEquipmentReq = filteredRequests.slice().sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        setFilteredEquipmentReq(sortedEquipmentReq);
    }, [studentIdSearch, teacherIdSearch, equipmentReq, filteredStatus]);

    const [filteredEquipmentReq, setFilteredEquipmentReq] = useState([]);

    const handleLogout = () => {
        axios.get(process.env.REACT_APP_API + "/teacher-logout").then((response) => {
            if (response.data.Error) {
                alert(response.data.Error);
            } else {
                logout();
                localStorage.removeItem('teacherToken');
                navigate("/chem");
            }
        });
    };

    const getEquipmentDetail = async () => {
        const response = await axios.get(process.env.REACT_APP_API + "/equipment-list");
        setEquipmentDetail(response.data);
        setIsLoading(false);
    };

    const findEquipmentName = (equipId) => {
        const equipment = equipmentDetail.find((equip) => equip.Equipment_Id === equipId);
        return equipment ? equipment.Equipment_Name : "";
    }

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

    const getStudentNameById = (studentId) => {
        const studentDetail = student.find((student) => student.Student_Id === studentId);
        return studentDetail ? studentDetail.Student_FName + " " + studentDetail.Student_LName : "N/A";
    };

    const filterRequestsByStatus = (status) => {
        if (status === 'All') {
            setFilteredEquipmentReq(equipmentReq);
        } else {
            const filteredRequests = equipmentReq.filter((req) => req.Request_Status === status);
            setFilteredEquipmentReq(filteredRequests);
        }
    };

    const handleStatusChange = (event) => {
        const selectedStatus = event.target.value;
        setFilteredStatus(selectedStatus);
        filterRequestsByStatus(selectedStatus);
    };

    return (
        <div className='container-fluid vh-100'>
            <div className='dashboard__container'>
                <aside className='sidebar'>
                    <div className='sidebar__header'>
                        <img src={logo} alt="logo" className='sidebar__logo' width={49} height={33} />
                        <div className='sidebar__title admin__name'>Welcome, {teacherInfo.teacherFirstName}</div>
                    </div>
                    <div className='sidebar__body'>
                        <Link to="/chem/teacher-dashboard/teacher-chemicals-request" className='sidebar__item sidebar__item--hover'> <i className="fa-regular fa-clock" /> <div className='sidebar__item--active ms-1'>Request</div></Link>
                        <Link to="/chem/teacher-dashboard/chemicals-bundle-list" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-list" /> List</Link>
                        <Link to="/chem/teacher-dashboard/bundle-list" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-boxes-stacked" /> Bundle</Link>
                        <Link to="/chem/teacher-profile" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-user" /> Profile</Link>
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
                                    <i className='fa-solid fa-magnifying-glass'></i>
                                    <input
                                        type="search"
                                        className='component__search'
                                        placeholder="ค้นหาด้วยรหัสนิสิต"
                                        value={studentIdSearch}
                                        id="studentIdSearch"
                                        onChange={(e) => setStudentIdSearch(e.target.value)}
                                    />
                                    <input
                                        type="search"
                                        className='disable'
                                        id="teacherIdSearch"
                                        value={teacherIdSearch}
                                        onChange={(e) => setTeacherIdSearch(e.target.value)}
                                        readOnly
                                    />
                                </div>

                                <div className='component__headerGroup component__headerGroup--right'>
                                    <i className="fa-solid fa-circle-user" />
                                    <div className='username--text thai--font'>{teacherInfo.teacherUsername}</div>
                                </div>
                            </div>

                            <div>
                                <div className='table__tabs'>
                                    <Link to="/chem/teacher-dashboard/teacher-chemicals-request" className='table__tab table__tab--chemicals table__tab--unactive'>คำขอเบิกสารเคมี</Link>
                                    <Link className='table__tab table__tab--equipment table__tab--active'>คำขอเบิกครุภัณฑ์</Link>
                                </div>

                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th scope="col">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    checked={selectedIds.length === equipmentReq.length}
                                                    onChange={handleCheckAll}
                                                />
                                            </th>
                                            <th scope="col">รหัสนิสิต</th>
                                            <th scope="col">ชื่อ-สกุล</th>
                                            <th scope="col">ครุภัณฑ์</th>
                                            <th scope="col">จำนวนที่ขอ</th>
                                            <th scope="col">
                                                <select
                                                    id="statusFilter"
                                                    className="form-select"
                                                    onChange={handleStatusChange}
                                                    value={filteredStatus}
                                                >
                                                    <option value="All">ทั้งหมด</option>
                                                    <option value="Pending">รอดำเนินการ</option>
                                                    <option value="Approved">อนุมัติ</option>
                                                    <option value="Disapproved">ไม่อนุมัติ</option>
                                                    <option value="Succeed">สำเร็จ</option>
                                                    <option value="Failed">ล้มเหลว</option>
                                                </select>
                                            </th>
                                            <th scope="col">วัตถุประสงค์</th>
                                            <th scope="col">นำไปใช้ห้อง</th>
                                            <th scope="col">วันที่ส่งคำขอ</th>
                                            <th scope="col">
                                                <button className="buttonTab-btn thai--font" onClick={handleApprovedChecked}>
                                                    อนุมัติจากที่เลือก
                                                </button>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredEquipmentReq.map((equipmentReq) => (
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
                                                <td> {findEquipmentName(equipmentReq.Equipment_Id)} </td>
                                                <td> {equipmentReq.Requested_Quantity} </td>
                                                <td> <i className={`${getStatusIcon(equipmentReq.Request_Status)}`} /> {equipmentReq.Request_Status} </td>
                                                <td> {equipmentReq.Request_Purpose} </td>
                                                <td> {equipmentReq.Request_Room} </td>
                                                <td>{formatDate(equipmentReq.createdAt)}</td>
                                                <td>
                                                    <div className="d-grid gap-2 d-sm-flex">
                                                        <button onClick={() => approveEquipmentRequest(equipmentReq.Equipment_Request_Id)} className="edit--btn w-100">
                                                            <i className='fa-solid fa-circle-check' />
                                                            อนุมัติ
                                                        </button>
                                                        <button
                                                            className="delete--btn btn-danger w-100"
                                                            data-bs-toggle="modal" data-bs-target={`#exampleModal-${equipmentReq.Equipment_Request_Id}`}
                                                            onClick={() => setActiveRequestId(equipmentReq.Equipment_Request_Id)}
                                                        >
                                                            <i className='fa-solid fa-circle-xmark' />
                                                            ปฏิเสธ
                                                        </button>

                                                        <div className="modal fade" id={`exampleModal-${equipmentReq.Equipment_Request_Id}`} tabIndex="-1" aria-labelledby={`exampleModalLabel-${equipmentReq.Equipment_Request_Id}`} aria-hidden="true">
                                                            <div className="modal-dialog">
                                                                <div className="modal-content">
                                                                    <div className="modal-header">
                                                                        <h5 className="modal-title" id="exampleModalLabel">เหตุผลในการปฏิเสธ</h5>
                                                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                                    </div>
                                                                    <div className="modal-body">
                                                                        <div className="mb-3">
                                                                            <label htmlFor="Request_Comment" className="form-label">หมายเหตุ*</label>
                                                                            <input type="text" className="form-control" id="Request_Comment" placeholder="Enter Request Comment" value={Request_Comment} required
                                                                                onChange={(e) => {
                                                                                    setRequest_Comment(e.target.value);
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="modal-footer">
                                                                        <button onClick={declineEquipmentRequest} type="button" className="btn edit--btn modal-btn" data-bs-dismiss="modal"><i className='fa-solid fa-circle-check' />ยืนยัน</button>
                                                                        <button type="button" className="btn btn-danger modal-btn" data-bs-dismiss="modal"><i className='fa-solid fa-circle-xmark' /> ยกเลิก</button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
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
                    <Link to="/chem/teacher-dashboard/teacher-chemicals-request" className='footer__item'> <i className="fa-regular fa-clock" /></Link>
                    <Link to="/chem/teacher-dashboard/chemicals-bundle-list" className='footer__item'> <i className="fa-solid fa-list" /></Link>
                    <Link to="/chem/teacher-dashboard/bundle-list" className='footer__item'> <i className="fa-solid fa-boxes-stacked" /></Link>
                    <div className="dropup">
                        <button type="button" className='dropdown-toggle' data-bs-toggle="dropdown" aria-expanded="false">
                            <i className="fa-solid fa-user" />
                        </button>
                        <ul className="dropdown-menu">
                            <Link to="/chem/teacher-profile" className='dropdown-menu__item dropdown-menu__item--hover'> <i className="fa-solid fa-user" /> Profile</Link>
                            <button onClick={handleLogout} className='dropdown-menu__item dropdown-menu__item--hover '> <i className="fa-solid fa-arrow-right-from-bracket" /> Logout</button>
                        </ul>
                    </div>
                </footer>
            </div>
        </div>
    )
}

export default TeacherEquipmentRequest;