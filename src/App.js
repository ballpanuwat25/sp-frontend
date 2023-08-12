import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './components/Home.js';

import AdminLogin from './components/admin/adminLogin/AdminLogin.js';
import AdminRegister from './components/admin/adminLogin/AdminRegister.js';
import AdminForgetPassword from './components/admin/adminLogin/AdminForgetPassword.js';
import AdminDashboard from './components/admin/AdminDashboard.js';
import AdminProfile from './components/admin/adminLogin/AdminProfile';

import StaffLogin from './components/staff/staffLogin/StaffLogin.js';
import StaffRegister from './components/staff/staffLogin/StaffRegister.js';
import StaffForgetPassword from './components/staff/staffLogin/StaffForgetPassword.js';
import StaffDashboard from './components/staff/StaffDashboard.js';
import StaffProfile from './components/staff/staffLogin/StaffProfile';

import AddStaff from './components/admin/staffCrud/AddStaff.js';
import EditStaff from './components/admin/staffCrud/EditStaff.js';
import StaffList from './components/admin/staffCrud/StaffList.js';

import AddChemicals from './components/staff/chemicalsCrud/AddChemicals.js';
import EditChemicals from './components/staff/chemicalsCrud/EditChemicals.js';
import ChemicalsList from './components/staff/chemicalsCrud/ChemicalsList.js';

import AddChemicalsDetail from './components/staff/chemicalsDetailCrud/AddChemicalsDetail.js';
import EditChemicalsDetail from './components/staff/chemicalsDetailCrud/EditChemicalsDetail.js';
import ChemicalsDetailList from './components/staff/chemicalsDetailCrud/ChemicalsDetailList.js';

import ChemicalsStockList from './components/staff/chemicalsStock/ChemicalsStockList.js';

import AddEquipment from './components/staff/equipmentCrud/AddEquipment.js';
import EditEquipment from './components/staff/equipmentCrud/EditEquipment.js';
import EquipmentList from './components/staff/equipmentCrud/EquipmentList.js';

import AddEquipmentCategory from './components/staff/equipmentCategory/AddEquipmentCategory.js';
import EditEquipmentCategory from './components/staff/equipmentCategory/EditEquipmentCategory.js';
import EquipmentCategoryList from './components/staff/equipmentCategory/EquipmentCategoryList.js';

import TeacherLogin from './components/teacher/teacherLogin/TeacherLogin.js';
import TeacherRegister from './components/teacher/teacherLogin/TeacherRegister.js';
import TeacherForgetPassword from './components/teacher/teacherLogin/TeacherForgetPassword.js';
import TeacherDashboard from './components/teacher/TeacherDashboard.js';
import TeacherProfile from './components/teacher/teacherLogin/TeacherProfile';

import AddTeacher from './components/admin/teacherCrud/AddTeacher.js';
import EditTeacher from './components/admin/teacherCrud/EditTeacher.js';
import TeacherList from './components/admin/teacherCrud/TeacherList.js';

import StudentLogin from './components/student/studentLogin/StudentLogin.js';
import StudentRegister from './components/student/studentLogin/StudentRegister.js';
import StudentForgetPassword from './components/student/studentLogin/StudentForgetPassword.js';
import StudentDashboard from './components/student/StudentDashboard.js';
import StudentProfile from './components/student/studentLogin/StudentProfile';

import StudentChemicalsRequest from './components/student/studentChemReq/StudentChemicalsRequest.js';
import StudentChemicalsList from './components/student/studentChemReq/StudentChemicalsList.js';
import StudentChemicalsCart from './components/student/studentChemReq/StudentChemicalsCart.js';

import StudentEquipmentCart from './components/student/studentChemReq/StudentEquipmentCart.js';
import StudentEquipmentRequest from './components/student/studentChemReq/StudentEquipmentRequest.js';

import TeacherChemicalsRequest from './components/teacher/teacherManageReq/TeacherChemicalsRequest.js';

import StaffChemicalsRequest from './components/staff/staffConfirmReq/StaffChemicalsRequest.js';
import StaffChemicalsRequestList from './components/staff/staffConfirmReq/StaffChemicalsRequestList.js';
import StaffEquipmentRequest from './components/staff/staffConfirmReq/StaffEquipmentRequest.js';
import StaffEquipmentRequestList from './components/staff/staffConfirmReq/StaffEquipmentRequestList.js';

import LogActivityList from './components/admin/logActivity/LogActivityList.js';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/> } />
        <Route path="/admin-login" element={<AdminLogin/> } />
        <Route path="/admin-register" element={<AdminRegister/> } />
        <Route path="/admin-forget-password" element={<AdminForgetPassword/> } />
        <Route path="/admin-dashboard" element={<AdminDashboard/> } />
        <Route path="/admin-profile" element={<AdminProfile/> } />

        <Route path="/staff-login" element={<StaffLogin/> } />
        <Route path="/staff-register" element={<StaffRegister/> } />
        <Route path="/staff-forget-password" element={<StaffForgetPassword/> } />
        <Route path="/staff-dashboard" element={<StaffDashboard/> } />
        <Route path="/staff-profile" element={<StaffProfile/> } />

        <Route path="/staff-list" element={<StaffList/> } />
        <Route path="/staff-list/add-staff" element={<AddStaff/> } />
        <Route path="/staff-list/edit-staff/:id" element={<EditStaff/> } />

        <Route path="/chemicals-list" element={<ChemicalsList/> } />
        <Route path="/chemicals-list/add-chemicals" element={<AddChemicals/> } />
        <Route path="/chemicals-list/edit-chemicals/:id" element={<EditChemicals/> } />

        <Route path="/chemicals-stock" element={<ChemicalsStockList/> } />

        <Route path="/chemicalsDetail-list" element={<ChemicalsDetailList/> } />
        <Route path="/chemicalsDetail-list/add-chemicalsDetail" element={<AddChemicalsDetail/> } />
        <Route path="/chemicalsDetail-list/edit-chemicalsDetail/:id" element={<EditChemicalsDetail/> } />

        <Route path="/equipment-list" element={<EquipmentList/> } />
        <Route path="/equipment-list/add-equipment" element={<AddEquipment/> } />
        <Route path="/equipment-list/edit-equipment/:id" element={<EditEquipment/> } />

        <Route path="/equipmentCategory-list" element={<EquipmentCategoryList/> } />
        <Route path="/equipmentCategory-list/add-equipmentCategory" element={<AddEquipmentCategory/> } />
        <Route path="/equipmentCategory-list/edit-equipmentCategory/:id" element={<EditEquipmentCategory/> } />

        <Route path="/teacher-login" element={<TeacherLogin/> } />
        <Route path="/teacher-register" element={<TeacherRegister/> } />
        <Route path="/teacher-forget-password" element={<TeacherForgetPassword/> } />
        <Route path="/teacher-dashboard" element={<TeacherDashboard/> } />
        <Route path="/teacher-profile" element={<TeacherProfile/> } />

        <Route path="/teacher-list" element={<TeacherList/> } />
        <Route path="/teacher-list/add-teacher" element={<AddTeacher/> } />
        <Route path="/teacher-list/edit-teacher/:id" element={<EditTeacher/> } />

        <Route path="/student-login" element={<StudentLogin/> } />
        <Route path="/student-register" element={<StudentRegister/> } />
        <Route path="/student-forget-password" element={<StudentForgetPassword/> } />
        <Route path="/student-dashboard" element={<StudentDashboard/> } />
        <Route path="/student-profile" element={<StudentProfile/> } />

        <Route path="/student-dashboard/student-chemicals-request" element={<StudentChemicalsRequest/> } />
        <Route path="/student-dashboard/student-chemicals-list" element={<StudentChemicalsList/> } />

        <Route path="/student-dashboard/student-equipment-request" element={<StudentEquipmentRequest/> } />

        <Route path="/teacher-dashboard/teacher-chemicals-request/:id" element={<TeacherChemicalsRequest/> } />
        <Route path="/staff-dashboard/staff-chemicals-request/:id" element={<StaffChemicalsRequest/> } />
        <Route path="/staff-dashboard/staff-chemicals-request-list" element={<StaffChemicalsRequestList/> } />
        <Route path="/staff-dashboard/staff-equipment-request/:id" element={<StaffEquipmentRequest/> } />
        <Route path="/staff-dashboard/staff-equipment-request-list" element={<StaffEquipmentRequestList/> } />

        <Route path="/student-dashboard/student-chemicals-cart" element={<StudentChemicalsCart/> } />
        <Route path="/student-dashboard/student-equipment-cart" element={<StudentEquipmentCart/> } />

        <Route path="/log-activity" element={<LogActivityList/> } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;