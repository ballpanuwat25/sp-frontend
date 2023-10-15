import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import '../../cssElement/Table.css'
import '../../cssElement/Form.css'
import '../../cssElement/Dashboard.css'

import logo from '../../assets/logo.png';

function BundleList({ logout }) {
    const [teacherInfo, setTeacherInfo] = useState({
        teacherId: "",
        teacherFirstName: "",
        teacherLastName: "",
        teacherUsername: "",
        teacherPassword: "",
        teacherTel: "",
    });

    const [teacherIdSearch, setTeacherIdSearch] = useState("");

    const [bundleList, setBundleList] = useState([]);
    const [filteredBundleList, setFilteredBundleList] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();

    axios.defaults.withCredentials = true;

    useEffect(() => {
        getBundleList();
    }, []);

    useEffect(() => {
        setFilteredBundleList(bundleList);
    }, [bundleList]);

    useEffect(() => {
        const filteredBundleList = bundleList.filter((bundle) => {
            return (
                bundle.Teacher_Id.toLowerCase().includes(teacherInfo.teacherId.toLowerCase()) ||
                teacherInfo.teacherId === ""
            );
        });

        setFilteredBundleList(filteredBundleList);
    }, [teacherInfo.teacherId, bundleList]);

    useEffect(() => {
        axios.get("https://special-problem.onrender.com/teacher", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("teacherToken")}`,
            },
        })
            .then((response) => {
                if (response.data.Error) {
                    console.error("Teacher Request Error:", response.data.Error);
                } else {
                    setTeacherInfo(response.data);
                }
            })
            .catch((error) => {
                console.error("Teacher Request Failed:", error);
            });
    }, []);

    const getBundleList = async () => {
        const response = await axios.get("https://special-problem.onrender.com/bundle-list");
        setBundleList(response.data);
        setIsLoading(false);
    }

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        const filteredBundleList = bundleList.filter((bundle) => {
            return (
                (bundle.Bundle_Name.toLowerCase().includes(query.toLowerCase()) || query === "")
            );
        });

        setFilteredBundleList(filteredBundleList);
    };

    const handleTeacherIdSearch = (e) => {
        const query = e.target.value;
        setTeacherIdSearch(query);

        const filteredBundleList = bundleList.filter((bundle) => {
            return (
                (bundle.Teacher_Id.toLowerCase().includes(query.toLowerCase()) || query === "")
            );
        });

        setFilteredBundleList(filteredBundleList);
    };

    const formatDate = (date) => {
        const d = new Date(date);
        let month = `${d.getMonth() + 1}`;
        let day = `${d.getDate()}`;
        const year = `${d.getFullYear()}`;

        if (month.length < 2) {
            month = `0${month}`;
        }

        if (day.length < 2) {
            day = `0${day}`;
        }

        return [day, month, year].join("-");
    };

    function processBundleData(bundleList) {
        const uniqueBundleNames = {};
        const processedBundleList = [];

        bundleList.forEach((bundle) => {
            const { Bundle_Id, Bundle_Name, Bundle_Description, Teacher_Id, createdAt } = bundle;

            if (!uniqueBundleNames[Bundle_Name]) {
                uniqueBundleNames[Bundle_Name] = true; // Mark the bundle name as seen
                processedBundleList.push({
                    Bundle_Id,
                    Bundle_Name,
                    Bundle_Description,
                    Teacher_Id,
                    createdAt,
                });
            }
        });

        return processedBundleList;
    }

    const processedBundleList = processBundleData(filteredBundleList);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://special-problem.onrender.com/bundle-list/${id}`);
            notify();
            getBundleList();
        } catch (err) {
            alert(err.response.data.Error);
        }
    }

    const notify = () => toast.success("Bundle deleted successfully");

    const handleLogout = () => {
        axios.get("https://special-problem.onrender.com/teacher-logout").then((response) => {
            if (response.data.Error) {
                alert(response.data.Error);
            } else {
                logout();
                localStorage.removeItem('teacherToken');
                navigate("/");
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
                        <div className='sidebar__title admin__name'>Welcome, {teacherInfo.teacherFirstName}</div>
                    </div>
                    <div className='sidebar__body'>
                        <Link to="/teacher-dashboard/teacher-chemicals-request" className='sidebar__item sidebar__item--hover'> <i className="fa-regular fa-clock" /> <div className="ms-1">Request</div></Link>
                        <Link to="/teacher-dashboard/chemicals-bundle-list" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-list" /> List</Link>
                        <Link to="/teacher-dashboard/bundle-list" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-boxes-stacked" /> <div className='sidebar__item--active'>Bundle</div></Link>
                        <Link to="/teacher-profile" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-user" /> Profile</Link>
                    </div>
                    <div className='sidebar__footer'>
                        <button onClick={handleLogout} className='sidebar__item sidebar__item--footer sidebar__item--hover '> <i className="fa-solid fa-arrow-right-from-bracket" /> Logout</button>
                    </div>
                </aside>

                <main className='dashboard__content'>
                    {isLoading ? (
                        <div class="spinner-border text-success" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    ) : (
                        <div>
                            <div className='component__header'>
                                <div className='component__headerGroup component__headerGroup--left'>
                                    <i className='fa-solid fa-magnifying-glass'></i>
                                    <input
                                        type="search"
                                        className='component__search'
                                        placeholder="ค้นหาด้วยชื่อ"
                                        value={searchQuery}
                                        onChange={handleSearch}
                                    />

                                    <input
                                        type='text'
                                        className='form-control disable'
                                        placeholder='Search by Teacher Id'
                                        value={teacherInfo.teacherId}
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
                                    <Link className='table__tab table__tab--chemicals table__tab--active'>กลุ่มสารเคมีและครุภัณฑ์</Link>
                                    <Link to="/teacher-dashboard/teacher-create-bundle" className='table__tab table__tab--equipment table__tab--unactive'>สร้าง Bundle</Link>
                                </div>

                                <table className='table table-striped'>
                                    <thead>
                                        <tr>
                                            <th scope='col'>#</th>
                                            <th scope='col'>ชื่อ Bundle</th>
                                            <th scope='col'>รายละเอียด</th>
                                            <th scope='col'>สร้างโดย</th>
                                            <th scope='col'>สร้างเมื่อ</th>
                                            <th scope='col'></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {processedBundleList.map((bundle, index) => (
                                            <tr key={index}>
                                                <th scope='row'>{index + 1}</th>
                                                <td>{bundle.Bundle_Name}</td>
                                                <td>{bundle.Bundle_Description}</td>
                                                <td>{bundle.Teacher_Id}</td>
                                                <td>{formatDate(bundle.createdAt)}</td>
                                                <td>
                                                    <div className='d-grid gap-2 d-sm-flex'>
                                                        <Link to={`${bundle.Bundle_Name}`} className='disable--link thai--font me-3'>
                                                            <div className="table__button">
                                                                <i className="fa-solid fa-eye"></i>
                                                                ดูรายละเอียด
                                                            </div>
                                                        </Link>
                                                        <button className="delete--btn btn-danger" onClick={() => handleDelete(bundle.Bundle_Name)}>
                                                            <i className="fa-solid fa-trash" />
                                                            ลบ Bundle
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
                    <Link to="/teacher-dashboard/teacher-chemicals-request" className='footer__item'> <i className="fa-regular fa-clock" /></Link>
                    <Link to="/teacher-dashboard/chemicals-bundle-list" className='footer__item'> <i className="fa-solid fa-list" /></Link>
                    <Link to="/teacher-dashboard/bundle-list" className='footer__item'> <i className="fa-solid fa-boxes-stacked" /></Link>
                    <div className="dropup">
                        <button type="button" className='dropdown-toggle' data-bs-toggle="dropdown" aria-expanded="false">
                            <i className="fa-solid fa-user" />
                        </button>
                        <ul class="dropdown-menu">
                            <Link to="/teacher-profile" className='dropdown-menu__item dropdown-menu__item--hover'> <i className="fa-solid fa-user" /> Profile</Link>
                            <button onClick={handleLogout} className='dropdown-menu__item dropdown-menu__item--hover '> <i className="fa-solid fa-arrow-right-from-bracket" /> Logout</button>
                        </ul>
                    </div>
                </footer>
            </div>
        </div>
    );
}

export default BundleList
