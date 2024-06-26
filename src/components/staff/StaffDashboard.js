import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import '../cssElement/Table.css'
import '../cssElement/Form.css'
import '../cssElement/Dashboard.css'

import logo from '../assets/logo.png';

function StaffDashboard({logout}) {

    const [chemicalsReq, setChemicalsReq] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    const [selectedIds, setSelectedIds] = useState([]);

    const [Request_Comment, setRequest_Comment] = useState("");

    useEffect(() => {
        notify();
    }, []);

    const notify = () => toast.info("หลังใช้งานเสร็จควรออกจากระบบทุกครั้ง เพื่อไม่ให้เกิดปัญหาในการเข้าสู่ระบบครั้งถัดไป");

    useEffect(() => {
        getChemicalsRequest();
    }, [searchQuery]);

    const getChemicalsRequest = async () => {
        const response = await axios.get(process.env.REACT_APP_API + "/chemicals-request-list");
        const filteredChemicalsReq = response.data.filter(chemicalsReq => {
            return (
                chemicalsReq.Student_Id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                chemicalsReq.Chem_Id.toLowerCase().includes(searchQuery.toLowerCase())
            );
        });
        setChemicalsReq(filteredChemicalsReq);
    };

    const updateChemicalsRequestStatus = async (id, status, comment) => {
        try {
            const data = {
                Request_Status: status,
                Request_Comment: comment,
            };
            await axios.patch(process.env.REACT_APP_API + `/chemicals-request-list/${id}`, data);
        } catch (error) {
            console.log(error);
        }
    }

    const deleteChemicalsRequest = async (id) => {
        try {
            await axios.delete(process.env.REACT_APP_API + `/chemicals-request-list/${id}`)
            getChemicalsRequest();
        } catch (error) {
            console.log(error)
        }
    }

    const formatDate = (dateString) => {
        const options = { day: 'numeric', month: 'numeric', year: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', options);
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
                updateChemicalsRequestStatus(id, "Failed", Request_Comment) // Set status to "Failed" for all selected items
            );

            await Promise.all(promises); // Wait for all requests to complete
            setSelectedIds([]); // Clear selectedIds after declining
            setRequest_Comment(""); // Clear the comment after successful decline
            getChemicalsRequest(); // Refresh the chemicals request list after declining
        } catch (error) {
            console.log(error);
        }
    }

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
                            <i className='fa-solid fa-magnifying-glass' />
                            <input
                                type="text"
                                className="component__search"
                                placeholder="ค้นหาด้วยรหัสนิสิตหรือรหัสสารเคมี"
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
                            <Link className='table__tab table__tab--chemicals table__tab--active'>คำขอเบิกสารเคมี</Link>
                            <Link to="/staff-dashboard/staff-equipment-request-list" className='table__tab table__tab--equipment table__tab--unactive'>คำขอเบิกครุภัณฑ์</Link>
                        </div>

                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th scope="col"></th>
                                    <th scope="col">รหัสนิสิต</th>
                                    <th scope="col">รหัสสาร</th>
                                    <th scope="col">รหัสขวด</th>
                                    <th scope="col">ปริมาณที่ขอ</th>
                                    <th scope="col">ปริมาณที่จ่าย</th>
                                    <th scope="col">หน่วยนับ</th>
                                    <th scope="col">รหัสเจ้าหน้าที่</th>
                                    <th scope="col">รหัสอาจารย์</th>
                                    <th scope="col">สถานะคำขอ</th>
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
                                {chemicalsReq.map((chemicalsReq) => (
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
                                        <td> {chemicalsReq.Chem_Id} </td>
                                        <td> {chemicalsReq.Chem_Bottle_Id} </td>
                                        <td> {chemicalsReq.Requested_Quantity} </td>
                                        <td> {chemicalsReq.Release_Quantity} </td>
                                        <td> {chemicalsReq.Counting_Unit} </td>
                                        <td> {chemicalsReq.Staff_Id} </td>
                                        <td> {chemicalsReq.Teacher_Id} </td>
                                        <td> <i className={`${getStatusIcon(chemicalsReq.Request_Status)}`} /> {chemicalsReq.Request_Status}</td>
                                        <td> {chemicalsReq.Request_Comment} </td>
                                        <td>{formatDate(chemicalsReq.createdAt)}</td>
                                        <td>
                                            <div className="d-grid gap-2 d-sm-flex">
                                                <Link to={`/staff-dashboard/staff-chemicals-request/${chemicalsReq.Chem_Request_Id}`} className='disable--link thai--font'>
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
                            <Link to="/staff-profile" className='dropdown-menu__item'> <i className="fa-regular fa-user" /> Profile</Link>
                            <button onClick={handleLogout} className='dropdown-menu__item dropdown-menu__item--hover '> <i className="fa-solid fa-arrow-right-from-bracket" /> Logout</button>
                        </ul>
                    </div>
                </footer>
            </div>
        </div>
    )
}

export default StaffDashboard