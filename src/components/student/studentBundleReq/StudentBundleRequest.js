import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

import '../../cssElement/Table.css'
import '../../cssElement/Form.css'
import '../../cssElement/Dashboard.css'

import logo from '../../assets/logo.png';

function StudentBundleRequest() {
    const [bundles, setBundles] = useState([]);
    const [chemicals, setChemicals] = useState([]);
    const [equipment, setEquipment] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [chemicalsRequest, setChemicalsRequest] = useState({
        Student_Id: "",
        Chem_Id: "",
        Requested_Quantity: "",
        Counting_Unit: "",
        Request_Purpose: "",
        Request_Room: "",
        Teacher_Id: "",
        Request_Status: "",
        Request_Comment: "",
    });

    const [equipmentRequest, setEquipmentRequest] = useState({
        Student_Id: "",
        Equipment_Id: "",
        Requested_Quantity: "",
        Counting_Unit: "",
        Request_Purpose: "",
        Request_Room: "",
        Teacher_Id: "",
        Request_Status: "",
        Request_Comment: "",
    });

    const { id } = useParams();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const bundleResponse = await axios.get(process.env.REACT_APP_API + `/bundle-list/${id}`);
            const chemicalsResponse = await axios.get(process.env.REACT_APP_API + "/chemicalsDetail-list");
            const equipmentResponse = await axios.get(process.env.REACT_APP_API + "/equipment-list");

            setBundles(bundleResponse.data);
            setChemicals(chemicalsResponse.data);
            setEquipment(equipmentResponse.data);
            setIsLoading(false); // Data fetching is complete
        } catch (error) {
            console.error('Error fetching data:', error);
            setIsLoading(false); // Set loading to false even if there's an error
        }
    };

    const sendBundleRequests = async (bundle) => {
        try {
            const allRequests = [];

            bundles.forEach((bundle) => {
                const requestData = {
                    Student_Id: studentInfo.studentId,
                    Requested_Quantity: bundle.Requested_Quantity,
                    Counting_Unit: bundle.Counting_Unit,
                    Request_Purpose: bundle.Request_Purpose,
                    Request_Room: bundle.Request_Room,
                    Teacher_Id: bundle.Teacher_Id,
                    Request_Status: "Pending",
                    Request_Comment: "Bundle Request",
                };

                if (bundle.Chem_Id) {
                    requestData.Chem_Id = bundle.Chem_Id;
                } else if (bundle.Equipment_Id) {
                    requestData.Equipment_Id = bundle.Equipment_Id;
                }

                allRequests.push(requestData);
            });

            await Promise.all(allRequests.map((requestData) => {
                if (requestData.Chem_Id) {
                    return axios.post(process.env.REACT_APP_API + "/chemicals-request-list", requestData);
                } else if (requestData.Equipment_Id) {
                    return axios.post(process.env.REACT_APP_API + "/equipment-request-list", requestData);
                }
                // You can add more conditions if needed
            }));

            navigate("/student-dashboard");
        } catch (err) {
            console.log(err);
        }
    };

    const [studentInfo, setStudentInfo] = useState({
        studentId: "",
        studentFirstName: "",
        studentLastName: "",
        studentEmail: "",
        studentPassword: "",
        studentTel: "",
    });

    const navigate = useNavigate();

    axios.defaults.withCredentials = true;

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
                });
                setEquipmentRequest({
                    ...equipmentRequest,
                    Student_Id: response.data.studentId,
                });
            }
        });
    }, []);

    const handleLogout = () => {
        axios.get(process.env.REACT_APP_API + "/student-logout").then((response) => {
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

    const user_picture = localStorage.getItem('user_picture') ? <img src={localStorage.getItem('user_picture')} alt="user" className='user__avatar' /> : <i className="fa-solid fa-circle-user" />;
    const user_email = localStorage.getItem('user_email') ? <div className='user__email'>{localStorage.getItem('user_email')}</div> : <div className='user__email'>{studentInfo.studentEmail}</div>;

    return (
        <div className='container-fluid vh-100'>
            <div className='dashboard__container'>
                <aside className='sidebar'>
                    <div className='sidebar__header'>
                        <img src={logo} alt="logo" className='sidebar__logo' width={49} height={33} />
                        <div className='sidebar__title std__name thai--font'>Welcome, {studentInfo.studentFirstName}</div>
                    </div>
                    <div className='sidebar__body'>
                        <Link to="/student-dashboard/student-chemicals-list" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-list" /> List</Link>
                        <Link to="/student-dashboard/bundle-list" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-boxes-stacked" /> <div className='sidebar__item--active'>Bundle</div></Link>
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
                        <div className="spinner-border text-success" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    ) : (
                        <div>
                            <div className='component__header'>
                                <div className='component__headerGroup component__headerGroup--left' />

                                <div className='component__headerGroup component__headerGroup--right'>
                                    <div>{user_picture}</div>
                                    <div>{user_email}</div>
                                </div>
                            </div>
                            <div >
                                <div className='table__tabs'>
                                    <div className='table__tab table__tab--chemicals table__tab--active'>รายละเอียดของกลุ่มสารเคมีและครุภัณฑ์</div>
                                </div>
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Items Id</th>
                                            <th scope="col">Items Name</th>
                                            <th scope="col">Requested Quantity</th>
                                            <th scope="col">Counting Unit</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bundles.map((bundle, index) => (
                                            <tr key={index} className="active-row">
                                                <td>{index + 1}</td>
                                                <td>{bundle.Chem_Id || bundle.Equipment_Id}</td>
                                                <td>
                                                    {bundle.Chem_Id
                                                        ? chemicals.find((chemical) => chemical.Chem_Id === bundle.Chem_Id)?.Chem_Name
                                                        : equipment.find((equipment) => equipment.Equipment_Id === bundle.Equipment_Id)?.Equipment_Name}
                                                </td>
                                                <td>{bundle.Requested_Quantity}</td>
                                                <td>{bundle.Counting_Unit}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <button className="table__tab table__button thai--font" type="button" onClick={sendBundleRequests}>
                                ยืนยันการขอเบิก
                            </button>
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
                        <ul className="dropdown-menu">
                            <Link to="/student-profile" className='dropdown-menu__item dropdown-menu__item--hover'> <i className="fa-solid fa-user" /> Profile</Link>
                            <Link to="/student-dashboard/student-view-teacher" className='dropdown-menu__item dropdown-menu__item--hover'> <i className="fa-solid fa-users" /> Teacher</Link>
                            <button onClick={handleLogout} className='dropdown-menu__item dropdown-menu__item--hover '> <i className="fa-solid fa-arrow-right-from-bracket" /> Logout</button>
                        </ul>
                    </div>
                </footer>

            </div>
        </div>
    );

}

export default StudentBundleRequest;
