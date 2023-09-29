import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react'

import '../../cssElement/Table.css'
import '../../cssElement/Form.css'
import '../../cssElement/Dashboard.css'

import logo from '../../assets/logo.png';

function StaffEquipmentRequestList({ logout }) {
    const [equipmentReq, setEquipmentReq] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedIds, setSelectedIds] = useState([]);
    const [Request_Comment, setRequest_Comment] = useState("");

    useEffect(() => {
        getEquipmentRequest();
    }, [searchQuery]);

    const getEquipmentRequest = async () => {
        const response = await axios.get("https://special-problem.onrender.com/equipment-request-list");
        setEquipmentReq(response.data);
    };

    const handleCheckboxChange = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    }

    const handleDeclineChecked = async () => {
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

    const declineEquipmentRequest = async (id, comment) => {
        try {
            const data = {
                Request_Status: "Decline",
                Request_Comment: comment,
            };
            await axios.patch(`https://special-problem.onrender.com/equipment-request-list/${id}`, data);
        } catch (error) {
            console.log(error);
        }
    }

    const deleteEquipmentRequest = async (id) => {
        try {
            await axios.delete(`https://special-problem.onrender.com/equipment-request-list/${id}`)
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
                        <div className='sidebar__title admin__name'>Welcome, {staffInfo.staffFirstName}</div>
                    </div>

                    <div className='sidebar__body'>
                        <Link to="/staff-dashboard/staff-chemicals-request-list" className='sidebar__item sidebar__item--hover'> <i class="fa-regular fa-clock" /> <div className='sidebar__item--active ms-1'> Request</div></Link>
                        <Link to="/chemicals-list" className='sidebar__item sidebar__item--hover'> <i class="fa-solid fa-flask" /> Chemicals</Link>
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
                            <i class='fa-solid fa-magnifying-glass' />
                            <input
                                type="text"
                                className="component__search"
                                placeholder="ค้นหาด้วยรหัสนิสิตหรือรหัสครุภัณฑ์"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className='component__headerGroup component__headerGroup--right'>
                            <i class="fa-solid fa-circle-user" />
                            <div className='username--text thai--font'>{staffInfo.staffUsername}</div>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="Request_Comment" className="profile__label">สาเหตุในการปฏิเสธ</label>
                        <textarea
                            className="form-control thai--font"
                            id="Request_Comment"
                            rows="1"
                            value={Request_Comment}
                            onChange={(e) => setRequest_Comment(e.target.value)}
                            placeholder="กรุณากรอกสาเหตุในการปฏิเสธก่อนใช้ปุ่มปฏิเสธจากที่เลือก"
                        ></textarea>
                    </div>

                    <div>
                        <div className='table__tabs'>
                            <Link to="/staff-dashboard/staff-chemicals-request-list" className='table__tab table__tab--chemicals table__tab--unactive'>คำขอเบิกสารเคมี</Link>
                            <Link className='table__tab table__tab--equipment table__tab--active'>คำขอเบิกครุภัณฑ์</Link>
                        </div>

                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th scope="col"></th>
                                    <th scope="col">รหัสนิสิต</th>
                                    <th scope="col">รหัสครุภัณฑ์</th>
                                    <th scope="col">จำนวนที่ขอ</th>
                                    <th scope="col">จำนวนที่จ่าย</th>
                                    <th scope="col">รหัสเจ้าหน้าที่</th>
                                    <th scope="col">รหัสอาจารย์</th>
                                    <th scope="col">สถานะคำขอ</th>
                                    <th scope="col">หมายเหตุ</th>
                                    <th scope="col">วันที่ส่งคำขอ</th>
                                    <th scope="col">
                                        <button onClick={handleDeclineChecked} className="buttonTab-reject-btn thai--font">
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
                                        <td> {equipmentReq.Equipment_Id} </td>
                                        <td> {equipmentReq.Requested_Quantity} </td>
                                        <td> {equipmentReq.Release_Quantity} </td>
                                        <td> {equipmentReq.Staff_Id} </td>
                                        <td> {equipmentReq.Teacher_Id} </td>
                                        <td> <i className={`${getStatusIcon(equipmentReq.Request_Status)}`}/> {equipmentReq.Request_Status} </td>
                                        <td> {equipmentReq.Request_Comment} </td>
                                        <td>{formatDate(equipmentReq.createdAt)}</td>
                                        <td>
                                            <div className="d-grid gap-2 d-sm-flex">
                                                <Link to={`/staff-dashboard/staff-equipment-request/${equipmentReq.Equipment_Request_Id}`} className='disable--link thai--font'>
                                                    <div className="table__button">
                                                        <i class="fa-solid fa-eye"></i>
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

export default StaffEquipmentRequestList