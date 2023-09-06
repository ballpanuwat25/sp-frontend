import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { saveAs } from 'file-saver';
import ExcelJS from 'exceljs'; // Import exceljs library
import { Link } from 'react-router-dom';

function ChemicalsStockList() {
  const [chemicals, setChemicals] = useState([]);
  const [chemicalsDetail, setChemicalsDetail] = useState([]);
  const [searchFilter, setSearchFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const [exportData, setExportData] = useState([]);

  useEffect(() => {
    // Filter the data and set it to the exportData state
    const filteredData = processChemicalsData().filter(chemical => {
      const remainingPercentage = (chemical.Remaining_Quantity / chemical.Package_Size) * 100;
      return remainingPercentage < 25;
    });
    setExportData(filteredData);
  }, []);

  useEffect(() => {
    getChemicals();
    getChemicalsDetail();
  }, []);

  const getChemicals = async () => {
    const response = await axios.get("https://special-problem.onrender.com/chemicals-list");
    setChemicals(response.data);
  }

  const getChemicalsDetail = async () => {
    const response = await axios.get("https://special-problem.onrender.com/chemicalsDetail-list");
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

  const getRemainingQuantityColor = (remainingQuantity, packageSize) => {
    if (remainingQuantity == 0) {
      return "table-danger"; // Mark chemicals with no remaining quantity as red
    } else if (remainingQuantity <= 0.25 * packageSize) {
      return "table-warning"; // Mark chemicals with remaining quantity below 25% as yellow
    } else if (remainingQuantity <= 0.5 * packageSize) {
      return "table-info"; // Mark chemicals with remaining quantity below 50% as blue
    } else if (remainingQuantity >= 0.75 * packageSize) {
      return "table-success"; // Mark chemicals with remaining quantity below 75% as green
    }
    return ""; // Default styling
  };

  const exportToPDF = () => {
    const unit = "pt";
    const size = "A4";
    const orientation = "landscape";
  
    const marginLeft = 40;
    const doc = new jsPDF(orientation, unit, size);
  
    doc.setFontSize(15);
  
    const title = "Chemicals Stock Report";
    const headers = [
      "No", "Chemicals Id", "Chemicals Name", "Remaining Quantity", "Total Quantity", "Counting Unit", "Chemicals State"
    ];
  
    const data = exportData.map((chemical, index) => [
      index + 1,
      chemical.Chem_Id,
      chemical.Chem_Name,
      chemical.Remaining_Quantity,
      chemical.Package_Size,
      chemical.Counting_Unit,
      chemical.Chem_State
    ]);
  
    // Ensure data rows match the headers configuration
    const content = {
      startY: 50,
      head: [headers], // Wrap headers array in another array
      body: data
    };
  
    doc.text(title, marginLeft, 40);
    doc.autoTable(content);
    doc.save("chemicals_stock.pdf");
  };
  

  const exportToExcel = () => {
    const filteredData = processChemicalsData().filter(chemical => {
      const remainingPercentage = (chemical.Remaining_Quantity / chemical.Package_Size) * 100;
      return remainingPercentage < 25;
    });
  
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('ChemicalsStock');
  
    // Add headers to the worksheet
    const headers = ['No', 'Chemicals Id', 'Chemicals Name', 'Remaining Quantity', 'Total Quantity', 'Counting Unit', 'Chemicals State'];
    worksheet.addRow(headers);
  
    // Add data rows to the worksheet
    filteredData.forEach((chemical, index) => {
      worksheet.addRow([
        index + 1,
        chemical.Chem_Id,
        chemical.Chem_Name,
        chemical.Remaining_Quantity,
        chemical.Package_Size,
        chemical.Counting_Unit,
        chemical.Chem_State,
      ]);
    });
  
    // Save the workbook to a Blob
    workbook.xlsx.writeBuffer().then(buffer => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, 'chemicals_stock.xlsx');
    });
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
      <div>
        <button className="btn btn-success me-2" onClick={exportToExcel}>
          Export to Excel
        </button>

        <button className="btn btn-danger" onClick={exportToPDF}>
          Export to PDF
        </button>
      </div>
      <table className="table table-striped" id="stock-table">
        <thead>
          <tr>
            <th scope="col">No</th>
            <th scope="col">Chemicals Id</th>
            <th scope="col">Chemicals Name</th>
            <th scope="col">Remaining Quantity</th>
            <th scope="col">Total Quantity</th>
            <th scope="col">Counting Unit</th>
            <th scope="col">Chemicals State</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {processChemicalsData().map((chemical, index) => (
            <tr key={index} className={getRemainingQuantityColor(chemical.Remaining_Quantity, chemical.Package_Size)}>
              <td> {index + 1} </td>
              <td> {chemical.Chem_Id} </td>
              <td> {chemical.Chem_Name} </td>
              <td> {chemical.Remaining_Quantity} </td>
              <td> {chemical.Package_Size} </td>
              <td> {chemical.Counting_Unit} </td>
              <td> {chemical.Chem_State} </td>
              <td>
                <Link className="btn btn-primary btn-sm" to={`./${chemical.Chem_Id}`} >View</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ChemicalsStockList;