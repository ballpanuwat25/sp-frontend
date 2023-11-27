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
import AdminEditProfile from './components/admin/adminLogin/AdminEditProfile.js';
import AdminNewPassword from './components/admin/adminLogin/AdminNewPassword.js';

import AddAdmin from './components/admin/adminCrud/AddAdmin.js';
import EditAdmin from './components/admin/adminCrud/EditAdmin.js';
import AdminList from './components/admin/adminCrud/AdminList.js';

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
import StaffChemicalsReceipt from './components/staff/staffConfirmReq/StaffChemicalsReceipt.js';
import StaffChemicalsRequestList from './components/staff/staffConfirmReq/StaffChemicalsRequestList.js';

import StaffEquipmentRequest from './components/staff/staffConfirmReq/StaffEquipmentRequest.js';
import StaffEquipmentReceipt from './components/staff/staffConfirmReq/StaffEquipmentReceipt.js';
import StaffEquipmentRequestList from './components/staff/staffConfirmReq/StaffEquipmentRequestList.js';

import BarcodeChemicals from './components/staff/chemicalsCrud/BarcodeChemicals.js';
import BarcodeEquipment from './components/staff/equipmentCrud/BarcodeEquipment.js';

import ReportChemicals from './components/staff/chemicalsCrud/ReportChemicals.js';
import ReportEquipment from './components/staff/equipmentCrud/ReportEquipment.js';

import AStudentList from './components/staff/approveStudents/AStudentList.js';
import CurrentStudentList from './components/staff/approveStudents/CurrentStudentList.js';

import ReportRequest from './components/staff/staffConfirmReq/StaffReportRequest.js'

//------------------------------------------------------------ Teacher ------------------------------------------------------------//
import TeacherLogin from './components/teacher/teacherLogin/TeacherLogin.js';
import TeacherRegister from './components/teacher/teacherLogin/TeacherRegister.js';
import TeacherForgetPassword from './components/teacher/teacherLogin/TeacherForgetPassword.js';
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

import StudentNewPassword from './components/student/studentLogin/StudentNewPassword.js';
import StudentEditProfile from './components/student/studentLogin/StudentEditProfile.js';

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
    <BrowserRouter basename="/chem">
      <Routes>
        <Route path="/chem" element={<Home />} />
        <Route path="/chem/*" element={<Notfound />} />
        {/* -------------------------------------------------------- Admin -------------------------------------------------------- */}
        <Route path="/chem/admin-login" element={adminLoggedIn ? <Navigate to="/chem/admin-dashboard" /> : <AdminLogin login={handleAdminLogIn} />} />
        <Route path="/chem/admin-forget-password" element={<AdminForgetPassword />} />
        <Route path="/chem/admin-dashboard" element={adminLoggedIn ? <AdminDashboard logout={handleAdminLogOut} /> : <Navigate to="/chem" />} />
        <Route path="/chem/admin-profile" element={adminLoggedIn ? <AdminProfile logout={handleAdminLogOut} /> : <Navigate to="/admin-login" />} />
        <Route path="/chem/admin-profile/:id" element={adminLoggedIn ? <AdminEditProfile logout={handleAdminLogOut} /> : <Navigate to="/admin-login" />} />

        <Route path="/chem/admin-reset-password/:resetToken" element={<AdminNewPassword />} />

        <Route path="/chem/log-activity" element={adminLoggedIn ? <LogActivity logout={handleAdminLogOut} /> : <Navigate to="/chem" />} />

        <Route path="/chem/admin-list" element={adminLoggedIn ? <AdminList logout={handleAdminLogOut} /> : <Navigate to="/chem" />} />
        <Route path="/chem/admin-list/add-admin" element={adminLoggedIn ? <AddAdmin logout={handleAdminLogOut} /> : <Navigate to="/chem" />} />
        <Route path="/chem/admin-list/edit-admin/:id" element={adminLoggedIn ? <EditAdmin logout={handleAdminLogOut} /> : <Navigate to="/chem" />} />

        <Route path="/chem/staff-list" element={adminLoggedIn ? <StaffList logout={handleAdminLogOut} /> : <Navigate to="/chem" />} />
        <Route path="/chem/staff-list/add-staff" element={adminLoggedIn ? <AddStaff logout={handleAdminLogOut} /> : <Navigate to="/chem" />} />
        <Route path="/chem/staff-list/edit-staff/:id" element={adminLoggedIn ? <EditStaff logout={handleAdminLogOut} /> : <Navigate to="/chem" />} />

        <Route path="/chem/teacher-list" element={adminLoggedIn ? <TeacherList logout={handleAdminLogOut} /> : <Navigate to="/chem" />} />
        <Route path="/chem/teacher-list/add-teacher" element={adminLoggedIn ? <AddTeacher logout={handleAdminLogOut} /> : <Navigate to="/chem" />} />
        <Route path="/chem/teacher-list/edit-teacher/:id" element={adminLoggedIn ? <EditTeacher logout={handleAdminLogOut} /> : <Navigate to="/chem" />} />

        {/* -------------------------------------------------------- Staff -------------------------------------------------------- */}
        <Route path="/chem/staff-login" element={staffLoggedIn ? <Navigate to="/chem/staff-dashboard" /> : <StaffLogin login={handleStaffLogIn} />} />
        <Route path="/chem/staff-forget-password" element={<StaffForgetPassword />} />
        <Route path="/chem/staff-dashboard" element={staffLoggedIn ? <StaffChemicalsRequestList logout={handleStaffLogOut} /> : <Navigate to="/chem" />} />
        <Route path="/chem/staff-profile" element={staffLoggedIn ? <StaffProfile logout={handleStaffLogOut} /> : <Navigate to="/chem/staff-login" />} />
        <Route path="/chem/staff-profile/:id" element={staffLoggedIn ? <StaffEditProfile logout={handleStaffLogOut} /> : <Navigate to="/chem/staff-login" />} />

        <Route path="/chem/staff-reset-password/:resetToken" element={<StaffNewPassword />} />

        <Route path="/chem/staff-dashboard/staff-chemicals-request/:id" element={staffLoggedIn ? <StaffChemicalsRequest logout={handleStaffLogOut} /> : <Navigate to="/chem" />} />
        <Route path="/chem/staff-dashboard/staff-chemicals-receipt" element={staffLoggedIn ? <StaffChemicalsReceipt logout={handleStaffLogOut} /> : <Navigate to="/chem" />} />
        <Route path="/chem/staff-dashboard/staff-chemicals-request-list" element={staffLoggedIn ? <StaffChemicalsRequestList logout={handleStaffLogOut} /> : <Navigate to="/chem" />} />

        <Route path="/chem/staff-dashboard/staff-equipment-request/:id" element={staffLoggedIn ? <StaffEquipmentRequest logout={handleStaffLogOut} /> : <Navigate to="/chem" />} />
        <Route path="/chem/staff-dashboard/staff-equipment-receipt" element={staffLoggedIn ? <StaffEquipmentReceipt logout={handleStaffLogOut} /> : <Navigate to="/chem" />} />
        <Route path="/chem/staff-dashboard/staff-equipment-request-list" element={staffLoggedIn ? <StaffEquipmentRequestList logout={handleStaffLogOut} /> : <Navigate to="/chem" />} />

        <Route path="/chem/chemicals-list" element={staffLoggedIn ? <ChemicalsList logout={handleStaffLogOut} /> : <Navigate to="/chem" />} />
        <Route path="/chem/chemicals-list/add-chemicals" element={staffLoggedIn ? <AddChemicals logout={handleStaffLogOut} /> : <Navigate to="/chem" />} />
        <Route path="/chem/chemicals-list/edit-chemicals/:id" element={staffLoggedIn ? <EditChemicals logout={handleStaffLogOut} /> : <Navigate to="/chem" />} />

        <Route path="/chem/chemicalsStock-filter" element={staffLoggedIn ? <ChemicalsStockFilter logout={handleStaffLogOut} /> : <Navigate to="/chem" />} />
        <Route path="/chem/chemicals-stock" element={staffLoggedIn ? <ChemicalsStockList logout={handleStaffLogOut} /> : <Navigate to="/chem" />} />
        <Route path="/chem/chemicals-stock/:id" element={staffLoggedIn ? <ChemicalsStockById logout={handleStaffLogOut} /> : <Navigate to="/chem" />} />

        <Route path="/chem/chemicalsDetail-list" element={staffLoggedIn ? <ChemicalsDetailList logout={handleStaffLogOut} /> : <Navigate to="/chem" />} />
        <Route path="/chem/chemicalsDetail-list/add-chemicalsDetail" element={staffLoggedIn ? <AddChemicalsDetail logout={handleStaffLogOut} /> : <Navigate to="/chem" />} />
        <Route path="/chem/chemicalsDetail-list/edit-chemicalsDetail/:id" element={staffLoggedIn ? <EditChemicalsDetail logout={handleStaffLogOut} /> : <Navigate to="/chem" />} />

        <Route path="/chem/barcode-chemicals" element={staffLoggedIn ? <BarcodeChemicals logout={handleStaffLogOut} /> : <Navigate to="/chem" />} />
        <Route path="/chem/barcode-equipment" element={staffLoggedIn ? <BarcodeEquipment logout={handleStaffLogOut} /> : <Navigate to="/chem" />} />

        <Route path="/chem/equipment-list" element={staffLoggedIn ? <EquipmentList logout={handleStaffLogOut} /> : <Navigate to="/chem" />} />
        <Route path="/chem/equipment-list/add-equipment" element={staffLoggedIn ? <AddEquipment logout={handleStaffLogOut} /> : <Navigate to="/chem" />} />
        <Route path="/chem/equipment-list/edit-equipment/:id" element={staffLoggedIn ? <EditEquipment logout={handleStaffLogOut} /> : <Navigate to="/chem" />} />

        <Route path="/chem/equipmentCategory-list" element={staffLoggedIn ? <EquipmentCategoryList logout={handleStaffLogOut} /> : <Navigate to="/chem" />} />
        <Route path="/chem/equipmentCategory-list/add-equipmentCategory" element={staffLoggedIn ? <AddEquipmentCategory logout={handleStaffLogOut} /> : <Navigate to="/chem" />} />
        <Route path="/chem/equipmentCategory-list/edit-equipmentCategory/:id" element={staffLoggedIn ? <EditEquipmentCategory logout={handleStaffLogOut} /> : <Navigate to="/chem" />} />

        <Route path="/chem/report-chemicals" element={staffLoggedIn ? <ReportChemicals logout={handleStaffLogOut} /> : <Navigate to="/chem" />} />
        <Route path="/chem/report-equipment" element={staffLoggedIn ? <ReportEquipment logout={handleStaffLogOut} /> : <Navigate to="/chem" />} />

        <Route path="/chem/approve-students-list" element={staffLoggedIn ? <AStudentList logout={handleStaffLogOut} /> : <Navigate to="/chem" />} />
        <Route path="/chem/current-students-list" element={staffLoggedIn ? <CurrentStudentList logout={handleStaffLogOut} /> : <Navigate to="/chem" />} />

        <Route path="/chem/report-request" element={staffLoggedIn ? <ReportRequest logout={handleStaffLogOut} /> : <Navigate to="/chem" />} />

        {/* -------------------------------------------------------- Teacher -------------------------------------------------------- */}
        <Route path="/chem/teacher-login" element={teacherLoggedIn ? <Navigate to="/chem/teacher-dashboard" /> : <TeacherLogin login={handleTeacherLogIn} />} />

        <Route path="/chem/teacher-forget-password" element={<TeacherForgetPassword />} />
        <Route path="/chem/teacher-dashboard" element={teacherLoggedIn ? <TeacherChemicalsRequest logout={handleTeacherLogOut} /> : <Navigate to="/chem" />} />
        <Route path="/chem/teacher-profile" element={teacherLoggedIn ? <TeacherProfile logout={handleTeacherLogOut} /> : <Navigate to="/chem/teacher-login" />} />
        <Route path="/chem/teacher-profile/:id" element={teacherLoggedIn ? <TeacherEditProfile logout={handleTeacherLogOut} /> : <Navigate to="/chem/teacher-login" />} />

        <Route path="/chem/teacher-reset-password/:resetToken" element={<TeacherNewPassword />} />

        <Route path="/chem/teacher-dashboard/teacher-chemicals-request" element={teacherLoggedIn ? <TeacherChemicalsRequest logout={handleTeacherLogOut} /> : <Navigate to="/chem" />} />
        <Route path="/chem/teacher-dashboard/teacher-equipment-request" element={teacherLoggedIn ? <TeacherEquipmentRequest logout={handleTeacherLogOut} /> : <Navigate to="/chem" />} />

        <Route path="/chem/teacher-dashboard/bundle-list" element={teacherLoggedIn ? <BundleList logout={handleTeacherLogOut} /> : <Navigate to="/chem" />} />
        <Route path="/chem/teacher-dashboard/bundle-list/:id" element={teacherLoggedIn ? <BundleView logout={handleTeacherLogOut} /> : <Navigate to="/chem" />} />
        <Route path="/chem/teacher-dashboard/teacher-create-bundle" element={teacherLoggedIn ? <TeacherBundleCart logout={handleTeacherLogOut} /> : <Navigate to="/chem" />} />

        <Route path="chem/teacher-dashboard/chemicals-bundle-list" element={teacherLoggedIn ? <ChemicalsBundleList logout={handleTeacherLogOut} /> : <Navigate to="/" /> } />
        <Route path="chem/teacher-dashboard/equipment-bundle-list" element={teacherLoggedIn ? <EquipmentBundleList logout={handleTeacherLogOut} /> : <Navigate to="/" /> } />

        {/* -------------------------------------------------------- Student -------------------------------------------------------- */}
        <Route path="/chem/student-login" element={<StudentLogin />} />
        <Route path="/chem/student-register" element={<StudentRegister />} />
        <Route path="/chem/student-forget-password" element={<StudentForgetPassword />} />
        <Route path="/chem/student-dashboard" element={<StudentDashboard />} />
        <Route path="/chem/student-profile" element={<StudentProfile />} />

        <Route path="/chem/student-profile/:id" element={<StudentEditProfile />} />
        <Route path="/chem/student-reset-password/:resetToken" element={<StudentNewPassword />} />

        <Route path="/chem/student-dashboard/student-chemicals-request" element={<StudentChemicalsRequest />} />
        <Route path="/chem/student-dashboard/student-chemicals-list" element={<StudentChemicalsList />} />

        <Route path="/chem/student-dashboard/student-equipment-request" element={<StudentEquipmentRequest />} />
        <Route path="/chem/student-dashboard/student-equipment-list" element={<StudentEquipmentList />} />

        <Route path="/chem/student-dashboard/student-chemicals-cart" element={<StudentChemicalsCart />} />
        <Route path="/chem/student-dashboard/student-equipment-cart" element={<StudentEquipmentCart />} />

        <Route path="/chem/student-dashboard/bundle-list" element={<StudentBundleList />} />
        <Route path="/chem/student-dashboard/bundle-list/:id" element={<StudentBundleRequest />} />

        <Route path="/chem/student-dashboard/student-view-teacher" element={<StudentViewTeacher />} />

        <Route path="/chem/student-google-register" element={<StudentGoogleRegister />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;