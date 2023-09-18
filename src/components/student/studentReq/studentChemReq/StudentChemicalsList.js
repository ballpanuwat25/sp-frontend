import axios from "axios";
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';

import '../css/StudentRequest.css'
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

    axios.defaults.withCredentials = true;

    useEffect(() => {
        getChemicalsRequest();
    }, []);

    const getChemicalsRequest = async () => {
        try {
            const response = await axios.get("http://localhost:3001/chemicals-request-list");
            setChemicalsReq(response.data);
            findMostRequestedChemIds(response.data, 10);
        } catch (error) {
            console.error("Error fetching chemicals request:", error);
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

    const addChemToCartFromOffcanvas = (chemId) => {
        // Get the existing cart data from localStorage (if any)
        const cartData = JSON.parse(localStorage.getItem('chemicalsCart')) || [];

        // Check if the selected chemicals are already in the cart
        const existingChemical = cartData.find(item => item.Student_Id === studentInfo.studentId && item.Chem_Id === chemId);

        if (existingChemical) {
            alert('This chemical is already in your cart');
            return;
        }

        cartData.push({
            Student_Id: studentInfo.studentId,
            Chem_Id: chemId,
        });

        localStorage.setItem('chemicalsCart', JSON.stringify(cartData));
    };

    useEffect(() => {
        axios.get("http://localhost:3001/student", {
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
        getChemicalsDetail();
    }, []);

    useEffect(() => {
        setFilteredChemicals(chemicalsDetail);
    }, [chemicalsDetail]);

    const getChemicalsDetail = async () => {
        const response = await axios.get("http://localhost:3001/chemicalsDetail-list");
        setChemicalsDetail(response.data);
    }

    const addToCart = (Chem_Id) => {
        // Get the existing cart data from localStorage (if any)
        const cartData = JSON.parse(localStorage.getItem('chemicalsCart')) || [];

        // Check if the selected chemicals are already in the cart
        const existingChemical = cartData.find(item => item.Student_Id === studentInfo.studentId && item.Chem_Id === Chem_Id);

        if (existingChemical) {
            alert('This chemical is already in your cart');
        } else {
            cartData.push({
                Student_Id: studentInfo.studentId,
                Chem_Id,
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

    const user_picture = localStorage.getItem('user_picture') ? <img src={localStorage.getItem('user_picture')} alt="user" className='user__avatar' /> : <i class="fa-solid fa-circle-user" />;
    const user_email = localStorage.getItem('user_email') ? <div className='user__email'>{localStorage.getItem('user_email')}</div> : <div className='user__email'>{studentInfo.studentEmail}</div>;

    const handleLogout = () => {
        axios.get("http://localhost:3001/student-logout").then((response) => {
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

    const findChemicalNameById = (chemId) => {
        const selectedChemical = chemicalsDetail.find((chemical) => chemical.Chem_Id === chemId);
        return selectedChemical ? selectedChemical.Chem_Name : "";
    };

    return (
        <div className='container-fluid vh-100'>
            <div className='dashboard__container'>
                <aside className='sidebar'>
                    <div className='sidebar__header'>
                        <img src={logo} alt="logo" className='sidebar__logo' width={49} height={33} />
                        <div className='sidebar__title std__name'>Welcome, {studentInfo.studentFirstName}</div>
                    </div>
                    <div className='sidebar__body'>
                        <Link to="./student-chemicals-list" className='sidebar__item sidebar__item--hover'> <i class="fa-solid fa-list" /> <div className='sidebar__item--active'>List</div></Link>
                        <Link to="./bundle-list" className='sidebar__item sidebar__item--hover'> <i class="fa-solid fa-boxes-stacked" /> Bundle</Link>
                        <Link to="./student-chemicals-cart" className='sidebar__item sidebar__item--hover'> <i class="fa-solid fa-cart-shopping" /> Cart</Link>
                        <Link to="./student-chemicals-request" className='sidebar__item sidebar__item--hover'> <i class="fa-solid fa-clock-rotate-left" /> History</Link>
                        <Link to="/student-profile" className='sidebar__item sidebar__item--hover'> <i class="fa-solid fa-user" /> Profile</Link>
                    </div>
                    <div className='sidebar__footer'>
                        <button onClick={handleLogout} className='sidebar__item sidebar__item--footer sidebar__item--hover '> <i class="fa-solid fa-arrow-right-from-bracket" /> Logout</button>
                    </div>
                </aside>

                <main className='dashboard__content'>
                    <div className='component__header'>
                        <div className='component__headerGroup component__headerGroup--left'>
                            <i class='fa-solid fa-magnifying-glass'></i>
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

                    <div className='table-responsive'>
                        <div className='table__tabs'>
                            <Link className='table__tab table__tab--chemicals table__tab--active'>สารเคมี</Link>
                            <Link to="/student-dashboard/student-equipment-list" className='table__tab table__tab--equipment table__tab--unactive'>ครุภัณฑ์</Link>
                        </div>
                        <table className='table table-striped'>
                            <thead>
                                <tr>
                                    <th scope="col">No</th>
                                    <th scope="col">Chemicals Name</th>
                                    <th scope="col">Chemicals CAS</th>
                                    <th scope="col">Chemicals UN</th>
                                    <th scope="col">Chemicals Type</th>
                                    <th scope="col">Chemicals Grade</th>
                                    <th scope="col">Chemicals State</th>
                                    <th scope="col">Add to Cart</th>
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
                                                        onClick={() => addToCart(chemicalsDetail.Chem_Id)}
                                                        data-bs-toggle={isOffCanvasEnabled ? "offcanvas" : ""}
                                                        data-bs-target={isOffCanvasEnabled ? "#offcanvasWithBackdrop1" : ""}
                                                        aria-controls="offcanvasWithBackdrop"
                                                    >
                                                        <i class="fa-solid fa-circle-plus" />
                                                    </button>

                                                    {isOffCanvasEnabled && (
                                                        <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasWithBackdrop1" aria-labelledby="offcanvasWithBackdropLabel">
                                                            <div className="offcanvas-header">
                                                                <div>
                                                                    <h3 className="offcanvas-title" id="offcanvasWithBackdropLabel">
                                                                        {findChemicalNameById(selectedChemicalsId.Chem_Id)} is added to cart
                                                                        <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                                                                    </h3>
                                                                </div>
                                                                <p>go to cart</p>
                                                            </div> <hr />
                                                            <div className="offcanvas-body">
                                                                {selectedChemicalsId && (
                                                                    <div>
                                                                        <h5> Chemicals Suggestions </h5>
                                                                        <ul className="offcanvas__lists">
                                                                            {mostRequestedChemIds.map((chemId, index) => (
                                                                                selectedChemicalsId.Chem_Id !== chemId && (
                                                                                    <li className="offcanvas__item" key={index}>
                                                                                        {findChemicalNameById(chemId)}
                                                                                        <button
                                                                                            className="offcanvas__button"
                                                                                            onClick={() => addChemToCartFromOffcanvas(chemId)}
                                                                                        >
                                                                                            <i class="fa-solid fa-circle-plus" />
                                                                                            <div className="offcanvas__button-text">
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
                </main>

                <footer className='footer'>
                    <Link to="./student-chemicals-list" className='footer__item'> <i class="fa-solid fa-list" /></Link>
                    <Link to="./bundle-list" className='footer__item'> <i class="fa-solid fa-boxes-stacked" /></Link>
                    <Link to="./student-chemicals-cart" className='footer__item'> <i class="fa-solid fa-cart-shopping" /></Link>
                    <Link to="./student-chemicals-request" className='footer__item'> <i class="fa-solid fa-clock-rotate-left" /></Link>
                    <div className="dropup">
                        <button type="button" className='dropdown-toggle' data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="fa-solid fa-user" />
                        </button>
                        <ul class="dropdown-menu">
                            <Link to="/student-profile" className='dropdown-menu__item dropdown-menu__item--hover'> <i class="fa-solid fa-user" /> Profile</Link>
                            <button onClick={handleLogout} className='dropdown-menu__item dropdown-menu__item--hover '> <i class="fa-solid fa-arrow-right-from-bracket" /> Logout</button>
                        </ul>
                    </div>
                </footer>
            </div>
        </div>
    )
}

export default StudentChemicalsList