import axios from "axios";
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import '../../../cssElement/Table.css'
import '../../../cssElement/Form.css'
import '../../../cssElement/Dashboard.css'

import logo from '../../../assets/logo.png';

function StudentEquipmentList() {
    const [studentInfo, setStudentInfo] = useState({
        studentId: "",
        studentFirstName: "",
        studentLastName: "",
        studentEmail: "",
        studentPassword: "",
        studentTel: "",
    });

    const [equipment, setEquipment] = useState([]);
    const [equipmentCategory, setEquipmentCategory] = useState([]);

    const [searchQuery, setSearchQuery] = useState("");
    const [filteredEquipment, setFilteredEquipment] = useState([]);

    const [equipmentRequest, setEquipmentRequest] = useState({
        Student_Id: "",
        Equipment_Id: "",
        Requested_Quantity: 1,
    });

    const [selectedEquipmentId, setSelectedEquipmentId] = useState({});

    const [equipmentReq, setEquipmentReq] = useState([]);
    const [mostRequestedEquipIds, setMostRequestedEquipIds] = useState([]);

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);

    axios.defaults.withCredentials = true;

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const eqRequestResponse = await axios.get("https://special-problem.onrender.com/equipment-request-list");
            setEquipmentReq(eqRequestResponse.data);
            findMostRequestedEquipIds(eqRequestResponse.data, 3);

            const eqCategoryResponse = await axios.get("https://special-problem.onrender.com/equipmentCategory-list");
            setEquipmentCategory(eqCategoryResponse.data);

            const eqResponse = await axios.get("https://special-problem.onrender.com/equipment-list");
            setEquipment(eqResponse.data);

            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching equipment request:", error);
            setIsLoading(false);
        }
    };

        const findMostRequestedEquipIds = (data, n) => {
            const equipIdCounts = {};

            data.forEach(request => {
                const equipId = request.Equipment_Id;
                equipIdCounts[equipId] = (equipIdCounts[equipId] || 0) + 1;
            });

            const sortedEquipIds = Object.keys(equipIdCounts).sort((a, b) => equipIdCounts[b] - equipIdCounts[a]);

            const mostRequestedIds = sortedEquipIds.slice(0, n);

            setMostRequestedEquipIds(mostRequestedIds);
        };

        const addEquipToCartFromOffcanvas = (equipId) => {
            // Get the existing cart data from localStorage (if any)
            const cartData = JSON.parse(localStorage.getItem('equipmentCart')) || [];

            // Check if the selected equipment are already in the cart
            const existingEquipment = cartData.find(item => item.Student_Id === studentInfo.studentId && item.Equipment_Id === equipId);

            if (existingEquipment) {
                notify();
                return;
            }

            cartData.push({
                Student_Id: studentInfo.studentId,
                Equipment_Id: equipId,
            });

            localStorage.setItem('equipmentCart', JSON.stringify(cartData));
        };

        const notify = () => toast.warn("This equipment is already in your cart");

        useEffect(() => {
            axios.get("https://special-problem.onrender.com/student", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("studentToken")}`,
                },
            }).then((response) => {
                if (response.data.Error) {
                    alert(response.data.Error);
                } else {
                    setStudentInfo(response.data);
                    setEquipmentRequest({
                        ...equipmentRequest,
                        Student_Id: response.data.studentId,
                        Equipment_Id: selectedEquipmentId,
                    });
                }
            });
        }, []);

        useEffect(() => {
            setFilteredEquipment(equipment);
        }, [equipment]);

        const addToCart = (Equipment_Id) => {
            // Get the existing cart data from localStorage (if any)
            const cartData = JSON.parse(localStorage.getItem('equipmentCart')) || [];

            // Check if the selected equipment are already in the cart
            const existingEquipment = cartData.find(item => item.Student_Id === studentInfo.studentId && item.Equipment_Id === Equipment_Id);

            if (existingEquipment) {
                // If the selected equipment are already in the cart, update the quantity (optional)
                existingEquipment.Requested_Quantity += equipmentRequest.Requested_Quantity;
            } else {
                // If the selected equipment are not in the cart, add them as a new item
                cartData.push({
                    Student_Id: studentInfo.studentId,
                    Equipment_Id,
                    Requested_Quantity: equipmentRequest.Requested_Quantity,
                });
            }
            setSelectedEquipmentId({ Equipment_Id: Equipment_Id });
            localStorage.setItem('equipmentCart', JSON.stringify(cartData));
        }

        const handleSearch = (e) => {
            setSearchQuery(e.target.value);
            filterEquipment(e.target.value);
        }

        const filterEquipment = (searchQuery) => {
            const filterEquipment = equipment.filter((equipment) => {
                let equipmentName = equipment.Equipment_Name.toLowerCase();
                return equipmentName.includes(searchQuery.toLowerCase());
            });
            setFilteredEquipment(filterEquipment);
        }

        const user_picture = localStorage.getItem('user_picture') ? <img src={localStorage.getItem('user_picture')} alt="user" className='user__avatar' /> : <i className="fa-solid fa-circle-user" />;
        const user_email = localStorage.getItem('user_email') ? <div className='user__email'>{localStorage.getItem('user_email')}</div> : <div className='user__email'>{studentInfo.studentEmail}</div>;

        const handleLogout = () => {
            axios.get("https://special-problem.onrender.com/student-logout").then((response) => {
                if (response.data.Error) {
                    alert(response.data.Error);
                } else {
                    localStorage.removeItem('user_name');
                    localStorage.removeItem('user_email');
                    localStorage.removeItem('user_picture');
                    localStorage.removeItem('studentToken');
                    navigate("/");
                }
            });
        };

        const findEquipmentNameById = (equipId) => {
            const selectedEquipment = equipment.find((equip) => equip.Equipment_Id === equipId);
            return selectedEquipment ? selectedEquipment.Equipment_Name : "";
        };

        return (
            <div className='container-fluid vh-100'>
                <ToastContainer />
                <div className='dashboard__container'>
                    <aside className='sidebar'>
                        <div className='sidebar__header'>
                            <img src={logo} alt="logo" className='sidebar__logo' width={49} height={33} />
                            <div className='sidebar__title std__name'>Welcome, {studentInfo.studentFirstName}</div>
                        </div>
                        <div className='sidebar__body'>
                            <Link to="/student-dashboard/student-chemicals-list" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-list" /> <div className='sidebar__item--active'>List</div></Link>
                            <Link to="/student-dashboard/bundle-list" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-boxes-stacked" /> Bundle</Link>
                            <Link to="/student-dashboard/student-chemicals-cart" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-cart-shopping" /> Cart</Link>
                            <Link to="/student-dashboard/student-chemicals-request" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-clock-rotate-left" /> History</Link>
                            <Link to="/student-profile" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-user" /> Profile</Link>
                            <Link to="/student-dashboard/student-view-teacher" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-users" /> Teacher</Link>
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
                                    </div>

                                    <div className='component__headerGroup component__headerGroup--right'>
                                        <div>{user_picture}</div>
                                        <div>{user_email}</div>
                                    </div>
                                </div>

                                <div >
                                    <div className='table__tabs'>
                                        <Link to="/student-dashboard/student-chemicals-list" className='table__tab table__tab--chemicals table__tab--unactive'>รายการสารเคมี</Link>
                                        <Link className='table__tab table__tab--equipment table__tab--active'>รายการครุภัณฑ์</Link>
                                    </div>
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th scope="col">#</th>
                                                <th scope="col">Equipment Name</th>
                                                <th scope="col">Equipment Category</th>
                                                <th scope="col"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredEquipment.map((equipment, index) => {
                                                const uniqueEquipIdTypes = [...new Set(equipmentReq.map(request => request.Equipment_Id))];

                                                const isOffCanvasEnabled = uniqueEquipIdTypes.length >= 2;
                                                const category = equipmentCategory.find(category => category.Equipment_Category_Id === equipment.Equipment_Category_Id);

                                                return (
                                                    <tr key={index} className="active-row">
                                                        <td> {index + 1} </td>
                                                        <td> {equipment.Equipment_Name} </td>
                                                        <td> {category ? category.Equipment_Category_Name : 'N/A'} </td>
                                                        <td>
                                                            <div>
                                                                <button
                                                                    onClick={() => addToCart(equipment.Equipment_Id)}
                                                                    data-bs-toggle={isOffCanvasEnabled ? "offcanvas" : ""}
                                                                    data-bs-target={isOffCanvasEnabled ? "#offcanvasWithBackdrop2" : ""}
                                                                    aria-controls="offcanvasWithBackdrop"
                                                                    className="table__button thai--font"
                                                                >
                                                                    <i className="fa-solid fa-circle-plus" />
                                                                    เพิ่มลงตระกร้า
                                                                </button>

                                                                {isOffCanvasEnabled && (
                                                                    <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasWithBackdrop2" aria-labelledby="offcanvasWithBackdropLabel">
                                                                        <div className="offcanvas-header">
                                                                            <button type="button" className="btn-close text-reset offcanvas-close--button" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                                                                            <div className="offcanvas--title">
                                                                                {findEquipmentNameById(selectedEquipmentId.Equipment_Id)} <p className="offcanvas__title--highlight">ถูกเพิ่มลงตระกร้าครุภัณฑ์แล้ว</p>
                                                                            </div>
                                                                            <Link to="/student-dashboard/student-equipment-cart" className="offcanvas--link">ไปที่ตระกร้าครุภัณฑ์</Link>
                                                                        </div>
                                                                        <div className="offcanvas-body">
                                                                            {selectedEquipmentId && (
                                                                                <div>
                                                                                    <h5 className="thai--font"> ครุภัณฑ์แนะนำ </h5>
                                                                                    <ul className="offcanvas__lists">
                                                                                        {mostRequestedEquipIds.map((equipId, index) => (
                                                                                            selectedEquipmentId.Equipment_Id !== equipId && (
                                                                                                <li className="offcanvas__item" key={index}>
                                                                                                    {equipId}
                                                                                                    <button
                                                                                                        className="offcanvas__button"
                                                                                                        onClick={() => addEquipToCartFromOffcanvas(equipId)}
                                                                                                    >
                                                                                                        <i className="fa-solid fa-circle-plus" />
                                                                                                        <div className="offcanvas__button-text offcanvas__button-text--hover">
                                                                                                            add to cart
                                                                                                        </div>
                                                                                                    </button>
                                                                                                </li>
                                                                                            )
                                                                                        ))}
                                                                                    </ul>

                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </main>

                    <footer className='footer'>
                        <Link to="/student-dashboard/student-chemicals-list" className='footer__item'> <i className="fa-solid fa-list" /></Link>
                        <Link to="/student-dashboard/bundle-list" className='footer__item'> <i className="fa-solid fa-boxes-stacked" /></Link>
                        <Link to="/student-dashboard/student-chemicals-cart" className='footer__item'> <i className="fa-solid fa-cart-shopping" /></Link>
                        <Link to="/student-dashboard/student-chemicals-request" className='footer__item'> <i className="fa-solid fa-clock-rotate-left" /></Link>
                        <div className="dropup">
                            <button type="button" className='dropdown-toggle' data-bs-toggle="dropdown" aria-expanded="false">
                                <i className="fa-solid fa-user" />
                            </button>
                            <ul class="dropdown-menu">
                                <Link to="/student-profile" className='dropdown-menu__item dropdown-menu__item--hover'> <i className="fa-solid fa-user" /> Profile</Link>
                                <Link to="/student-dashboard/student-view-teacher" className='dropdown-menu__item dropdown-menu__item--hover'> <i className="fa-solid fa-users" /> Teacher</Link>
                                <button onClick={handleLogout} className='dropdown-menu__item dropdown-menu__item--hover '> <i className="fa-solid fa-arrow-right-from-bracket" /> Logout</button>
                            </ul>
                        </div>
                    </footer>
                </div>
            </div>
        )
    }

    export default StudentEquipmentList