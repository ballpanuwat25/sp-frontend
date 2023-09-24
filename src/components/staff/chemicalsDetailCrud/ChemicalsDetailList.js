import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react'

import '../../cssElement/Table.css'
import '../../cssElement/Form.css'
import '../../cssElement/Dashboard.css'

import logo from '../../assets/logo.png';

function ChemicalsDetailList({ logout }) {
    const [chemicalsDetail, setChemicalsDetail] = useState([]);

    useEffect(() => {
        getChemicalsDetail();
    }, []);

    const getChemicalsDetail = async () => {
        try {
            const response = await axios.get("http://localhost:3001/chemicalsDetail-list");
            setChemicalsDetail(response.data); // Make sure response.data is an array
        } catch (error) {
            console.log(error);
        }
    };

    const deleteChemicalsDetail = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/chemicalsDetail-list/${id}`)
            getChemicalsDetail();
        } catch (error) {
            console.log(error)
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
        axios.get("http://localhost:3001/staff", {
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
        axios.get("http://localhost:3001/staff-logout").then((response) => {
            if (response.data.Error) {
                alert(response.data.Error);
            } else {
                localStorage.removeItem('staffToken');
                navigate("/");
                logout();
            }
        });
    };

    const [searchQuery, setSearchQuery] = useState("");
    const [filteredChemicalsDetail, setFilteredChemicalsDetail] = useState([]);

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
    
    useEffect(() => {
        setFilteredChemicalsDetail(chemicalsDetail);
    }, [chemicalsDetail]);
    
    return (
        <div className='container-fluid vh-100'>
            <div className='dashboard__container'>
                <aside className='sidebar'>
                    <div className='sidebar__header'>
                        <img src={logo} alt="logo" className='sidebar__logo' width={49} height={33} />
                        <div className='sidebar__title admin__name'>Welcome, {staffInfo.staffFirstName}</div>
                    </div>

                    <div className='sidebar__body'>
                        <Link to="/staff-dashboard/staff-chemicals-request-list" className='sidebar__item sidebar__item--hover'> <i class="fa-regular fa-clock" /> <div className='ms-1'> Request</div></Link>
                        <Link to="/chemicals-list" className='sidebar__item sidebar__item--hover'> <i class="fa-solid fa-flask" /> <div className='sidebar__item--active'> Chemicals</div></Link>
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
                                placeholder="ค้นหาด้วยรหัสสารเคมี"
                                value={searchQuery}
                                onChange={handleSearch}
                            />
                        </div>

                        <div className='component__headerGroup component__headerGroup--right'>
                            <i class="fa-solid fa-circle-user" />
                            <div className='username--text thai--font'>{staffInfo.staffUsername}</div>
                        </div>
                    </div>

                    <div>
                        <div className='table__tabs'>
                            <Link to="/chemicals-list" className='table__tab table__tab--chemicals table__tab--unactive'>ขวดสารเคมี</Link>
                            <Link className='table__tab table__tab--equipment table__tab--active'>สารเคมี</Link>
                        </div>

                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Id</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">CAS</th>
                                    <th scope="col">UN</th>
                                    <th scope="col">Type</th>
                                    <th scope="col">Grade</th>
                                    <th scope="col">State</th>
                                    <th scope="col">MSDS</th>
                                    <th scope="col">GHS</th>
                                    <th scope="col">
                                        <Link to={`add-chemicalsDetail`} className="buttonTab-btn thai--font disable--link"> <i class="fa-solid fa-square-plus me-2" /> เพิ่มสารเคมี</Link>
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
                                        <td> {chemicalsDetail.Chem_MSDS} </td>
                                        <td> {chemicalsDetail.Chem_GHS} </td>
                                        <td>
                                            <div className="d-grid gap-2 d-sm-flex">
                                                <Link to={`edit-chemicalsDetail/${chemicalsDetail.Chem_Id}`} className="edit--btn">
                                                    <i class="fa-solid fa-pen-to-square" />
                                                    แก้ไข
                                                </Link>
                                                <button onClick={() => deleteChemicalsDetail(chemicalsDetail.Chem_Id, chemicalsDetail.Chem_Id)} className="delete--btn btn-danger">
                                                    <i class="fa-solid fa-trash" />
                                                    ลบ
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>


        </div>
    )
}

export default ChemicalsDetailList