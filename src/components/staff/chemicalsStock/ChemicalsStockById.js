import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import '../../cssElement/Table.css'
import '../../cssElement/Form.css'
import '../../cssElement/Dashboard.css'

import logo from '../../assets/logo.png';

function ChemicalsStockById() {
    const [chemicals, setChemicals] = useState([]);
    const { id } = useParams();

    const getChemicalsByChemId = async (chemId) => {
        try {
            const response = await axios.get(`http://localhost:3001/chemicals-list/chemid/${chemId}`);
            setChemicals(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getChemicalsByChemId(id);
    }, [id]);

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
                        <Link to="/staff-dashboard/staff-chemicals-request-list" className='sidebar__item sidebar__item--hover'> <i class="fa-regular fa-clock" /> <div className='ms-1'> Request</div></Link>
                        <Link to="/chemicals-list" className='sidebar__item sidebar__item--hover'> <i class="fa-solid fa-flask" /> Chemicals</Link>
                        <Link to="/equipment-list" className='sidebar__item sidebar__item--hover'> <i class="fa-solid fa-toolbox" />Equipment</Link>
                        <Link to="/chemicals-stock" className='sidebar__item sidebar__item--hover'> <i class="fa-solid fa-flask-vial" /> <div className='sidebar__item--active'> Stock</div></Link>
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
                                id="searchTerm"
                                className="component__search"
                                value=""
                                onChange=""
                                placeholder="Enter Chem_Name..."
                            />
                        </div>

                        <div className='component__headerGroup component__headerGroup--right'>
                            <i class="fa-solid fa-circle-user" />
                            <div className='username--text thai--font'>{staffInfo.staffUsername}</div>
                        </div>
                    </div>

                    <div>
                        <div className='table__tabs'>
                            <Link className='table__tab table__tab--chemicals table__tab--active'>รายละเอียด</Link>
                        </div>

                        <table className='table table-striped'>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>รหัสขวดสารเคมี</th>
                                    <th>รหัสสารเคมี</th>
                                    <th>ขนาดบรรจุ</th>
                                    <th>ปริมาณคงเหลือ</th>
                                    <th>หน่วยนับ</th>
                                    <th>สถานที่เก็บ</th>
                                    <th>ราคา</th>
                                </tr>
                            </thead>
                            <tbody>
                                {chemicals.map((chemical, index) => (
                                    <tr key={index} className="active-row">
                                        <td>{index + 1}</td>
                                        <td>{chemical.Chem_Bottle_Id}</td>
                                        <td>{chemical.Chem_Id}</td>
                                        <td>{chemical.Package_Size}</td>
                                        <td>{chemical.Remaining_Quantity}</td>
                                        <td>{chemical.Counting_Unit}</td>
                                        <td>{chemical.Location}</td>
                                        <td>{chemical.Price}</td>
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

export default ChemicalsStockById;
