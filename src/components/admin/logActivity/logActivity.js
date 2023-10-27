import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';

import '../../cssElement/Table.css'
import '../../cssElement/Form.css'
import '../../cssElement/Dashboard.css'

function LogActivity() {
    const [logActivity, setLogActivity] = useState([]);
    const [filteredLogActivity, setFilteredLogActivity] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDate, setSelectedDate] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const [staff, setStaff] = useState([]);

    useEffect(() => {
        getLogActivity();
        getStaff();
        console.log(staff)
    }, []);

    useEffect(() => {
        setFilteredLogActivity(logActivity);
    }, [logActivity]);

    const getLogActivity = async () => {
        const response = await axios.get("https://special-problem.onrender.com/log-activity");
        
        setLogActivity(response.data);
        setIsLoading(false);
    }

    const getStaff = async () => {
        const response = await axios.get("https://special-problem.onrender.com/staff-list");
        setStaff(response.data);
    }

    const getStaffNameById = (staffId) => {
        const staffInfo = staff.find((staff) => staff.Staff_Id === staffId);
        return staffInfo ? staffInfo.Staff_FName + " " + staffInfo.Staff_LName : "N/A";
    };

    const deleteLogActivity = async (id) => {
        try {
            await axios.delete(`https://special-problem.onrender.com/log-activity/${id}`)
            getLogActivity();
        } catch (error) {
            console.log(error)
        }
    }

    const formatDate = (dateString) => {
        const options = { day: 'numeric', month: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', options);
    };

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        const filteredLogActivity = logActivity.filter((activity) => {
            const activityDate = new Date(activity.createdAt);
            const selectedDateObj = selectedDate ? new Date(selectedDate) : null;

            return (
                (activity.Staff_Id.toLowerCase().includes(query.toLowerCase()) || query === "") &&
                (!selectedDateObj ||
                    (activityDate.getFullYear() === selectedDateObj.getFullYear() &&
                        activityDate.getMonth() === selectedDateObj.getMonth() &&
                        activityDate.getDate() === selectedDateObj.getDate()))
            );
        });

        setFilteredLogActivity(filteredLogActivity);
    };

    const sortedLogActivity = [...filteredLogActivity].sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateB - dateA; // Sort in descending order (newest first)
    });

    return (
        <div className="container-fluid">
            <main>
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
                                    placeholder="ค้นหาด้วยรหัสเจ้าหน้าที่หรือวันเดือนปี"
                                    value={searchQuery}
                                    onChange={handleSearch}
                                />
                            </div>

                            <div className='component__headerGroup component__headerGroup--right'>
                                <input
                                    type="date"
                                    className="date__input"
                                    value={selectedDate}
                                    onChange={(e) => {
                                        setSelectedDate(e.target.value);
                                    }}
                                />
                                <button className="search__button" type="button" onClick={handleSearch}>
                                    ค้นหา
                                </button>
                            </div>
                        </div>

                        <div >
                            <div className='table__tabs'>
                                <Link className='table__tab table__tab--chemicals table__tab--active'>Log Activity</Link>
                            </div>

                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">รหัสเจ้าหน้าที่</th>
                                        <th scope="col">ชื่อ-สกุล</th>
                                        <th scope="col">กิจกรรม</th>
                                        <th scope="col">ผลิตภัณฑ์</th>
                                        <th scope="col"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedLogActivity.map((logActivity) => (
                                        <tr key={logActivity.LogActivity_Id} className="active-row">
                                            <td> {logActivity.LogActivity_Id} </td>
                                            <td> {logActivity.Staff_Id} </td>
                                            <td> {getStaffNameById(logActivity.Staff_Id)} </td>
                                            <td> {logActivity.LogActivity_Name} </td>
                                            <td> {logActivity.Chem_Bottle_Id || logActivity.Equipment_Id} </td>
                                            <td> {formatDate(logActivity.createdAt)} </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}

export default LogActivity
