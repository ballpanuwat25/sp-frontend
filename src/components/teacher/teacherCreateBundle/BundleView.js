import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams, useNavigate } from 'react-router-dom';

import '../../cssElement/Table.css'
import '../../cssElement/Form.css'
import '../../cssElement/Dashboard.css'

import logo from '../../assets/logo.png';

function BundleView({ logout }) {
    const [bundles, setBundles] = useState([]);
    const [chemicals, setChemicals] = useState([]);
    const [equipment, setEquipment] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const { id } = useParams();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const bundleResponse = await axios.get(`http://localhost:3001/bundle-list/${id}`);
            const chemicalsResponse = await axios.get("http://localhost:3001/chemicalsDetail-list");
            const equipmentResponse = await axios.get("http://localhost:3001/equipment-list");

            setBundles(bundleResponse.data);
            setChemicals(chemicalsResponse.data);
            setEquipment(equipmentResponse.data);
            setIsLoading(false); // Data fetching is complete
        } catch (error) {
            console.error('Error fetching data:', error);
            setIsLoading(false); // Set loading to false even if there's an error
        }
    };

    const [teacherInfo, setTeacherInfo] = useState({
        teacherId: "",
        teacherFirstName: "",
        teacherLastName: "",
        teacherUsername: "",
        teacherPassword: "",
        teacherTel: "",
    });

    useEffect(() => {
        axios.get("http://localhost:3001/teacher").then((response) => {
            if (response.data.Error) {
                alert(response.data.Error);
            } else {
                setTeacherInfo(response.data);
            }
        });
    }, []);

    axios.defaults.withCredentials = true;
    const navigate = useNavigate();

    const handleLogout = () => {
        axios.get("http://localhost:3001/teacher-logout").then((response) => {
            if (response.data.Error) {
                alert(response.data.Error);
            } else {
                logout();
                localStorage.removeItem('teacherToken');
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
                        <div className='sidebar__title admin__name'>Welcome, {teacherInfo.teacherFirstName}</div>
                    </div>
                    <div className='sidebar__body'>
                        <Link to="/teacher-dashboard/teacher-chemicals-request" className='sidebar__item sidebar__item--hover'> <i class="fa-regular fa-clock" /> <div className="ms-1">Request</div></Link>
                        <Link to="/teacher-dashboard/chemicals-bundle-list" className='sidebar__item sidebar__item--hover'> <i class="fa-solid fa-list" /> List</Link>
                        <Link to="/teacher-dashboard/bundle-list" className='sidebar__item sidebar__item--hover'> <i class="fa-solid fa-boxes-stacked" /> <div className='sidebar__item--active'>Bundle</div></Link>
                        <Link to="/teacher-profile" className='sidebar__item sidebar__item--hover'> <i class="fa-solid fa-user" /> Profile</Link>
                    </div>
                    <div className='sidebar__footer'>
                        <button onClick={handleLogout} className='sidebar__item sidebar__item--footer sidebar__item--hover '> <i class="fa-solid fa-arrow-right-from-bracket" /> Logout</button>
                    </div>
                </aside>
                <main className='dashboard__content'>
                    {isLoading ? (
                        <p>Loading...</p>
                    ) : (
                        <div>

                            <div className='component__header'>
                                <div className='component__headerGroup component__headerGroup--left'>

                                </div>

                                <div className='component__headerGroup component__headerGroup--right'>
                                    <i class="fa-solid fa-circle-user" />
                                    <div className='username--text thai--font'>{teacherInfo.teacherUsername}</div>
                                </div>
                            </div>

                            <div>
                                <div className='table__tabs'>
                                    <div className='table__tab table__tab--chemicals table__tab--active'>รายละเอียดของกลุ่มสารเคมีและครุภัณฑ์</div>
                                </div>

                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">รหัส</th>
                                            <th scope="col">ชื่อ</th>
                                            <th scope="col">จำนวน</th>
                                            <th scope="col">หน่วยนับ</th>
                                            <th scope="col">สร้างโดย</th>
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
                                                <td>{bundle.Teacher_Id}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </main>

            </div>
        </div>
    );

}

export default BundleView;
