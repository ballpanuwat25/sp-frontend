import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import '../../cssElement/Table.css'
import '../../cssElement/Form.css'
import '../../cssElement/Dashboard.css'

import logo from '../../assets/logo.png';

function EditEquipmentCategory({ logout }) {
    const [Equipment_Category_Id, setEquipment_Category_Id] = useState("");
    const [Equipment_Category_Name, setEquipment_Category_Name] = useState("");

    const { id } = useParams();

    const navigate = useNavigate();

    useEffect(() => {
        getEquipmentCategoryById()
        // eslint-disable-next-line
    }, [])

    const getEquipmentCategoryById = async () => {
        const response = await axios.get(`https://special-problem.onrender.com/equipmentCategory-list/${id}`);
        const equipment = response.data;
        setEquipment_Category_Id(equipment.Equipment_Category_Id);
        setEquipment_Category_Name(equipment.Equipment_Category_Name);
    }

    const updateEquipmentCategory = async (e) => {
        e.preventDefault();
        const response = await axios.patch(`https://special-problem.onrender.com/equipmentCategory-list/${id}`, {
            Equipment_Category_Id,
            Equipment_Category_Name,
        });
        if (response.data.Error) {
            alert(response.data.Error);
        } else {
            navigate("/equipmentCategory-list");
        }
    }

    const [staffInfo, setStaffInfo] = useState({
        staffId: "",
        staffFirstName: "",
        staffLastName: "",
        staffUsername: "",
        staffPassword: "",
        staffTel: "",
    });

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
                    <div className='component__header'>
                        <div className='component__headerGroup component__headerGroup--left'>

                        </div>

                        <div className='component__headerGroup component__headerGroup--right'>
                            <i className="fa-solid fa-circle-user" />
                            <div className='username--text thai--font'></div>
                        </div>
                    </div>

                    <form onSubmit={updateEquipmentCategory}>
                        <div className="mb-3">
                            <label type="text" htmlFor="Equipment_Category_Id" className="profile__label">Equipment Category Id</label>
                            <input type="text" className="profile__input" id="Equipment_Category_Id" placeholder="Enter Equipment Category Id" required
                                onChange={(e) => {
                                    setEquipment_Category_Id(e.target.value);
                                }}
                                value={Equipment_Category_Id}
                            />
                        </div>

                        <div className="mb-3">
                            <label type="text" htmlFor="Equipment_Category_Name" className="profile__label">Equipment Category Name</label>
                            <input type="text" className="profile__input" id="Equipment_Category_Name" placeholder="Enter Equipment Category Name" required
                                onChange={(e) => {
                                    setEquipment_Category_Name(e.target.value);
                                }}
                                value={Equipment_Category_Name}
                            />
                        </div>

                        <button type="submit" className="table__tab table__button thai--font">อัพเดต</button>
                    </form>
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

export default EditEquipmentCategory