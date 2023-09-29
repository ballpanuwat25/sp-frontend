import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import '../cssElement/Table.css'
import '../cssElement/Form.css'
import '../cssElement/Dashboard.css'

import logo from '../assets/logo.png';

function TeacherDashboard({ logout }) {
    const [teacherInfo, setTeacherInfo] = useState({
        teacherId: "",
        teacherFirstName: "",
        teacherLastName: "",
        teacherUsername: "",
        teacherPassword: "",
        teacherTel: "",
    });

    const [chemicalsReq, setChemicalsReq] = useState([]);

    const [Request_Comment, setRequest_Comment] = useState("");
    const [activeRequestId, setActiveRequestId] = useState(null);
    const [selectedIds, setSelectedIds] = useState([]);

    const [studentIdSearch, setStudentIdSearch] = useState("");
    const [teacherIdSearch, setTeacherIdSearch] = useState("");

    axios.defaults.withCredentials = true;

    useEffect(() => {
        axios.get("https://special-problem.onrender.com/teacher", {
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

    useEffect(() => {
        getChemicalsRequest();
    }, []);

    const getChemicalsRequest = async () => {
        const response = await axios.get("https://special-problem.onrender.com/chemicals-request-list");
        setChemicalsReq(response.data);
    };

    const formatDate = (dateString) => {
        const options = { day: 'numeric', month: 'numeric', year: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', options);
    };

    const approveChemicalsRequest = async (id) => {
        try {
            await updateChemicalsRequestStatus(id, "Approve");
        } catch (error) {
            console.log(error)
        }
    }

    const declineChemicalsRequest = async () => {
        try {
            if (activeRequestId) {
                await updateChemicalsRequestStatus(activeRequestId, "Decline", Request_Comment);
                setRequest_Comment(""); // Clear the comment after successful decline
                setActiveRequestId(null); // Reset activeRequestId after successful decline
            }
        } catch (error) {
            console.log(error)
        }
    }

    const updateChemicalsRequestStatus = async (id, status, comment) => {
        try {
            const data = {
                Request_Status: status,
                Request_Comment: comment,
            };
            await axios.patch(`https://special-problem.onrender.com/chemicals-request-list/${id}`, data);
            getChemicalsRequest(); // Refresh the chemicals request list after updating status
        } catch (error) {
            console.log(error);
        }
    }

    const handleCheckAll = () => {
        if (selectedIds.length === chemicalsReq.length) {
            // If all checkboxes are already checked, uncheck them all
            setSelectedIds([]);
        } else {
            // Otherwise, check all checkboxes
            const allIds = chemicalsReq.map((req) => req.Chem_Request_Id);
            setSelectedIds(allIds);
        }
    };

    const handleApproveChecked = () => {
        selectedIds.forEach((id) => approveChemicalsRequest(id));
        setSelectedIds([]);
    }

    const handleCheckboxChange = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    }

    const filterChemicalsReq = (data) => {
        const studentIdRegex = new RegExp(studentIdSearch, "i"); // "i" flag for case-insensitive search
        const teacherIdRegex = new RegExp(teacherIdSearch, "i"); // "i" flag for case-insensitive search

        return data.filter((req) => {
            const studentIdMatch = studentIdSearch ? studentIdRegex.test(req.Student_Id) : true;
            const teacherIdMatch = teacherIdSearch ? teacherIdRegex.test(req.Teacher_Id) : true;

            return studentIdMatch && teacherIdMatch;
        });
    };

    const filteredChemicalsReq = filterChemicalsReq(chemicalsReq);

    useEffect(() => {
        setTeacherIdSearch(teacherInfo.teacherId); // Set teacherIdSearch with the value from API response
    }, [teacherInfo.teacherId]);

    const navigate = useNavigate();

    const handleLogout = () => {
        axios.get("https://special-problem.onrender.com/teacher-logout").then((response) => {
            if (response.data.Error) {
                alert(response.data.Error);
            } else {
                localStorage.removeItem('teacherToken');
                navigate("/");
                logout();
            }
        });
    };

    const [chemicalsDetail, setChemicalsDetail] = useState([]);

    useEffect(() => {
        getChemicalsDetail();
    }, []);

    const getChemicalsDetail = async () => {
        const response = await axios.get("https://special-problem.onrender.com/chemicalsDetail-list");
        setChemicalsDetail(response.data);
    };

    const findChemNameById = (chemId) => {
        const chem = chemicalsDetail.find((chem) => chem.Chem_Id === chemId);
        return chem ? chem.Chem_Name : "";
    }

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Approve':
                return 'fa-solid fa-circle-check';
            case 'Decline':
                return 'fa-solid fa-circle-xmark';
            case 'Pending':
                return 'fa-regular fa-clock';
            case 'Confirmed':
                return 'fa-solid fa-vial-circle-check';
            case 'Rejected':
                return 'fa-solid fa-filter-circle-xmark';
            default:
                return ''
        }
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
                        <Link to="/teacher-dashboard/teacher-chemicals-request" className='sidebar__item sidebar__item--hover'> <i class="fa-regular fa-clock" /> <div className='sidebar__item--active ms-1'>Request</div></Link>
                        <Link to="/teacher-dashboard/chemicals-bundle-list" className='sidebar__item sidebar__item--hover'> <i class="fa-solid fa-list" /> List</Link>
                        <Link to="/teacher-dashboard/bundle-list" className='sidebar__item sidebar__item--hover'> <i class="fa-solid fa-boxes-stacked" /> Bundle</Link>
                        <Link to="/teacher-profile" className='sidebar__item sidebar__item--hover'> <i class="fa-solid fa-user" /> Profile</Link>
                    </div>
                    <div className='sidebar__footer'>
                        <button onClick={handleLogout} className='sidebar__item sidebar__item--footer sidebar__item--hover '> <i class="fa-solid fa-arrow-right-from-bracket" /> Logout</button>
                    </div>
                </aside>

                <main className='dashboard__content'>
                    <div className='component__header'>
                        <div className='component__headerGroup component__headerGroup--left'>
                            <i class='fa-solid fa-magnifying-glass' />
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
                            <i class="fa-solid fa-circle-user" />
                            <div className='username--text thai--font'>{teacherInfo.teacherUsername}</div>
                        </div>
                    </div>

                    <div>
                        <div className='table__tabs'>
                            <Link className='table__tab table__tab--chemicals table__tab--active'>คำขอเบิกสารเคมี</Link>
                            <Link to="/teacher-dashboard/teacher-equipment-request" className='table__tab table__tab--equipment table__tab--unactive'>คำขอเบิกครุภัณฑ์</Link>
                        </div>

                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th scope="col">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            checked={selectedIds.length === chemicalsReq.length}
                                            onChange={handleCheckAll}
                                        />
                                    </th>
                                    <th scope="col">รหัสนิสิต</th>
                                    <th scope="col">สารเคมี</th>
                                    <th scope="col">ปริมาณที่ขอ</th>
                                    <th scope="col">หน่วยนับ</th>
                                    <th scope="col">สถานะคำขอ</th>
                                    <th scope="col">วัตถุประสงค์</th>
                                    <th scope="col">นำไปใช้ห้อง</th>
                                    <th scope="col">วันที่ส่งคำขอ</th>
                                    <th scope="col">
                                        <button className="buttonTab-btn thai--font" onClick={handleApproveChecked}>
                                            อนุมัติจากที่เลือก
                                        </button>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredChemicalsReq.map((chemicalsReq) => (
                                    <tr key={chemicalsReq.Chem_Request_Id} className="active-row">
                                        <td>
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    value={chemicalsReq.Chem_Request_Id}
                                                    id={`flexCheckDefault-${chemicalsReq.Chem_Request_Id}`}
                                                    checked={selectedIds.includes(chemicalsReq.Chem_Request_Id)}
                                                    onChange={() => handleCheckboxChange(chemicalsReq.Chem_Request_Id)}
                                                />
                                            </div>
                                        </td>
                                        <td> {chemicalsReq.Student_Id} </td>
                                        <td> {findChemNameById(chemicalsReq.Chem_Id)} </td>
                                        <td> {chemicalsReq.Requested_Quantity} </td>
                                        <td> {chemicalsReq.Counting_Unit} </td>
                                        <td> <i className={`${getStatusIcon(chemicalsReq.Request_Status)}`} /> {chemicalsReq.Request_Status}</td>
                                        <td> {chemicalsReq.Request_Purpose} </td>
                                        <td> {chemicalsReq.Request_Room} </td>
                                        <td>{formatDate(chemicalsReq.createdAt)}</td>
                                        <td>
                                            <div className="d-grid gap-2 d-sm-flex">
                                                <button onClick={() => approveChemicalsRequest(chemicalsReq.Chem_Request_Id)} className="edit--btn">
                                                    <i className='fa-solid fa-circle-check' />
                                                    อนุมัติ
                                                </button>
                                                <button
                                                    className="delete--btn btn-danger"
                                                    data-bs-toggle="modal" data-bs-target={`#exampleModal-${chemicalsReq.Chem_Request_Id}`}
                                                    onClick={() => setActiveRequestId(chemicalsReq.Chem_Request_Id)}
                                                >
                                                    <i className='fa-solid fa-circle-xmark' />
                                                    ปฏิเสธ
                                                </button>

                                                <div className="modal fade" id={`exampleModal-${chemicalsReq.Chem_Request_Id}`} tabIndex="-1" aria-labelledby={`exampleModalLabel-${chemicalsReq.Chem_Request_Id}`} aria-hidden="true">
                                                    <div className="modal-dialog">
                                                        <div className="modal-content">
                                                            <div className="modal-header">
                                                                <h5 className="modal-title" id="exampleModalLabel">เหตุผลในการปฏิเสธ</h5>
                                                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                            </div>
                                                            <div className="modal-body">
                                                                <div className="mb-3">
                                                                    <label htmlFor="Request_Comment" className="form-label">หมายเหตุ*</label>
                                                                    <input type="text" className="form-control" id="Request_Comment" placeholder="เช่น สารเคมีหมด ฯลฯ" value={Request_Comment} required
                                                                        onChange={(e) => {
                                                                            setRequest_Comment(e.target.value);
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="modal-footer">
                                                                <button onClick={declineChemicalsRequest} type="button" className="btn edit--btn modal-btn" data-bs-dismiss="modal"> <i className='fa-solid fa-circle-check' />ยืนยัน</button>
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
                </main>

                <footer className='footer'>
                    <Link to="/teacher-dashboard/teacher-chemicals-request" className='footer__item'> <i class="fa-regular fa-clock" /></Link>
                    <Link to="/teacher-dashboard/chemicals-bundle-list" className='footer__item'> <i class="fa-solid fa-list" /></Link>
                    <Link to="/teacher-dashboard/bundle-list" className='footer__item'> <i class="fa-solid fa-boxes-stacked" /></Link>
                    <div className="dropup">
                        <button type="button" className='dropdown-toggle' data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="fa-solid fa-user" />
                        </button>
                        <ul class="dropdown-menu">
                            <Link to="/teacher-profile" className='dropdown-menu__item dropdown-menu__item--hover'> <i class="fa-solid fa-user" /> Profile</Link>
                            <button onClick={handleLogout} className='dropdown-menu__item dropdown-menu__item--hover '> <i class="fa-solid fa-arrow-right-from-bracket" /> Logout</button>
                        </ul>
                    </div>
                </footer>
            </div>
        </div>
    )
}

export default TeacherDashboard