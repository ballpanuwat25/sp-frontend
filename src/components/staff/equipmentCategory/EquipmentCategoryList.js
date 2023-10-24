import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react'

import '../../cssElement/Table.css'
import '../../cssElement/Form.css'
import '../../cssElement/Dashboard.css'

import logo from '../../assets/logo.png';

function EquipmentListCategory({ logout }) {
    const [staffInfo, setStaffInfo] = useState({
        staffId: "",
        staffFirstName: "",
        staffLastName: "",
        staffUsername: "",
        staffPassword: "",
        staffTel: "",
    })

    const [equipmentCategory, setEquipmentCategory] = useState([]);
    const [searchQuery, setSearchQuery] = useState(""); // State for search query
    const [filteredEquipmentCategory, setFilteredEquipmentCategory] = useState([]); // State for filtered equipment categories

    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();

    axios.defaults.withCredentials = true;

    useEffect(() => {
        getEquipmentCategory();
    }, []);

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

    const getEquipmentCategory = async () => {
        const response = await axios.get("https://special-problem.onrender.com/equipmentCategory-list");
        setEquipmentCategory(response.data);
        setFilteredEquipmentCategory(response.data); // Initialize filtered equipment categories with all categories
        setIsLoading(false);
    }

    const deleteEquipmentCategory = async (id) => {
        try {
            await axios.delete(`https://special-problem.onrender.com/equipmentCategory-list/${id}`)
            getEquipmentCategory();
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

    // Function to handle search input changes and filter equipment categories
    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        // Use the query to filter equipment categories based on Equipment_Category_Id or any other property
        const filteredCategories = equipmentCategory.filter((category) => {
            return (
                category.Equipment_Category_Id.toLowerCase().includes(query.toLowerCase()) ||
                category.Equipment_Category_Name.toLowerCase().includes(query.toLowerCase())
                // Add more conditions as needed for other properties
            );
        });

        setFilteredEquipmentCategory(filteredCategories);
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
                         
<Link to="/chemicals-list" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-flask" /> Chemicals</Link>
                        <Link to="/equipment-list" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-toolbox" /><div className='sidebar__item--active'> Equipment</div></Link>
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
                                        placeholder="ค้นหาด้วยรหัสหรือชื่อหมวดหมู่ครุภัณฑ์"
                                        value={searchQuery} // Bind input value to searchQuery state
                                        onChange={handleSearch} // Call handleSearch when input changes
                                    />
                                </div>

                                <div className='component__headerGroup component__headerGroup--right'>
                                    <i className="fa-solid fa-circle-user" />
                                    <div className='username--text thai--font'>{staffInfo.staffUsername}</div>
                                </div>
                            </div>

                            <div>
                                <div className='table__tabs'>
                                    <Link to="/equipment-list" className='table__tab table__tab--chemicals table__tab--unactive'>ครุภัณฑ์</Link>
                                    <Link className='table__tab table__tab--equipment table__tab--active'>หมวดหมู่ครุภัณฑ์</Link>
                                    <Link to="/report-equipment" className='table__tab table__tab--equipment table__tab--unactive'>ออกรายงาน</Link>
                                </div>

                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">รหัสหมวดหมู่ครุภัณฑ์</th>
                                            <th scope="col">หมวดหมู่ครุภัณฑ์</th>
                                            <th scope="col">
                                                <Link to={`add-equipmentCategory`} className="buttonTab-btn thai--font disable--link"><i className="fa-solid fa-square-plus me-2" /> เพิ่มหมวดหมู่ครุภัณฑ์</Link>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredEquipmentCategory.map((equipmentCategory, index) => (
                                            <tr key={index} className="active-row">
                                                <td> {index + 1} </td>
                                                <td> {equipmentCategory.Equipment_Category_Id} </td>
                                                <td> {equipmentCategory.Equipment_Category_Name} </td>
                                                <td>
                                                    <div className="d-grid gap-2 d-sm-flex">
                                                        <Link to={`edit-equipmentCategory/${equipmentCategory.Equipment_Category_Id}`} className="edit--btn">
                                                            <i className="fa-solid fa-pen-to-square" />
                                                            แก้ไข
                                                        </Link>
                                                        <button className="delete--btn btn-danger" type="button" onClick={() => deleteEquipmentCategory(equipmentCategory.Equipment_Category_Id)}>
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

export default EquipmentListCategory