import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import '../../cssElement/Table.css'
import '../../cssElement/Form.css'
import '../../cssElement/Dashboard.css'

import logo from '../../assets/logo.png';

function AStudentList({ logout }) {
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [staffInfo, setStaffInfo] = useState({
        staffId: "",
        staffFirstName: "",
        staffLastName: "",
        staffUsername: "",
        staffPassword: "",
        staffTel: "",
    });

    const [searchQuery, setSearchQuery] = useState("");
    const [filteredStudents, setFilteredStudents] = useState([]);

    const [checkedStudents, setCheckedStudents] = useState([]);

    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    useEffect(() => {
        getStudents();
    }, []);

    useEffect(() => {
        setFilteredStudents(students);
    }, [students]);

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

    const getStudents = async () => {
        const response = await axios.get(process.env.REACT_APP_API + "/approve-student-list");
        setStudents(response.data);
        setIsLoading(false);
    };

    const handleApprove = async (id, firstName, lastName, email, tel, password) => {
        try {
            await axios.post(process.env.REACT_APP_API + "/student-list", {
                Student_Id: id,
                Student_FName: firstName,
                Student_LName: lastName,
                Student_Email: email,
                Student_Tel: tel,
                Student_Password: password,
            });
            toast.success("Approve Success");
            deleteStudent(id);
            window.location.href = "/chem/current-students-list";
        } catch (error) {
            console.error(error);
            if (error.response.status === 400) toast.error("Student id already exists");
        }
    };

    const deleteStudent = async (id) => {
        try {
            await axios.delete(process.env.REACT_APP_API + `/approve-student-list/${id}`)
            getStudents();
        } catch (error) {
            console.error(error);
        }
    };

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        const filteredStudents = students.filter((student) =>
            student.Student_Id.toLowerCase().includes(query.toLowerCase()) ||
            student.Student_FName.toLowerCase().includes(query.toLowerCase()) ||
            student.Student_LName.toLowerCase().includes(query.toLowerCase()) ||
            student.Student_Email.toLowerCase().includes(query.toLowerCase())
        );

        setFilteredStudents(filteredStudents);
    };

    const handleCheck = (e) => {
        const studentId = e.target.value;
        setCheckedStudents((prevCheckedStudents) => {
            if (prevCheckedStudents.includes(studentId)) {
                return prevCheckedStudents.filter((id) => id !== studentId);
            } else {
                return [...prevCheckedStudents, studentId];
            }
        });
    };

    const handleCheckAll = (e) => {
        if (e.target.checked) {
            // If "Check All" is checked, select all students
            setCheckedStudents(students.map((student) => student.Student_Id));
        } else {
            // If "Check All" is unchecked, deselect all students
            setCheckedStudents([]);
        }
    };

    const approveByCheck = () => {
        checkedStudents.forEach((studentId) => {
            const student = students.find((s) => s.Student_Id === studentId);
            if (student) {
                handleApprove(
                    student.Student_Id,
                    student.Student_FName,
                    student.Student_LName,
                    student.Student_Email,
                    student.Student_Tel,
                    student.Student_Password
                );
                deleteStudent(student.Student_Id);
                window.location.href = "/chem/current-students-list";
            }
        });
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
                        <Link to="/staff-dashboard/staff-chemicals-request-list" className='sidebar__item sidebar__item--hover'> <i className="fa-regular fa-clock" /> <div className='ms-1'> Request</div></Link>
                        <Link to="/chemicals-list" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-flask" />  Chemicals</Link>
                        <Link to="/equipment-list" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-toolbox" />Equipment</Link>
                        <Link to="/chemicals-stock" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-flask-vial" /> Stock</Link>
                        <Link to="/approve-students-list" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-users" /><div className='sidebar__item--active'> Users</div></Link>
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
                                        placeholder="ค้นหาด้วยชื่อหรือรหัสนิสิต"
                                        value={searchQuery}
                                        onChange={handleSearch}
                                    />
                                </div>

                                <div className='component__headerGroup component__headerGroup--right'>
                                    <i className="fa-solid fa-circle-user" />
                                    <div className='username--text thai--font'>{staffInfo.staffUsername}</div>
                                </div>
                            </div>

                            <div>
                                <div className='table__tabs'>
                                    <Link className='table__tab table__tab--chemicals table__tab--active'>นิสิตรอการอนุมัติ</Link>
                                    <Link to="/current-students-list" className='table__tab table__tab--chemicals table__tab--unactive'>นิสิตปัจจุบัน</Link>
                                </div>

                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th scope="col">
                                                <input
                                                    type="checkbox"
                                                    checked={checkedStudents.length === students.length}
                                                    onChange={handleCheckAll}
                                                />
                                            </th>
                                            <th scope="col">รหัสนิสิต</th>
                                            <th scope="col">ชื่อ-สกุล</th>
                                            <th scope="col">Email</th>
                                            <th scope="col">เบอร์โทรศัพท์</th>
                                            <th scope="col">
                                                <button className="buttonTab-btn thai--font" onClick={approveByCheck}>
                                                    อนุมัติจากที่เลือก
                                                </button>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(searchQuery ? filteredStudents : students).map((students, index) => (
                                            <tr key={index} className="active-row">
                                                <td>
                                                    <input
                                                        type="checkbox"
                                                        value={students.Student_Id}
                                                        checked={checkedStudents.includes(students.Student_Id)}
                                                        onChange={handleCheck}
                                                    />
                                                </td>
                                                <td> {students.Student_Id} </td>
                                                <td> {students.Student_FName} {students.Student_LName} </td>
                                                <td> {students.Student_Email}</td>
                                                <td> {students.Student_Tel}</td>
                                                <td>
                                                    <div className="d-grid gap-2 d-sm-flex">
                                                        <button
                                                            onClick={() => handleApprove(
                                                                students.Student_Id,
                                                                students.Student_FName,
                                                                students.Student_LName,
                                                                students.Student_Email,
                                                                students.Student_Tel,
                                                                students.Student_Password
                                                            )}
                                                            className="edit--btn w-100"
                                                        >
                                                            <i className="fa-solid fa-circle-check" />
                                                            อนุมัติ
                                                        </button>

                                                        <button onClick={() => deleteStudent(students.Student_Id)} className="delete--btn btn-danger w-100">
                                                            <i className="fa-solid fa-trash" />
                                                            ลบ
                                                        </button>
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

export default AStudentList;