import axios from 'axios';
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';

import '../../cssElement/Table.css'
import '../../cssElement/Form.css'
import '../../cssElement/Dashboard.css'

import logo from '../../assets/logo.png';

function ChemicalsStockList({ logout }) {
  const [chemicals, setChemicals] = useState([]);
  const [chemicalsDetail, setChemicalsDetail] = useState([]);

  const [searchFilter, setSearchFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const [isLoading, setIsLoading] = useState(true);

  const [staffInfo, setStaffInfo] = useState({
    staffId: "",
    staffFirstName: "",
    staffLastName: "",
    staffUsername: "",
    staffPassword: "",
    staffTel: "",
  })

  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  useEffect(() => {
    getChemicals();
    getChemicalsDetail();
  }, []);

  useEffect(() => {
    axios.get(process.env.REACT_APP_API + "/staff", {
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

  const getChemicals = async () => {
    const response = await axios.get(process.env.REACT_APP_API + "/chemicals-list");
    setChemicals(response.data);
    setIsLoading(false);
  }

  const getChemicalsDetail = async () => {
    const response = await axios.get(process.env.REACT_APP_API + "/chemicalsDetail-list");
    setChemicalsDetail(response.data);
    setIsLoading(false);
  }

  // Function to process the chemicals data and return a new array with unique chemical IDs and summed up quantities
  // Modify processChemicalsData function to include the filter
  const processChemicalsData = () => {
    const uniqueChemicals = {};

    // Iterate through the chemicals and calculate adjusted quantities
    chemicals.forEach((chemical) => {
      const { Chem_Id, Remaining_Quantity, Package_Size } = chemical;
      
      if (Remaining_Quantity / Package_Size >= 0.1) {
        if (uniqueChemicals[Chem_Id]) {
          uniqueChemicals[Chem_Id].Package_Size += Package_Size;
          uniqueChemicals[Chem_Id].Remaining_Quantity += Remaining_Quantity;
        } else {
          uniqueChemicals[Chem_Id] = {
            Package_Size: Package_Size,
            Remaining_Quantity,
          };
        }
      }
    });

    // Convert the object of unique chemicals to an array of objects
    let processedChemicals = Object.keys(uniqueChemicals).map((Chem_Id) => {
      // Find the corresponding chemicalsDetail based on Chem_Id
      const detail = chemicalsDetail.find((detail) => detail.Chem_Id === Chem_Id);

      // Set Counting_Unit based on Chem_State
      let Counting_Unit;
      if (detail) {
        Counting_Unit =
          detail.Chem_State === "Solid"
            ? "g"
            : detail.Chem_State === "Liquid"
              ? "ml"
              : "N/A";
      } else {
        Counting_Unit = "N/A";
      }

      return {
        Chem_Id,
        Chem_Name: detail ? detail.Chem_Name : "N/A",
        Package_Size: uniqueChemicals[Chem_Id].Package_Size,
        Remaining_Quantity: uniqueChemicals[Chem_Id].Remaining_Quantity,
        Counting_Unit,
        Chem_State: detail ? detail.Chem_State : "N/A",
      };
    });

    // Filter chemicals based on the searchFilter (Chem_State)
    if (searchFilter !== "All") {
      processedChemicals = processedChemicals.filter(
        (chemical) => chemical.Chem_State === searchFilter
      );
    }

    // Filter chemicals based on the searchTerm (Chem_Name)
    if (searchTerm.trim() !== "") {
      processedChemicals = processedChemicals.filter((chemical) =>
        chemical.Chem_Name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return processedChemicals;
  };

  const handleSearchFilterChange = (event) => {
    setSearchFilter(event.target.value);
  };

  const handleSearchInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleLogout = () => {
    axios.get(process.env.REACT_APP_API + "/staff-logout").then((response) => {
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
            <Link to="/chemicals-list" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-flask" /> Chemicals</Link>
            <Link to="/equipment-list" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-toolbox" />Equipment</Link>
            <Link to="/chemicals-stock" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-flask-vial" /> <div className='sidebar__item--active'> Stock</div></Link>
            <Link to="/approve-students-list" className='sidebar__item sidebar__item--hover'> <i className="fa-solid fa-users" /> Users</Link>
            <Link to="/staff-profile" className='sidebar__item sidebar__item--hover'> <i className="fa-regular fa-user" /> Profile</Link>
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
                  <i className='fa-solid fa-magnifying-glass' />
                  <input
                    type="text"
                    id="searchTerm"
                    className="component__search"
                    value={searchTerm}
                    onChange={handleSearchInputChange}
                    placeholder="Enter Chem_Name..."
                  />
                </div>

                <div className='component__headerGroup component__headerGroup--right'>
                  <i className="fa-solid fa-circle-user" />
                  <div className='username--text thai--font'>{staffInfo.staffUsername}</div>
                </div>
              </div>

              <div>
                <div className='table__tabs'>
                  <Link className='table__tab table__tab--chemicals table__tab--active'>คลังสารเคมีกลาง</Link>
                  <Link to="/chemicalsStock-filter" className='table__tab table__tab--equipment table__tab--unactive'>สารเคมีที่ใกล้หมด</Link>
                </div>

                <table className="table table-striped" id="stock-table">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">รหัสสารเคมี</th>
                      <th scope="col">ชื่อสารเคมี</th>
                      <th scope="col">ปริมาณทั้งหมด</th>
                      <th scope="col">ปริมาณคงเหลือ</th>
                      <th scope="col">หน่วยนับ</th>
                      <th scope="col">
                        <select id="searchFilter" value={searchFilter} onChange={handleSearchFilterChange} className="buttonTab-btn thai--font" >
                          <option disabled>เลือกสถานะของสาร</option>
                          <option value="All">ทั้งหมด</option>
                          <option value="Liquid">Liquid</option>
                          <option value="Solid">Solid</option>
                        </select>
                      </th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {processChemicalsData().map((chemical, index) => (
                      <tr key={index} className="active-row">
                        <td> {index + 1} </td>
                        <td> {chemical.Chem_Id} </td>
                        <td> {chemical.Chem_Name} </td>
                        <td> {chemical.Package_Size} </td>
                        <td> {chemical.Remaining_Quantity} </td>
                        <td> {chemical.Counting_Unit} </td>
                        <td> {chemical.Chem_State} </td>
                        <td>
                          <Link className='disable--link thai--font' to={`./${chemical.Chem_Id}`} >
                            <div className="table__button">
                              <i className="fa-solid fa-eye"></i>
                              ดูรายละเอียด
                            </div>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
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
              <Link to="/approve-students-list" className='dropdown-menu__item dropdown-menu__item--hover'> <i className="fa-regular fa-users" /> Users</Link>
              <button onClick={handleLogout} className='dropdown-menu__item dropdown-menu__item--hover '> <i className="fa-solid fa-arrow-right-from-bracket" /> Logout</button>
            </ul>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default ChemicalsStockList;