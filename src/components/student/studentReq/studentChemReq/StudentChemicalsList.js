import axios from "axios";
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import '../../../cssElement/Table.css'
import '../../../cssElement/Form.css'
import '../../../cssElement/Dashboard.css'

import logo from '../../../assets/logo.png';

function StudentChemicalsList() {
    const [studentInfo, setStudentInfo] = useState({
        studentId: "",
        studentFirstName: "",
        studentLastName: "",
        studentEmail: "",
        studentPassword: "",
        studentTel: "",
    });

    const [chemicalsDetail, setChemicalsDetail] = useState([]);

    const [searchQuery, setSearchQuery] = useState("");
    const [filteredChemicals, setFilteredChemicals] = useState([]);

    const [chemicalsRequest, setChemicalsRequest] = useState({
        Student_Id: "",
        Chem_Id: "",
    });

    const [selectedChemicalsId, setSelectedChemicalsId] = useState({});

    const [chemicalsReq, setChemicalsReq] = useState([]);
    const [mostRequestedChemIds, setMostRequestedChemIds] = useState([]);

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);

    axios.defaults.withCredentials = true;

    useEffect(() => {
        fetchData();
        notify();
    }, []);

    const notify = () => toast.info("หลังใช้งานเสร็จควรออกจากระบบทุกครั้ง เพื่อไม่ให้เกิดปัญหาในการเข้าสู่ระบบครั้งถัดไป");
    const notifyWarn = () => toast.warn("This chemical is already in your cart");

    const fetchData = async () => {
        try {
            const chemicalsResponse = await axios.get(process.env.REACT_APP_API + "/chemicals-request-list");
            setChemicalsReq(chemicalsResponse.data);
            findMostRequestedChemIds(chemicalsResponse.data, 10);

            const chemicalsDetailResponse = await axios.get(process.env.REACT_APP_API + "/chemicalsDetail-list");
            setChemicalsDetail(chemicalsDetailResponse.data);

            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching chemicals request:", error);
            setIsLoading(false);
        }
    };

    const findMostRequestedChemIds = (data, n) => {
        const chemIdCounts = {};

        data.forEach(request => {
            const chemId = request.Chem_Id;
            chemIdCounts[chemId] = (chemIdCounts[chemId] || 0) + 1;
        });

        const sortedChemIds = Object.keys(chemIdCounts).sort((a, b) => chemIdCounts[b] - chemIdCounts[a]);

        const mostRequestedIds = sortedChemIds.slice(0, n);

        setMostRequestedChemIds(mostRequestedIds);
    };

    const addChemToCartFromOffcanvas = (chemId, chemState) => {
        // Get the existing cart data from localStorage (if any)
        const cartData = JSON.parse(localStorage.getItem('chemicalsCart')) || [];

        // Check if the selected chemicals are already in the cart
        const existingChemical = cartData.find(item => item.Student_Id === studentInfo.studentId && item.Chem_Id === chemId);

        if (existingChemical) {
            notifyWarn();
            return;
        }

        cartData.push({
            Student_Id: studentInfo.studentId,
            Chem_Id: chemId,
            Chem_State: chemState, // Include Chem_State in the cart item
        });

        localStorage.setItem('chemicalsCart', JSON.stringify(cartData));
    };

    useEffect(() => {
        axios.get(process.env.REACT_APP_API + "/student", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("studentToken")}`,
            },
        }).then((response) => {
            if (response.data.Error) {
                alert(response.data.Error);
            } else {
                setStudentInfo(response.data);
                setChemicalsRequest({
                    ...chemicalsRequest,
                    Student_Id: response.data.studentId,
                    Chem_Id: selectedChemicalsId,
                });
            }
        });
    }, []);

    useEffect(() => {
        setFilteredChemicals(chemicalsDetail);
    }, [chemicalsDetail]);

    const addToCart = (Chem_Id, Chem_State) => {
        // Get the existing cart data from localStorage (if any)
        const cartData = JSON.parse(localStorage.getItem('chemicalsCart')) || [];

        // Check if the selected chemicals are already in the cart
        const existingChemical = cartData.find(item => item.Student_Id === studentInfo.studentId && item.Chem_Id === Chem_Id);

        if (existingChemical) {
            notifyWarn();
        } else {
            cartData.push({
                Student_Id: studentInfo.studentId,
                Chem_Id,
                Chem_State,
            });
        }
        setSelectedChemicalsId({ Chem_Id: Chem_Id });
        localStorage.setItem('chemicalsCart', JSON.stringify(cartData));
    };

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        // Filter the chemicalsDetail based on the search query
        const filteredChemicals = chemicalsDetail.filter((chemical) =>
            chemical.Chem_Name.toLowerCase().includes(query.toLowerCase())
        );

        // Set the filtered chemicals as the new data to be displayed
        setFilteredChemicals(filteredChemicals);
    };

    const user_picture = localStorage.getItem('user_picture') ? <img src={localStorage.getItem('user_picture')} alt="user" className='user__avatar' /> : <i className="fa-solid fa-circle-user" />;
    const user_email = localStorage.getItem('user_email') ? <div className='user__email'>{localStorage.getItem('user_email')}</div> : <div className='user__email'>{studentInfo.studentEmail}</div>;

    const handleLogout = () => {
        axios.get(process.env.REACT_APP_API + "/student-logout").then((response) => {
            if (response.data.Error) {
                alert(response.data.Error);
            } else {
                localStorage.removeItem('user_name');
                localStorage.removeItem('user_email');
                localStorage.removeItem('user_picture');
                localStorage.removeItem('studentToken');
                navigate("/chem");
            }
        });
    };

    const findChemicalNameById = (chemId) => {
        const selectedChemical = chemicalsDetail.find((chemical) => chemical.Chem_Id === chemId);
        return selectedChemical ? selectedChemical.Chem_Name : "";
    };

    return (
        <div className='container-fluid vh-100'>
            <ToastContainer />
            <div className='dashboard__container'>
                <aside className='sidebar'>
                    <div className='sidebar__header'>
                        <img src={logo} alt="logo" className='sidebar__logo' width={49} height={33} />
                        <div className='sidebar__title std__name thai--font'>Welcome, {studentInfo.studentFirstName}</div>
                    </div>
                    <div className='sidebar__body'>
                        <Link to="/chem/student-dashboard/student-chemicals-list" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-list" /> <div className='sidebar__item--active'>List</div></Link>
                        <Link to="/chem/student-dashboard/bundle-list" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-boxes-stacked" /> Bundle</Link>
                        <Link to="/chem/student-dashboard/student-chemicals-cart" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-cart-shopping" /> Cart</Link>
                        <Link to="/chem/student-dashboard/student-chemicals-request" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-clock-rotate-left" /> History</Link>
                        <Link to="/chem/student-profile" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-user" /> Profile</Link>
                        <Link to="/chem/student-dashboard/student-view-teacher" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-users" /> Teacher</Link>
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
                                    <div>{user_picture}</div>
                                    <div>{user_email}</div>
                                </div>
                            </div>

                            <div >
                                <div className='table__tabs'>
                                    <Link className='table__tab table__tab--chemicals table__tab--active'>รายการสารเคมี</Link>
                                    <Link to="/chem/student-dashboard/student-equipment-list" className='table__tab table__tab--equipment table__tab--unactive'>รายการครุภัณฑ์</Link>
                                </div>

                                <table className='table table-striped'>
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
                                        {filteredChemicals.map((chemicalsDetail, index) => {
                                            // Filter the chemicalsReq list to find unique Chem_Id types
                                            const uniqueChemIdTypes = [...new Set(chemicalsReq.map(request => request.Chem_Id))];

                                            const isOffCanvasEnabled = uniqueChemIdTypes.length >= 3;

                                            return (
                                                <tr key={index} className="active-row">
                                                    <td> {index + 1} </td>
                                                    <td> {chemicalsDetail.Chem_Name} </td>
                                                    <td> {chemicalsDetail.Chem_CAS} </td>
                                                    <td> {chemicalsDetail.Chem_UN} </td>
                                                    <td> {chemicalsDetail.Chem_Type} </td>
                                                    <td> {chemicalsDetail.Chem_Grade} </td>
                                                    <td> {chemicalsDetail.Chem_State} </td>
                                                    <td>
                                                        <div>
                                                            <button
                                                                onClick={() => addToCart(chemicalsDetail.Chem_Id, chemicalsDetail.Chem_State)}
                                                                data-bs-toggle={isOffCanvasEnabled ? "offcanvas" : ""}
                                                                data-bs-target={isOffCanvasEnabled ? "#offcanvasWithBackdrop1" : ""}
                                                                aria-controls="offcanvasWithBackdrop"
                                                                className="table__button thai--font"
                                                            >
                                                                <i className="fa-solid fa-circle-plus" />
                                                                เพิ่มลงตระกร้า
                                                            </button>

                                                            {isOffCanvasEnabled && (
                                                                <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasWithBackdrop1" aria-labelledby="offcanvasWithBackdropLabel">
                                                                    <div className="offcanvas-header">
                                                                        <button type="button" className="btn-close text-reset offcanvas-close--button" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                                                                        <div className="offcanvas--title">
                                                                            {findChemicalNameById(selectedChemicalsId.Chem_Id)} <p className="offcanvas__title--highlight">ถูกเพิ่มลงตระกร้าสารเคมีแล้ว</p>
                                                                        </div>
                                                                        <Link to="/chem/student-dashboard/student-chemicals-cart" className="offcanvas--link">ไปที่ตระกร้าสารเคมี</Link>
                                                                    </div>
                                                                    <div className="offcanvas-body">
                                                                        {selectedChemicalsId && (
                                                                            <div>
                                                                                <h5 className="thai--font"> สารเคมีแนะนำ </h5>
                                                                                <ul className="offcanvas__lists">
                                                                                    {mostRequestedChemIds.map((chemId, index) => (
                                                                                        selectedChemicalsId.Chem_Id !== chemId && (
                                                                                            <li className="offcanvas__item" key={index}>
                                                                                                {findChemicalNameById(chemId)}
                                                                                                <button
                                                                                                    className="offcanvas__button"
                                                                                                    onClick={() => addChemToCartFromOffcanvas(chemId, chemicalsDetail.Chem_State)}
                                                                                                // Pass chemicalsDetail.Chem_State as an argument
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
                    <Link to="/chem/student-dashboard/student-chemicals-list" className='footer__item'> <i className="fa-solid fa-list" /></Link>
                    <Link to="/chem/student-dashboard/bundle-list" className='footer__item'> <i className="fa-solid fa-boxes-stacked" /></Link>
                    <Link to="/chem/student-dashboard/student-chemicals-cart" className='footer__item'> <i className="fa-solid fa-cart-shopping" /></Link>
                    <Link to="/chem/student-dashboard/student-chemicals-request" className='footer__item'> <i className="fa-solid fa-clock-rotate-left" /></Link>
                    <div className="dropup">
                        <button type="button" className='dropdown-toggle' data-bs-toggle="dropdown" aria-expanded="false">
                            <i className="fa-solid fa-user" />
                        </button>
                        <ul className="dropdown-menu">
                            <Link to="/chem/student-profile" className='dropdown-menu__item dropdown-menu__item--hover'> <i className="fa-solid fa-user" /> Profile</Link>
                            <Link to="/chem/student-dashboard/student-view-teacher" className='dropdown-menu__item dropdown-menu__item--hover'> <i className="fa-solid fa-users" /> Teacher</Link>
                            <button onClick={handleLogout} className='dropdown-menu__item dropdown-menu__item--hover '> <i className="fa-solid fa-arrow-right-from-bracket" /> Logout</button>
                        </ul>
                    </div>
                </footer>
            </div>
        </div>
    )
}

export default StudentChemicalsList