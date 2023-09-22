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

    useEffect(() => {
        getLogActivity();
    }, []);

    useEffect(() => {
        setFilteredLogActivity(logActivity);
    }, [logActivity]);

    const getLogActivity = async () => {
        const response = await axios.get("http://localhost:3001/log-activity");
        setLogActivity(response.data);
    }

    const deleteLogActivity = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/log-activity/${id}`)
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

    return (
        <div className="container-fluid">
            <main>
                <div className='component__header'>
                    <div className='component__headerGroup component__headerGroup--left'>
                        <i class='fa-solid fa-magnifying-glass'></i>
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
                                <th scope="col">Staff Id</th>
                                <th scope="col">Activity</th>
                                <th scope="col">Products</th>
                                <th scope="col">Create At</th>
                                <th scope="col">Update At</th>
                                <th scope="col"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLogActivity.map((logActivity) => (
                                <tr key={logActivity.LogActivity_Id} className="active-row">
                                    <td> {logActivity.LogActivity_Id} </td>
                                    <td> {logActivity.Staff_Id} </td>
                                    <td> {logActivity.LogActivity_Name} </td>
                                    <td> {logActivity.Chem_Bottle_Id || logActivity.Equipment_Id} </td>
                                    <td> {formatDate(logActivity.createdAt)} </td>
                                    <td> {formatDate(logActivity.updatedAt)} </td>
                                    <td>
                                        <div className="d-grid gap-2 d-sm-flex">
                                            <button onClick={() => deleteLogActivity(logActivity.LogActivity_Id)} className="btn btn-danger">Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    )
}

export default LogActivity
