import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home.js';

//------------------------------------------------------------ Admin ------------------------------------------------------------//
import AdminLogin from './components/admin/adminLogin/AdminLogin.js';
import AdminRegister from './components/admin/adminLogin/AdminRegister.js';
import AdminForgetPassword from './components/admin/adminLogin/AdminForgetPassword.js';
import AdminDashboard from './components/admin/AdminDashboard.js';
import AdminProfile from './components/admin/adminLogin/AdminProfile';

import AddStaff from './components/admin/staffCrud/AddStaff.js';
import EditStaff from './components/admin/staffCrud/EditStaff.js';
import StaffList from './components/admin/staffCrud/StaffList.js';

import AddTeacher from './components/admin/teacherCrud/AddTeacher.js';
import EditTeacher from './components/admin/teacherCrud/EditTeacher.js';
import TeacherList from './components/admin/teacherCrud/TeacherList.js';

import LogActivity from './components/admin/logActivity/logActivity.js';

//------------------------------------------------------------ Staff ------------------------------------------------------------//
import StaffLogin from './components/staff/staffLogin/StaffLogin.js';
import StaffRegister from './components/staff/staffLogin/StaffRegister.js';
import StaffForgetPassword from './components/staff/staffLogin/StaffForgetPassword.js';
import StaffDashboard from './components/staff/StaffDashboard.js';
import StaffProfile from './components/staff/staffLogin/StaffProfile';

import AddChemicals from './components/staff/chemicalsCrud/AddChemicals.js';
import EditChemicals from './components/staff/chemicalsCrud/EditChemicals.js';
import ChemicalsList from './components/staff/chemicalsCrud/ChemicalsList.js';

import AddChemicalsDetail from './components/staff/chemicalsDetailCrud/AddChemicalsDetail.js';
import EditChemicalsDetail from './components/staff/chemicalsDetailCrud/EditChemicalsDetail.js';
import ChemicalsDetailList from './components/staff/chemicalsDetailCrud/ChemicalsDetailList.js';

import ChemicalsStockList from './components/staff/chemicalsStock/ChemicalsStockList.js';
import ChemicalsStockById from './components/staff/chemicalsStock/ChemicalsStockById.js';

import AddEquipment from './components/staff/equipmentCrud/AddEquipment.js';
import EditEquipment from './components/staff/equipmentCrud/EditEquipment.js';
import EquipmentList from './components/staff/equipmentCrud/EquipmentList.js';

import AddEquipmentCategory from './components/staff/equipmentCategory/AddEquipmentCategory.js';
import EditEquipmentCategory from './components/staff/equipmentCategory/EditEquipmentCategory.js';
import EquipmentCategoryList from './components/staff/equipmentCategory/EquipmentCategoryList.js';

import StaffChemicalsRequest from './components/staff/staffConfirmReq/StaffChemicalsRequest.js';
import StaffChemicalsRequestList from './components/staff/staffConfirmReq/StaffChemicalsRequestList.js';

import StaffEquipmentRequest from './components/staff/staffConfirmReq/StaffEquipmentRequest.js';
import StaffEquipmentRequestList from './components/staff/staffConfirmReq/StaffEquipmentRequestList.js';

//------------------------------------------------------------ Teacher ------------------------------------------------------------//
import TeacherLogin from './components/teacher/teacherLogin/TeacherLogin.js';
import TeacherRegister from './components/teacher/teacherLogin/TeacherRegister.js';
import TeacherForgetPassword from './components/teacher/teacherLogin/TeacherForgetPassword.js';
import TeacherDashboard from './components/teacher/TeacherDashboard.js';
import TeacherProfile from './components/teacher/teacherLogin/TeacherProfile';

import TeacherChemicalsRequest from './components/teacher/teacherManageReq/TeacherChemicalsRequest.js';
import TeacherEquipmentRequest from './components/teacher/teacherManageReq/TeacherEquipmentRequest.js';

import TeacherBundleCart from './components/teacher/teacherCreateBundle/TeacherBundleCart.js';

import BundleList from './components/teacher/teacherCreateBundle/BundleList.js';
import BundleView from './components/teacher/teacherCreateBundle/BundleView.js';

//------------------------------------------------------------ Student ------------------------------------------------------------//
import StudentLogin from './components/student/studentLogin/StudentLogin.js';
import StudentRegister from './components/student/studentLogin/StudentRegister.js';
import StudentForgetPassword from './components/student/studentLogin/StudentForgetPassword.js';
import StudentDashboard from './components/student/StudentDashboard.js';
import StudentProfile from './components/student/studentLogin/StudentProfile';

import StudentChemicalsList from './components/student/studentChemReq/StudentChemicalsList.js';
import StudentChemicalsCart from './components/student/studentChemReq/StudentChemicalsCart.js';
import StudentChemicalsRequest from './components/student/studentChemReq/StudentChemicalsRequest.js';

import StudentEquipmentList from './components/student/studentEquipmentReq/StudentEquipmentList.js';
import StudentEquipmentCart from './components/student/studentEquipmentReq/StudentEquipmentCart.js';
import StudentEquipmentRequest from './components/student/studentEquipmentReq/StudentEquipmentRequest.js';

import StudentBundleRequest from './components/student/studentBundleReq/StudentBundleRequest.js';
import StudentBundleList from './components/student/studentBundleReq/StudentBundleList.js';

import StudentGoogleRegister from './components/student/studentGoogleLogin/StudentGoogleRegister.js';

function App() {
  const [adminLoggedIn, setAdminLoggedIn] = useState(
    localStorage.getItem('adminIsLoggedIn') === 'true'
  );
  const [staffLoggedIn, setStaffLoggedIn] = useState(
    localStorage.getItem('staffIsLoggedIn') === 'true'
  );
  const [teacherLoggedIn, setTeacherLoggedIn] = useState(
    localStorage.getItem('teacherIsLoggedIn') === 'true'
  );

  const handleAdminLogIn = () => {
    setAdminLoggedIn(true);
    localStorage.setItem('adminIsLoggedIn', 'true');
  };

  const handleAdminLogOut = () => {
    setAdminLoggedIn(false);
    localStorage.removeItem('adminIsLoggedIn');
  };

  const handleStaffLogIn = () => {
    setStaffLoggedIn(true);
    localStorage.setItem('staffIsLoggedIn', 'true');
  }

  const handleStaffLogOut = () => {
    setStaffLoggedIn(false);
    localStorage.removeItem('staffIsLoggedIn');
  }

  const handleTeacherLogIn = () => {
    setTeacherLoggedIn(true);
    localStorage.setItem('teacherIsLoggedIn', 'true');
  }

  const handleTeacherLogOut = () => {
    setTeacherLoggedIn(false);
    localStorage.removeItem('teacherIsLoggedIn');
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* -------------------------------------------------------- Admin -------------------------------------------------------- */}
        <Route path="/admin-login" element={adminLoggedIn ? <Navigate to="admin-dashboard" /> : <AdminLogin login={handleAdminLogIn} />} />
        <Route path="/admin-register" element={<AdminRegister />} />
        <Route path="/admin-forget-password" element={<AdminForgetPassword />} />
        <Route path="/admin-dashboard" element={adminLoggedIn ? <AdminDashboard logout={handleAdminLogOut} /> : <Navigate to="/" />} />
        <Route path="/admin-profile" element={adminLoggedIn ? <AdminProfile logout={handleAdminLogOut} /> : <Navigate to="/admin-login" />} />

        <Route path="/log-activity" element={adminLoggedIn ? <LogActivity /> : <Navigate to="/" />} />

        <Route path="/staff-list" element={adminLoggedIn ? <StaffList /> : <Navigate to="/" />} />
        <Route path="/staff-list/add-staff" element={adminLoggedIn ? <AddStaff /> : <Navigate to="/" />} />
        <Route path="/staff-list/edit-staff/:id" element={adminLoggedIn ? <EditStaff /> : <Navigate to="/" />} />

        <Route path="/teacher-list" element={adminLoggedIn ? <TeacherList /> : <Navigate to="/" />} />
        <Route path="/teacher-list/add-teacher" element={adminLoggedIn ? <AddTeacher /> : <Navigate to="/" />} />
        <Route path="/teacher-list/edit-teacher/:id" element={adminLoggedIn ? <EditTeacher /> : <Navigate to="/" />} />

        {/* -------------------------------------------------------- Staff -------------------------------------------------------- */}
        <Route path="/staff-login" element={staffLoggedIn ? <Navigate to="/staff-dashboard" /> : <StaffLogin login={handleStaffLogIn} />} />
        <Route path="/staff-register" element={<StaffRegister />} />
        <Route path="/staff-forget-password" element={<StaffForgetPassword />} />
        <Route path="/staff-dashboard" element={staffLoggedIn ? <StaffDashboard logout={handleStaffLogOut} /> : <Navigate to="/" />} />
        <Route path="/staff-profile" element={staffLoggedIn ? <StaffProfile logout={handleStaffLogOut} /> : <Navigate to="/staff-login" />} />

        <Route path="/staff-dashboard/staff-chemicals-request/:id" element={staffLoggedIn ? <StaffChemicalsRequest /> : <Navigate to="/" />} />
        <Route path="/staff-dashboard/staff-chemicals-request-list" element={staffLoggedIn ? <StaffChemicalsRequestList /> : <Navigate to="/" />} />
        <Route path="/staff-dashboard/staff-equipment-request/:id" element={staffLoggedIn ? <StaffEquipmentRequest /> : <Navigate to="/" />} />
        <Route path="/staff-dashboard/staff-equipment-request-list" element={staffLoggedIn ? <StaffEquipmentRequestList /> : <Navigate to="/" />} />

        <Route path="/chemicals-list" element={staffLoggedIn ? <ChemicalsList /> : <Navigate to="/" />} />
        <Route path="/chemicals-list/add-chemicals" element={staffLoggedIn ? <AddChemicals /> : <Navigate to="/" />} />
        <Route path="/chemicals-list/edit-chemicals/:id" element={staffLoggedIn ? <EditChemicals /> : <Navigate to="/" />} />

        <Route path="/chemicals-stock" element={staffLoggedIn ? <ChemicalsStockList /> : <Navigate to="/" />} />
        <Route path="/chemicals-stock/:id" element={staffLoggedIn ? <ChemicalsStockById /> : <Navigate to="/" />} />

        <Route path="/chemicalsDetail-list" element={staffLoggedIn ? <ChemicalsDetailList /> : <Navigate to="/" />} />
        <Route path="/chemicalsDetail-list/add-chemicalsDetail" element={staffLoggedIn ? <AddChemicalsDetail /> : <Navigate to="/" />} />
        <Route path="/chemicalsDetail-list/edit-chemicalsDetail/:id" element={staffLoggedIn ? <EditChemicalsDetail /> : <Navigate to="/" />} />

        <Route path="/equipment-list" element={staffLoggedIn ? <EquipmentList /> : <Navigate to="/" />} />
        <Route path="/equipment-list/add-equipment" element={staffLoggedIn ? <AddEquipment /> : <Navigate to="/" />} />
        <Route path="/equipment-list/edit-equipment/:id" element={staffLoggedIn ? <EditEquipment /> : <Navigate to="/" />} />

        <Route path="/equipmentCategory-list" element={staffLoggedIn ? <EquipmentCategoryList /> : <Navigate to="/" />} />
        <Route path="/equipmentCategory-list/add-equipmentCategory" element={staffLoggedIn ? <AddEquipmentCategory /> : <Navigate to="/" />} />
        <Route path="/equipmentCategory-list/edit-equipmentCategory/:id" element={staffLoggedIn ? <EditEquipmentCategory /> : <Navigate to="/" />} />

        {/* -------------------------------------------------------- Teacher -------------------------------------------------------- */}
        <Route path="/teacher-login" element={teacherLoggedIn ? <Navigate to="teacher-dashboard" /> : <TeacherLogin login={handleTeacherLogIn} />} />
        <Route path="/teacher-register" element={<TeacherRegister />} />
        <Route path="/teacher-forget-password" element={<TeacherForgetPassword />} />
        <Route path="/teacher-dashboard" element={teacherLoggedIn ? <TeacherDashboard logout={handleTeacherLogOut} /> : <Navigate to="/" />} />
        <Route path="/teacher-profile" element={teacherLoggedIn ? <TeacherProfile logout={handleTeacherLogOut} /> : <Navigate to="/teacher-login" />} />

        <Route path="/teacher-dashboard/teacher-chemicals-request" element={teacherLoggedIn ? <TeacherChemicalsRequest /> : <Navigate to="/" />} />
        <Route path="/teacher-dashboard/teacher-equipment-request" element={teacherLoggedIn ? <TeacherEquipmentRequest /> : <Navigate to="/" />} />

        <Route path="/teacher-dashboard/bundle-list" element={teacherLoggedIn ? <BundleList /> : <Navigate to="/" />} />
        <Route path="/teacher-dashboard/bundle-list/:id" element={teacherLoggedIn ? <BundleView /> : <Navigate to="/" />} />
        <Route path="/teacher-dashboard/teacher-create-bundle" element={teacherLoggedIn ? <TeacherBundleCart /> : <Navigate to="/" />} />

        {/* -------------------------------------------------------- Student -------------------------------------------------------- */}
        <Route path="/student-login" element={<StudentLogin />} />
        <Route path="/student-register" element={<StudentRegister />} />
        <Route path="/student-forget-password" element={<StudentForgetPassword />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/student-profile" element={<StudentProfile />} />

        <Route path="/student-dashboard/student-chemicals-request" element={<StudentChemicalsRequest />} />
        <Route path="/student-dashboard/student-chemicals-list" element={<StudentChemicalsList />} />

        <Route path="/student-dashboard/student-equipment-request" element={<StudentEquipmentRequest />} />
        <Route path="/student-dashboard/student-equipment-list" element={<StudentEquipmentList />} />

        <Route path="/student-dashboard/student-chemicals-cart" element={<StudentChemicalsCart />} />
        <Route path="/student-dashboard/student-equipment-cart" element={<StudentEquipmentCart />} />

        <Route path="/student-dashboard/bundle-list" element={<StudentBundleList />} />
        <Route path="/student-dashboard/bundle-list/:id" element={<StudentBundleRequest />} />

        <Route path="/student-google-register" element={<StudentGoogleRegister />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;