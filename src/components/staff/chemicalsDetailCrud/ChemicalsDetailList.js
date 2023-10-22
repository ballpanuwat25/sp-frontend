import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react'

import '../../cssElement/Table.css'
import '../../cssElement/Form.css'
import '../../cssElement/Dashboard.css'

import logo from '../../assets/logo.png';

function ChemicalsDetailList({ logout }) {
    const [staffInfo, setStaffInfo] = useState({
        staffId: "",
        staffFirstName: "",
        staffLastName: "",
        staffUsername: "",
        staffPassword: "",
        staffTel: "",
    })

    const [chemicalsDetail, setChemicalsDetail] = useState([]);

    const [searchQuery, setSearchQuery] = useState("");
    const [filteredChemicalsDetail, setFilteredChemicalsDetail] = useState([]);

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);

    axios.defaults.withCredentials = true;

    useEffect(() => {
        getChemicalsDetail();
    }, []);

    useEffect(() => {
        setFilteredChemicalsDetail(chemicalsDetail);
    }, [chemicalsDetail]);

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

    const getChemicalsDetail = async () => {
        try {
            const response = await axios.get("https://special-problem.onrender.com/chemicalsDetail-list");
            setChemicalsDetail(response.data); // Make sure response.data is an array
            setIsLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    const deleteChemicalsDetail = async (id) => {
        try {
            await axios.delete(`https://special-problem.onrender.com/chemicalsDetail-list/${id}`)
            getChemicalsDetail();
        } catch (error) {
            console.log(error)
        }
    }

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

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        const filteredChemicalsDetail = chemicalsDetail.filter((chemicalDetail) => {
            const lowerCaseQuery = query.toLowerCase();
            return (
                chemicalDetail.Chem_Id.toLowerCase().includes(lowerCaseQuery) ||
                chemicalDetail.Chem_Name.toLowerCase().includes(lowerCaseQuery)
            );
        });

        setFilteredChemicalsDetail(filteredChemicalsDetail);
    }

    return (
        <div className='container-fluid vh-100'>
            <div className='dashboard__container'>
                <aside className='sidebar'>
                    <div className='sidebar__header'>
                        <img src={logo} alt="logo" className='sidebar__logo' width={49} height={33} />
                        <div className='sidebar__title admin__name'>Welcome, {staffInfo.staffFirstName}</div>
                    </div>

                    <div className='sidebar__body'>
                        <Link to="/staff-dashboard/staff-chemicals-request-list" className='sidebar__item sidebar__item--hover'> <i className="fa-regular fa-clock" /> <div className='ms-1'> Request</div></Link>
                        <Link to="/staff-dashboard/staff-chemicals-receipt" className='sidebar__item sidebar__item--hover'> <i className="me-3 fa-solid fa-receipt"/> Receipt</Link>
                        <Link to="/chemicals-list" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-flask" /> <div className='sidebar__item--active'> Chemicals</div></Link>
                        <Link to="/equipment-list" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-toolbox" />Equipment</Link>
                        <Link to="/chemicals-stock" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-flask-vial" /> Stock</Link>
                        <Link to="/staff-profile" className='sidebar__item sidebar__item--hover'> <i className="fa-regular fa-user" /> Profile</Link>
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
                                    <i className='fa-solid fa-magnifying-glass' />
                                    <input
                                        type="text"
                                        className="component__search"
                                        placeholder="ค้นหาด้วยรหัสสารเคมี"
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
                                    <Link to="/chemicals-list" className='table__tab table__tab--chemicals table__tab--unactive'>ขวดสารเคมี</Link>
                                    <Link className='table__tab table__tab--equipment table__tab--active'>สารเคมี</Link>
                                    <Link to="/report-chemicals" className='table__tab table__tab--equipment table__tab--unactive'>ออกรายงาน</Link>
                                </div>

                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">รหัสสารเคมี</th>
                                            <th scope="col">ชื่อสารเคมี</th>
                                            <th scope="col">CAS</th>
                                            <th scope="col">UN</th>
                                            <th scope="col">Type</th>
                                            <th scope="col">Grade</th>
                                            <th scope="col">สถานะของสาร</th>
                                            <th scope="col">MSDS</th>
                                            <th scope="col">GHS</th>
                                            <th scope="col">
                                                <Link to={`add-chemicalsDetail`} className="buttonTab-btn thai--font disable--link"> <i className="fa-solid fa-square-plus me-2" /> เพิ่มสารเคมี</Link>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredChemicalsDetail.map((chemicalsDetail, index) => (
                                            <tr key={index} className="active-row">
                                                <td> {index + 1} </td>
                                                <td> {chemicalsDetail.Chem_Id} </td>
                                                <td> {chemicalsDetail.Chem_Name} </td>
                                                <td> {chemicalsDetail.Chem_CAS} </td>
                                                <td> {chemicalsDetail.Chem_UN} </td>
                                                <td> {chemicalsDetail.Chem_Type} </td>
                                                <td> {chemicalsDetail.Chem_Grade} </td>
                                                <td> {chemicalsDetail.Chem_State} </td>
                                                <td> <Link to={chemicalsDetail.Chem_MSDS}>{chemicalsDetail.Chem_MSDS}</Link> </td>
                                                <td> {chemicalsDetail.Chem_GHS} </td>
                                                <td>
                                                    <div className="d-grid gap-2 d-sm-flex">
                                                        <Link to={`edit-chemicalsDetail/${chemicalsDetail.Chem_Id}`} className="edit--btn">
                                                            <i className="fa-solid fa-pen-to-square" />
                                                            แก้ไข
                                                        </Link>
                                                        <button onClick={() => deleteChemicalsDetail(chemicalsDetail.Chem_Id, chemicalsDetail.Chem_Id)} className="delete--btn btn-danger">
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
                            <button onClick={handleLogout} className='dropdown-menu__item dropdown-menu__item--hover '> <i className="fa-solid fa-arrow-right-from-bracket" /> Logout</button>
                        </ul>
                    </div>
                </footer>
            </div>
        </div>
    )
}

export default ChemicalsDetailList