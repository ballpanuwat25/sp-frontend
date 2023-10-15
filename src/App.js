import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/home/Home.js';
import Notfound from './components/Notfound.js';

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
import StaffEditProfile from './components/staff/staffLogin/StaffEditProfile.js';

import StaffNewPassword from './components/staff/staffLogin/StaffNewPassword.js';

import AddChemicals from './components/staff/chemicalsCrud/AddChemicals.js';
import EditChemicals from './components/staff/chemicalsCrud/EditChemicals.js';
import ChemicalsList from './components/staff/chemicalsCrud/ChemicalsList.js';

import AddChemicalsDetail from './components/staff/chemicalsDetailCrud/AddChemicalsDetail.js';
import EditChemicalsDetail from './components/staff/chemicalsDetailCrud/EditChemicalsDetail.js';
import ChemicalsDetailList from './components/staff/chemicalsDetailCrud/ChemicalsDetailList.js';

import ChemicalsStockFilter from './components/staff/chemicalsStock/ChemicalsStockFilter.js';
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

import BarcodeChemicals from './components/staff/chemicalsCrud/BarcodeChemicals.js';
import BarcodeEquipment from './components/staff/equipmentCrud/BarcodeEquipment.js';

import ReportChemicals from './components/staff/chemicalsCrud/ReportChemicals.js';
import ReportEquipment from './components/staff/equipmentCrud/ReportEquipment.js';

//------------------------------------------------------------ Teacher ------------------------------------------------------------//
import TeacherLogin from './components/teacher/teacherLogin/TeacherLogin.js';
import TeacherRegister from './components/teacher/teacherLogin/TeacherRegister.js';
import TeacherForgetPassword from './components/teacher/teacherLogin/TeacherForgetPassword.js';
import TeacherDashboard from './components/teacher/TeacherDashboard.js';
import TeacherProfile from './components/teacher/teacherLogin/TeacherProfile';
import TeacherEditProfile from './components/teacher/teacherLogin/TeacherEditProfile.js';

import TeacherNewPassword from './components/teacher/teacherLogin/TeacherNewPassword.js';

import TeacherChemicalsRequest from './components/teacher/teacherManageReq/TeacherChemicalsRequest.js';
import TeacherEquipmentRequest from './components/teacher/teacherManageReq/TeacherEquipmentRequest.js';

import TeacherBundleCart from './components/teacher/teacherCreateBundle/TeacherBundleCart.js';

import BundleList from './components/teacher/teacherCreateBundle/BundleList.js';
import BundleView from './components/teacher/teacherCreateBundle/BundleView.js';

import ChemicalsBundleList from './components/teacher/teacherCreateBundle/ChemicalsBundleList.js';
import EquipmentBundleList from './components/teacher/teacherCreateBundle/EquipmentBundleList.js';

//------------------------------------------------------------ Student ------------------------------------------------------------//
import StudentLogin from './components/student/studentLogin/StudentLogin.js';
import StudentRegister from './components/student/studentLogin/StudentRegister.js';
import StudentForgetPassword from './components/student/studentLogin/StudentForgetPassword.js';
import StudentDashboard from './components/student/StudentDashboard.js';
import StudentProfile from './components/student/studentLogin/StudentProfile';

import StudentChemicalsList from './components/student/studentReq/studentChemReq/StudentChemicalsList.js';
import StudentChemicalsCart from './components/student/studentReq/studentChemReq/StudentChemicalsCart.js';
import StudentChemicalsRequest from './components/student/studentReq/studentChemReq/StudentChemicalsRequest.js';

import StudentEquipmentList from './components/student/studentReq/studentEquipmentReq/StudentEquipmentList.js';
import StudentEquipmentCart from './components/student/studentReq/studentEquipmentReq/StudentEquipmentCart.js';
import StudentEquipmentRequest from './components/student/studentReq/studentEquipmentReq/StudentEquipmentRequest.js';

import StudentBundleRequest from './components/student/studentBundleReq/StudentBundleRequest.js';
import StudentBundleList from './components/student/studentBundleReq/StudentBundleList.js';

import StudentGoogleRegister from './components/student/studentGoogleLogin/StudentGoogleRegister.js';

import StudentViewTeacher from './components/student/studentViewTeacher/StudentViewTeacher.js';

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
        <Route path="*" element={<Notfound />} />
        {/* -------------------------------------------------------- Admin -------------------------------------------------------- */}
        <Route path="/admin-login" element={adminLoggedIn ? <Navigate to="admin-dashboard" /> : <AdminLogin login={handleAdminLogIn} />} />
        <Route path="/admin-register" element={<AdminRegister />} />
        <Route path="/admin-forget-password" element={<AdminForgetPassword />} />
        <Route path="/admin-dashboard" element={adminLoggedIn ? <AdminDashboard logout={handleAdminLogOut} /> : <Navigate to="/" />} />
        <Route path="/admin-profile" element={adminLoggedIn ? <AdminProfile logout={handleAdminLogOut} /> : <Navigate to="/admin-login" />} />

        <Route path="/log-activity" element={adminLoggedIn ? <LogActivity logout={handleAdminLogOut} /> : <Navigate to="/" />} />

        <Route path="/staff-list" element={adminLoggedIn ? <StaffList logout={handleAdminLogOut} /> : <Navigate to="/" />} />
        <Route path="/staff-list/add-staff" element={adminLoggedIn ? <AddStaff logout={handleAdminLogOut} /> : <Navigate to="/" />} />
        <Route path="/staff-list/edit-staff/:id" element={adminLoggedIn ? <EditStaff logout={handleAdminLogOut} /> : <Navigate to="/" />} />

        <Route path="/teacher-list" element={adminLoggedIn ? <TeacherList logout={handleAdminLogOut} /> : <Navigate to="/" />} />
        <Route path="/teacher-list/add-teacher" element={adminLoggedIn ? <AddTeacher logout={handleAdminLogOut} /> : <Navigate to="/" />} />
        <Route path="/teacher-list/edit-teacher/:id" element={adminLoggedIn ? <EditTeacher logout={handleAdminLogOut} /> : <Navigate to="/" />} />

        {/* -------------------------------------------------------- Staff -------------------------------------------------------- */}
        <Route path="/staff-login" element={staffLoggedIn ? <Navigate to="/staff-dashboard" /> : <StaffLogin login={handleStaffLogIn} />} />
        <Route path="/staff-register" element={<StaffRegister />} />
        <Route path="/staff-forget-password" element={<StaffForgetPassword />} />
        <Route path="/staff-dashboard" element={staffLoggedIn ? <StaffChemicalsRequestList logout={handleStaffLogOut} /> : <Navigate to="/" />} />
        <Route path="/staff-profile" element={staffLoggedIn ? <StaffProfile logout={handleStaffLogOut} /> : <Navigate to="/staff-login" />} />
        <Route path="/staff-profile/:id" element={staffLoggedIn ? <StaffEditProfile logout={handleStaffLogOut} /> : <Navigate to="/staff-login" />} />

        <Route path="/staff-reset-password/:resetToken" element={<StaffNewPassword />} />

        <Route path="/staff-dashboard/staff-chemicals-request/:id" element={staffLoggedIn ? <StaffChemicalsRequest logout={handleStaffLogOut} /> : <Navigate to="/" />} />
        <Route path="/staff-dashboard/staff-chemicals-request-list" element={staffLoggedIn ? <StaffChemicalsRequestList logout={handleStaffLogOut} /> : <Navigate to="/" />} />
        <Route path="/staff-dashboard/staff-equipment-request/:id" element={staffLoggedIn ? <StaffEquipmentRequest logout={handleStaffLogOut} /> : <Navigate to="/" />} />
        <Route path="/staff-dashboard/staff-equipment-request-list" element={staffLoggedIn ? <StaffEquipmentRequestList logout={handleStaffLogOut} /> : <Navigate to="/" />} />

        <Route path="/chemicals-list" element={staffLoggedIn ? <ChemicalsList logout={handleStaffLogOut} /> : <Navigate to="/" />} />
        <Route path="/chemicals-list/add-chemicals" element={staffLoggedIn ? <AddChemicals logout={handleStaffLogOut} /> : <Navigate to="/" />} />
        <Route path="/chemicals-list/edit-chemicals/:id" element={staffLoggedIn ? <EditChemicals logout={handleStaffLogOut} /> : <Navigate to="/" />} />

        <Route path="/chemicalsStock-filter" element={staffLoggedIn ? <ChemicalsStockFilter logout={handleStaffLogOut} /> : <Navigate to="/" />} />
        <Route path="/chemicals-stock" element={staffLoggedIn ? <ChemicalsStockList logout={handleStaffLogOut} /> : <Navigate to="/" />} />
        <Route path="/chemicals-stock/:id" element={staffLoggedIn ? <ChemicalsStockById logout={handleStaffLogOut} /> : <Navigate to="/" />} />

        <Route path="/chemicalsDetail-list" element={staffLoggedIn ? <ChemicalsDetailList logout={handleStaffLogOut} /> : <Navigate to="/" />} />
        <Route path="/chemicalsDetail-list/add-chemicalsDetail" element={staffLoggedIn ? <AddChemicalsDetail logout={handleStaffLogOut} /> : <Navigate to="/" />} />
        <Route path="/chemicalsDetail-list/edit-chemicalsDetail/:id" element={staffLoggedIn ? <EditChemicalsDetail logout={handleStaffLogOut} /> : <Navigate to="/" />} />

        <Route path="/barcode-chemicals" element={staffLoggedIn ? <BarcodeChemicals logout={handleStaffLogOut} /> : <Navigate to="/" />} />
        <Route path="/barcode-equipment" element={staffLoggedIn ? <BarcodeEquipment logout={handleStaffLogOut} /> : <Navigate to="/" />} />

        <Route path="/equipment-list" element={staffLoggedIn ? <EquipmentList logout={handleStaffLogOut} /> : <Navigate to="/" />} />
        <Route path="/equipment-list/add-equipment" element={staffLoggedIn ? <AddEquipment logout={handleStaffLogOut} /> : <Navigate to="/" />} />
        <Route path="/equipment-list/edit-equipment/:id" element={staffLoggedIn ? <EditEquipment logout={handleStaffLogOut} /> : <Navigate to="/" />} />

        <Route path="/equipmentCategory-list" element={staffLoggedIn ? <EquipmentCategoryList logout={handleStaffLogOut} /> : <Navigate to="/" />} />
        <Route path="/equipmentCategory-list/add-equipmentCategory" element={staffLoggedIn ? <AddEquipmentCategory logout={handleStaffLogOut} /> : <Navigate to="/" />} />
        <Route path="/equipmentCategory-list/edit-equipmentCategory/:id" element={staffLoggedIn ? <EditEquipmentCategory logout={handleStaffLogOut} /> : <Navigate to="/" />} />

        <Route path="/report-chemicals" element={staffLoggedIn ? <ReportChemicals logout={handleStaffLogOut} /> : <Navigate to="/" />} />
        <Route path="/report-equipment" element={staffLoggedIn ? <ReportEquipment logout={handleStaffLogOut} /> : <Navigate to="/" />} />

        {/* -------------------------------------------------------- Teacher -------------------------------------------------------- */}
        <Route path="/teacher-login" element={teacherLoggedIn ? <Navigate to="teacher-dashboard" /> : <TeacherLogin login={handleTeacherLogIn} />} />
        <Route path="/teacher-register" element={<TeacherRegister />} />
        <Route path="/teacher-forget-password" element={<TeacherForgetPassword />} />
        <Route path="/teacher-dashboard" element={teacherLoggedIn ? <TeacherChemicalsRequest logout={handleTeacherLogOut} /> : <Navigate to="/" />} />
        <Route path="/teacher-profile" element={teacherLoggedIn ? <TeacherProfile logout={handleTeacherLogOut} /> : <Navigate to="/teacher-login" />} />
        <Route path="/teacher-profile/:id" element={teacherLoggedIn ? <TeacherEditProfile logout={handleTeacherLogOut} /> : <Navigate to="/teacher-login" />} />

        <Route path="/teacher-reset-password/:resetToken" element={<TeacherNewPassword />} />

        <Route path="/teacher-dashboard/teacher-chemicals-request" element={teacherLoggedIn ? <TeacherChemicalsRequest logout={handleTeacherLogOut} /> : <Navigate to="/" />} />
        <Route path="/teacher-dashboard/teacher-equipment-request" element={teacherLoggedIn ? <TeacherEquipmentRequest logout={handleTeacherLogOut} /> : <Navigate to="/" />} />

        <Route path="/teacher-dashboard/bundle-list" element={teacherLoggedIn ? <BundleList logout={handleTeacherLogOut} /> : <Navigate to="/" />} />
        <Route path="/teacher-dashboard/bundle-list/:id" element={teacherLoggedIn ? <BundleView logout={handleTeacherLogOut} /> : <Navigate to="/" />} />
        <Route path="/teacher-dashboard/teacher-create-bundle" element={teacherLoggedIn ? <TeacherBundleCart logout={handleTeacherLogOut} /> : <Navigate to="/" />} />

        <Route path="teacher-dashboard/chemicals-bundle-list" element={teacherLoggedIn ? <ChemicalsBundleList logout={handleTeacherLogOut} /> : <Navigate to="/" /> } />
        <Route path="teacher-dashboard/equipment-bundle-list" element={teacherLoggedIn ? <EquipmentBundleList logout={handleTeacherLogOut} /> : <Navigate to="/" /> } />

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

        <Route path="/student-dashboard/student-view-teacher" element={<StudentViewTeacher />} />

        <Route path="/student-google-register" element={<StudentGoogleRegister />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;