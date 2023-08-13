import axios from "axios";
import React, { useState, useEffect } from 'react';

function ChemicalsStockList() {
  const [chemicals, setChemicals] = useState([]);
  const [chemicalsDetail, setChemicalsDetail] = useState([]);
  const [searchFilter, setSearchFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getChemicals();
    getChemicalsDetail();
  }, []);

  const getChemicals = async () => {
    const response = await axios.get("http://localhost:3001/chemicals-list");
    setChemicals(response.data);
  }

  const getChemicalsDetail = async () => {
    const response = await axios.get("http://localhost:3001/chemicalsDetail-list");
    setChemicalsDetail(response.data);
  }

  // Function to process the chemicals data and return a new array with unique chemical IDs and summed up quantities
  const processChemicalsData = () => {
    const uniqueChemicals = {};
    chemicals.forEach((chemical) => {
      const { Chem_Id, Remaining_Quantity, Package_Size } = chemical;
      if (uniqueChemicals[Chem_Id]) {
        uniqueChemicals[Chem_Id].Package_Size += Package_Size;
        uniqueChemicals[Chem_Id].Remaining_Quantity += Remaining_Quantity;
      } else {
        uniqueChemicals[Chem_Id] = {
          Package_Size: Package_Size,
          Remaining_Quantity,
        };
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

  return (
    <div className="container-fluid">
      <div className='d-flex justify-content-between align-items-center'>
        <h2>Chemicals Stock</h2>
        <div className="input-group w-25">
          <select id="searchFilter" value={searchFilter} onChange={handleSearchFilterChange} className="btn btn-outline-primary" >
            <option value="All">All</option>
            <option value="Liquid">Liquid</option>
            <option value="Solid">Solid</option>
          </select>
          <input
            type="text"
            id="searchTerm"
            className="form-control"
            value={searchTerm}
            onChange={handleSearchInputChange}
            placeholder="Enter Chem_Name..."
          />
        </div>
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">No</th>
            <th scope="col">Chemicals Id</th>
            <th scope="col">Chemicals Name</th>
            <th scope="col">Remaining Quantity</th>
            <th scope="col">Total Quantity</th>
            <th scope="col">Counting Unit</th>
            <th scope="col">Chemicals State</th>
          </tr>
        </thead>
        <tbody>
          {processChemicalsData().map((chemical, index) => (
            <tr key={index}>
              <td> {index + 1} </td>
              <td> {chemical.Chem_Id} </td>
              <td> {chemical.Chem_Name} </td>
              <td> {chemical.Remaining_Quantity} </td>
              <td> {chemical.Package_Size} </td>
              <td> {chemical.Counting_Unit} </td>
              <td> {chemical.Chem_State} </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ChemicalsStockList;