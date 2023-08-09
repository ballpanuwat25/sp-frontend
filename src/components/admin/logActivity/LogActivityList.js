import axios from 'axios'
import React, { useState, useEffect } from 'react'

function LogActivityList() {
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
            <div className='d-flex justify-content-between align-items-center'>
                <h2>Chemicals Log Activity</h2>
                <div className='input-group w-25'>
                    <input
                        type="date"
                        className="form-control"
                        value={selectedDate}
                        onChange={(e) => {
                            setSelectedDate(e.target.value);
                        }}
                    />
                    <input
                        className="form-control"
                        type="search"
                        placeholder="Search"
                        aria-label="Search"
                        value={searchQuery}
                        onChange={handleSearch}
                    />
                    <button className="btn btn-outline-success" type="button" onClick={handleSearch}>
                        Search
                    </button>
                </div>
            </div>

            <table className="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">No</th>
                        <th scope="col">Staff Id</th>
                        <th scope="col">Log Activity</th>
                        <th scope="col">Chemicals</th>
                        <th scope="col">Create At</th>
                        <th scope="col">Update At</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredLogActivity.map((logActivity) => (
                        <tr key={logActivity.LogActivity_Id}>
                            <td> {logActivity.LogActivity_Id} </td>
                            <td> {logActivity.Staff_Id} </td>
                            <td> {logActivity.LogActivity_Name} </td>
                            <td> {logActivity.Chem_Id} </td>
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
    )
}

export default LogActivityList
