import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import '../../cssElement/Table.css'
import '../../cssElement/Form.css'
import '../../cssElement/Dashboard.css'

import logo from '../../assets/logo.png';

function EditChemicals({ logout }) {
    const [staffId, setStaffId] = useState("");
    const [logActivity, setLogActivity] = useState({
        LogActivity_Name: "",
        Chem_Bottle_Id: "",
        Staff_Id: "",
    });

    const [Chem_Bottle_Id, setChem_Bottle_Id] = useState("");
    const [Chem_Id, setChem_Id] = useState("");
    const [Package_Size, setPackage_Size] = useState("");
    const [Remaining_Quantity, setRemaining_Quantity] = useState("");
    const [Counting_Unit, setCounting_Unit] = useState("");
    const [Location, setLocation] = useState("");
    const [Price, setPrice] = useState("");

    const { id } = useParams();

    const navigate = useNavigate();
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
                setStaffId(response.data.staffId);
                setLogActivity({ ...logActivity, Staff_Id: response.data.staffId });
            }
        });
    }, [logActivity]);

    useEffect(() => {
        getChemicalsById()
        // eslint-disable-next-line
    }, [])

    const getChemicalsById = async () => {
        const response = await axios.get(`https://special-problem.onrender.com/chemicals-list/${id}`);
        const chemicals = response.data;
        setChem_Bottle_Id(chemicals.Chem_Bottle_Id);
        setChem_Id(chemicals.Chem_Id);
        setPackage_Size(chemicals.Package_Size);
        setRemaining_Quantity(chemicals.Remaining_Quantity);
        setCounting_Unit(chemicals.Counting_Unit);
        setLocation(chemicals.Location);
        setPrice(chemicals.Price);
    }

    const updateChemicals = async (e) => {
        e.preventDefault();
        const response = await axios.patch(`https://special-problem.onrender.com/chemicals-list/${id}`, {
            Chem_Bottle_Id,
            Chem_Id,
            Package_Size,
            Remaining_Quantity,
            Counting_Unit,
            Location,
            Price,
        });
        const updatedLogActivity = { ...logActivity, LogActivity_Name: "Updated Chemicals", Chem_Bottle_Id: Chem_Bottle_Id };
        await axios.post("https://special-problem.onrender.com/log-activity", updatedLogActivity);
        if (response.data.Error) {
            alert(response.data.Error);
        } else {
            navigate("/chemicals-list");
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
                    <div className='component__header'>
                        <div className='component__headerGroup component__headerGroup--left'>

                        </div>

                        <div className='component__headerGroup component__headerGroup--right'>
                            <i className="fa-solid fa-circle-user" />
                            <div className='username--text thai--font'>{staffInfo.staffUsername}</div>
                        </div>
                    </div>

                    <form onSubmit={updateChemicals}>
                        <div className='mb-3 disable'>
                            <label htmlFor='Staff_Id' className='profile__label'>Staff_Id</label>
                            <input type='text'
                                className='profile__input'
                                placeholder='Enter Staff Id'
                                defaultValue={staffId}
                                readOnly
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="Chem_Bottle_Id" className="profile__label">รหัสขวดสารเคมี</label>
                            <input type="text" className="profile__input" id="Chem_Bottle_Id" placeholder="Enter Chemicals Bottle Id" required
                                value={Chem_Bottle_Id}
                                onChange={(e) => {
                                    setChem_Bottle_Id(e.target.value);
                                }}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="Chem_Id" className="profile__label">รหัสสารเคมี</label>
                            <input type="text" className="profile__input" id="Chem_Id" placeholder="Enter Chemicals Id" required
                                value={Chem_Id}
                                onChange={(e) => {
                                    setChem_Id(e.target.value);
                                }}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="Package_Size" className="profile__label">ขนาดบรรจุ</label>
                            <input type="number" className="profile__input" id="Package_Size" placeholder="Enter Package Size" required
                                value={Package_Size}
                                onChange={(e) => {
                                    setPackage_Size(e.target.value);
                                }}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="Remaining_Quantity" className="profile__label">ปริมาณคงเหลือ</label>
                            <input type="number" className="profile__input" id="Remaining_Quantity" placeholder="Enter Remaining Quantity" required
                                value={Remaining_Quantity}
                                onChange={(e) => {
                                    setRemaining_Quantity(e.target.value);
                                }}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="Counting_Unit" className="profile__label">หน่วยนับ</label>
                            <input type="text" className="profile__input" id="Counting_Unit" placeholder="Enter Counting Unit"
                                value={Counting_Unit}
                                onChange={(e) => {
                                    setCounting_Unit(e.target.value);
                                }}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="Location" className="profile__label">สถานที่เก็บ</label>
                            <input type="text" className="profile__input" id="Location" placeholder="Enter Location" required
                                value={Location}
                                onChange={(e) => {
                                    setLocation(e.target.value);
                                }}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="Price" className="profile__label">ราคา</label>
                            <input type="number" className="profile__input" id="Price" placeholder="Enter Price" required
                                value={Price}
                                onChange={(e) => {
                                    setPrice(e.target.value);
                                }}
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

export default EditChemicals