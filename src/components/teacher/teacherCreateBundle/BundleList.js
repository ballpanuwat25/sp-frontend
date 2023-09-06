import axios from 'axios'
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react'

function BundleList() {
    const [teacherId, setTeacherId] = useState("");
    const [teacherIdSearch, setTeacherIdSearch] = useState("");

    const [bundleList, setBundleList] = useState([]);
    const [filteredBundleList, setFilteredBundleList] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    axios.defaults.withCredentials = true;

    useEffect(() => {
        getBundleList();
    }, []);

    useEffect(() => {
        setFilteredBundleList(bundleList);
    }, [bundleList]);

    useEffect(() => {
        axios.get("https://special-problem.onrender.com/teacher").then((response) => {
            if (response.data.Error) {
                alert(response.data.Error);
            } else {
                setTeacherId(response.data.teacherId);
            }
        });
    }, []);

    const getBundleList = async () => {
        const response = await axios.get("https://special-problem.onrender.com/bundle-list");
        setBundleList(response.data);
    }

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        const filteredBundleList = bundleList.filter((bundle) => {
            return (
                (bundle.Bundle_Name.toLowerCase().includes(query.toLowerCase()) || query === "")
            );
        });

        setFilteredBundleList(filteredBundleList);
    };

    const handleTeacherIdSearch = (e) => {
        const query = e.target.value;
        setTeacherIdSearch(query);

        const filteredBundleList = bundleList.filter((bundle) => {
            return (
                (bundle.Teacher_Id.toLowerCase().includes(query.toLowerCase()) || query === "")
            );
        });

        setFilteredBundleList(filteredBundleList);
    };

    const formatDate = (date) => {
        const d = new Date(date);
        let month = `${d.getMonth() + 1}`;
        let day = `${d.getDate()}`;
        const year = `${d.getFullYear()}`;

        if (month.length < 2) {
            month = `0${month}`;
        }

        if (day.length < 2) {
            day = `0${day}`;
        }

        return [day, month, year].join("-");
    };

    function processBundleData(bundleList) {
        const uniqueBundleNames = {};
        const processedBundleList = [];

        bundleList.forEach((bundle) => {
            const { Bundle_Id, Bundle_Name, Bundle_Description, Teacher_Id, createdAt } = bundle;

            if (!uniqueBundleNames[Bundle_Name]) {
                uniqueBundleNames[Bundle_Name] = true; // Mark the bundle name as seen
                processedBundleList.push({
                    Bundle_Id,
                    Bundle_Name,
                    Bundle_Description,
                    Teacher_Id,
                    createdAt,
                });
            }
        });

        return processedBundleList;
    }

    const processedBundleList = processBundleData(filteredBundleList);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://special-problem.onrender.com/bundle-list/${id}`);
            alert("Bundle deleted successfully");
            getBundleList();
        } catch (err) {
            alert(err.response.data.Error);
        }
    }

    useEffect(() => {
        const filteredBundleList = bundleList.filter((bundle) => {
            return (
                bundle.Teacher_Id.toLowerCase().includes(teacherId.toLowerCase()) ||
                teacherId === ""
            );
        });
    
        setFilteredBundleList(filteredBundleList);
    }, [teacherId, bundleList]);    

    return (
        <div className='container-fluid'>
            <div className='d-flex justify-content-between align-items-center'>
                <h2 className='mb-4'>Teacher Bundle List</h2>
                <div className='col-md-3'>
                    <input
                        type='text'
                        className='form-control mb-2 mt-2'
                        placeholder='Search by bundle name'
                        value={searchQuery}
                        onChange={handleSearch}
                    />
                    <input
                        type='text'
                        className='form-control'
                        placeholder='Search by Teacher Id'
                        value={teacherId}
                        readOnly
                    />
                </div>
            </div>

            <table className='table table-striped'>
                <thead>
                    <tr>
                        <th scope='col'>#</th>
                        <th scope='col'>Bundle Name</th>
                        <th scope='col'>Bundle Description</th>
                        <th scope='col'>Created By</th>
                        <th scope='col'>Created At</th>
                        <th scope='col'>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {processedBundleList.map((bundle, index) => (
                        <tr key={index}>
                            <th scope='row'>{index + 1}</th>
                            <td>{bundle.Bundle_Name}</td>
                            <td>{bundle.Bundle_Description}</td>
                            <td>{bundle.Teacher_Id}</td>
                            <td>{formatDate(bundle.createdAt)}</td>
                            <td>
                                <Link to={`${bundle.Bundle_Name}`} className='btn btn-outline-primary me-2'>View Bundle</Link>
                                <button className='btn btn-outline-danger' onClick={() => handleDelete(bundle.Bundle_Name)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default BundleList
