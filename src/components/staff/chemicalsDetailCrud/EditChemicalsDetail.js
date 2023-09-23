import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import '../../cssElement/Table.css'
import '../../cssElement/Form.css'
import '../../cssElement/Dashboard.css'

import logo from '../../assets/logo.png';

function EditChemicalsDetail() {
    const [Chem_Id, setChem_Id] = useState("");
    const [Chem_Name, setChem_Name] = useState("");
    const [Chem_CAS, setChem_CAS] = useState("");
    const [Chem_UN, setChem_UN] = useState("");
    const [Chem_Type, setChem_Type] = useState("");
    const [Chem_Grade, setChem_Grade] = useState("");
    const [Chem_State, setChem_State] = useState("");
    const [Chem_MSDS, setChem_MSDS] = useState("");
    const [Chem_GHS, setChem_GHs] = useState("");

    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        getChemicalsDetailById()
        // eslint-disable-next-line
    }, [])

    const getChemicalsDetailById = async () => {
        const response = await axios.get(`http://localhost:3001/chemicalsDetail-list/${id}`);
        const chemicalsDetail = response.data;
        setChem_Id(chemicalsDetail.Chem_Id);
        setChem_Name(chemicalsDetail.Chem_Name);
        setChem_CAS(chemicalsDetail.Chem_CAS);
        setChem_UN(chemicalsDetail.Chem_UN);
        setChem_Type(chemicalsDetail.Chem_Type);
        setChem_Grade(chemicalsDetail.Chem_Grade);
        setChem_State(chemicalsDetail.Chem_State);
        setChem_MSDS(chemicalsDetail.Chem_MSDS);
        setChem_GHs(chemicalsDetail.Chem_GHS);
    }

    const updateChemicalsDetail = async (e) => {
        e.preventDefault();
        const response = await axios.patch(`http://localhost:3001/chemicalsDetail-list/${id}`, {
            Chem_Id,
            Chem_Name,
            Chem_CAS,
            Chem_UN,
            Chem_Type,
            Chem_Grade,
            Chem_State,
            Chem_MSDS,
            Chem_GHS,
        });
        if (response.data.Error) {
            alert(response.data.Error);
        } else {
            navigate("/chemicalsDetail-list");
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

                        </div>

                        <div className='component__headerGroup component__headerGroup--right'>
                            <i class="fa-solid fa-circle-user" />
                            <div className='username--text thai--font'>{staffInfo.staffUsername}</div>
                        </div>
                    </div>

                    <form onSubmit={updateChemicalsDetail}>
                        <div className="mb-3">
                            <label htmlFor="Chem_Id" className="profile__label">Chemicals Id</label>
                            <input type="text" className="profile__input" id="Chem_Id" placeholder="Enter Chemicals Id" required
                                value={Chem_Id}
                                onChange={(e) => {
                                    setChem_Id(e.target.value);
                                }}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="Chem_Name" className="profile__label">Chemicals Name</label>
                            <input type="text" className="profile__input" id="Chem_Name" placeholder="Enter Chemicals Name" required
                                value={Chem_Name}
                                onChange={(e) => {
                                    setChem_Name(e.target.value);
                                }}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="Chem_CAS" className="profile__label">Chemicals CAS</label>
                            <input type="text" className="profile__input" id="Chem_CAS" placeholder="Enter Chemicals CAS" required
                                value={Chem_CAS}
                                onChange={(e) => {
                                    setChem_CAS(e.target.value);
                                }}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="Chem_UN" className="profile__label">Chemicals UN</label>
                            <input type="text" className="profile__input" id="Chem_UN" placeholder="Enter Chemicals UN" required
                                value={Chem_UN}
                                onChange={(e) => {
                                    setChem_UN(e.target.value);
                                }}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="Chem_Type" className="profile__label">Chemicals Type</label>
                            <input type="text" className="profile__input" id="Chem_Type" placeholder="Enter Chemicals Type" required
                                value={Chem_Type}
                                onChange={(e) => {
                                    setChem_Type(e.target.value);
                                }}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="Chem_Grade" className="profile__label">Chemicals Grade</label>
                            <input type="text" className="profile__input" id="Chem_Grade" placeholder="Enter Chemicals Grade" required
                                value={Chem_Grade}
                                onChange={(e) => {
                                    setChem_Grade(e.target.value);
                                }}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="Chem_State" className="profile__label">Chemicals State</label>
                            <input type="text" className="profile__input" id="Chem_State" placeholder="Enter Chemicals State" required
                                value={Chem_State}
                                onChange={(e) => {
                                    setChem_State(e.target.value);
                                }}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="Chem_MSDS" className="profile__label">Chemicals MSDS</label>
                            <input type="text" className="profile__input" id="Chem_MSDS" placeholder="Enter Chemicals MSDS" required
                                value={Chem_MSDS}
                                onChange={(e) => {
                                    setChem_MSDS(e.target.value);
                                }}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="Chem_GHS" className="profile__label">Chemicals GHS</label>
                            <input type="text" className="profile__input" id="Chem_GHS" placeholder="Enter Chemicals GHS" required
                                value={Chem_GHS}
                                onChange={(e) => {
                                    setChem_GHs(e.target.value);
                                }}
                            />
                        </div>

                        <button type="submit" className="table__tab table__button thai--font">อัพเดต</button>
                    </form>
                </main>
            </div>

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
    )
}

export default EditChemicalsDetail