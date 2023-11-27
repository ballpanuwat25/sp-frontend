import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import '../../cssElement/Table.css'
import '../../cssElement/Form.css'
import '../../cssElement/Dashboard.css'

import logo from '../../assets/logo.png';

function ChemicalsBundleList({ logout }) {
    const [teacherInfo, setTeacherInfo] = useState({
        teacherId: "",
        teacherFirstName: "",
        teacherLastName: "",
        teacherUsername: "",
        teacherPassword: "",
        teacherTel: "",
    });

    const [bundle, setBundle] = useState({
        Teacher_Id: "",
        Chem_Id: "",
    });

    const [chemicalsDetail, setChemicalsDetail] = useState([]);

    const [searchQuery, setSearchQuery] = useState("");
    const [filteredChemicals, setFilteredChemicals] = useState([]);

    const [isLoading, setIsLoading] = useState(true);

    const [selectedChemicalsId, setSelectedChemicalsId] = useState(null);

    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    useEffect(() => {
        getChemicalsDetail();

        axios.get(process.env.REACT_APP_API + "/teacher", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("teacherToken")}`,
            },
        }).then((response) => {
            if (response.data.Error) {
                alert(response.data.Error);
            } else {
                setTeacherInfo(response.data);
                setBundle({
                    ...bundle,
                    Teacher_Id: response.data.teacherId,
                    Chem_Id: selectedChemicalsId,
                });
            }
        });
    }, []);

    useEffect(() => {
        setFilteredChemicals(chemicalsDetail);
    }, [chemicalsDetail]);

    const getChemicalsDetail = async () => {
        const response = await axios.get(process.env.REACT_APP_API + "/chemicalsDetail-list");
        setChemicalsDetail(response.data);
        setIsLoading(false);
    }

    const addToCart = (Chem_Id) => {
        const cartData = JSON.parse(localStorage.getItem('bundleCart')) || [];

        const existingChemical = cartData.find(item => item.Teacher_Id === teacherInfo.teacherId && item.Chem_Id === Chem_Id);

        if (existingChemical) {
            notify();
        } else {
            cartData.push({
                Teacher_Id: teacherInfo.teacherId,
                Chem_Id,
            });
        }

        localStorage.setItem('bundleCart', JSON.stringify(cartData));
    };

    const notify = () => toast.warn("This chemical is already in your cart");

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        const filteredChemicals = chemicalsDetail.filter((chemical) => {
            return chemical.Chem_Name.toLowerCase().includes(query.toLowerCase());
        });

        setFilteredChemicals(filteredChemicals);
    };

    const handleLogout = () => {
        axios.get(process.env.REACT_APP_API + "/teacher-logout").then((response) => {
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
                        <Link to="teacher-dashboard/teacher-chemicals-request" className='sidebar__item sidebar__item--hover'> <i className="fa-regular fa-clock" /> <div className="ms-1">Request</div></Link>
                        <Link to="teacher-dashboard/chemicals-bundle-list" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-list" /> <div className='sidebar__item--active'>List</div></Link>
                        <Link to="teacher-dashboard/bundle-list" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-boxes-stacked" /> Bundle</Link>
                        <Link to="teacher-profile" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-user" /> Profile</Link>
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
                                        placeholder="ค้นหาด้วยชื่อ"
                                        value={searchQuery}
                                        onChange={handleSearch}
                                    />
                                </div>

                                <div className='component__headerGroup component__headerGroup--right'>
                                    <i className="fa-solid fa-circle-user" />
                                    <div className='username--text thai--font'>{teacherInfo.teacherUsername}</div>
                                </div>
                            </div>

                            <div>
                                <div className='table__tabs'>
                                    <Link className='table__tab table__tab--chemicals table__tab--active'>รายการสารเคมี</Link>
                                    <Link to="teacher-dashboard/equipment-bundle-list" className='table__tab table__tab--equipment table__tab--unactive'>รายการครุภัณฑ์</Link>
                                </div>

                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Chemicals Name</th>
                                            <th scope="col">Chemicals CAS</th>
                                            <th scope="col">Chemicals UN</th>
                                            <th scope="col">Chemicals Type</th>
                                            <th scope="col">Chemicals Grade</th>
                                            <th scope="col">Chemicals State</th>
                                            <th scope="col"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredChemicals.map((chemicalsDetail, index) => (
                                            <tr key={index} className="active-row">
                                                <td> {index + 1} </td>
                                                <td> {chemicalsDetail.Chem_Name} </td>
                                                <td> {chemicalsDetail.Chem_CAS} </td>
                                                <td> {chemicalsDetail.Chem_UN} </td>
                                                <td> {chemicalsDetail.Chem_Type} </td>
                                                <td> {chemicalsDetail.Chem_Grade} </td>
                                                <td> {chemicalsDetail.Chem_State} </td>
                                                <td>
                                                    <button className="table__button thai--font" onClick={() => addToCart(chemicalsDetail.Chem_Id)}>
                                                        <i className="fa-solid fa-circle-plus" />
                                                        เพิ่มสารเคมี
                                                    </button>
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
                    <Link to="teacher-dashboard/teacher-chemicals-request" className='footer__item'> <i className="fa-regular fa-clock" /></Link>
                    <Link to="teacher-dashboard/chemicals-bundle-list" className='footer__item'> <i className="fa-solid fa-list" /></Link>
                    <Link to="teacher-dashboard/bundle-list" className='footer__item'> <i className="fa-solid fa-boxes-stacked" /></Link>
                    <div className="dropup">
                        <button type="button" className='dropdown-toggle' data-bs-toggle="dropdown" aria-expanded="false">
                            <i className="fa-solid fa-user" />
                        </button>
                        <ul className="dropdown-menu">
                            <Link to="teacher-profile" className='dropdown-menu__item dropdown-menu__item--hover'> <i className="fa-solid fa-user" /> Profile</Link>
                            <button onClick={handleLogout} className='dropdown-menu__item dropdown-menu__item--hover '> <i className="fa-solid fa-arrow-right-from-bracket" /> Logout</button>
                        </ul>
                    </div>
                </footer>
            </div>
        </div>
    )
}

export default ChemicalsBundleList
