import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import '../../cssElement/Form.css'

function StudentGoogleLogin() {
    const navigate = useNavigate();
    const [user, setUser] = useState({});

    async function handleCallbackResponse(response) {
        var userObject = jwt_decode(response.credential);
        localStorage.setItem('user_name', userObject.name);
        localStorage.setItem('user_email', userObject.email);
        localStorage.setItem('user_picture', userObject.picture);
        setUser(userObject);
        try {
            const apiUrl = process.env.REACT_APP_API + "/student-list";
            const response = await axios.get(apiUrl);
            const students = response.data;

            const emailExists = students.some(student => student.Student_Email === userObject.email);

            if (emailExists) {
                // Find the student object that matches the email
                const matchingStudent = students.find(student => student.Student_Email === userObject.email);
                console.log('Matching student:', matchingStudent);

                // Make the POST request with email and password
                const postResponse = await axios.post(process.env.REACT_APP_API + "/student-login", {
                    Student_Email: matchingStudent.Student_Email,
                    Student_Password: matchingStudent.Student_Password
                });

                if (postResponse.data.Error) {
                    console.log('Error:', postResponse.data.Error);
                } else {
                    const token = postResponse.data.token;
                    localStorage.setItem("studentToken", token);
                    console.log('Login success');
                    navigate(" student-dashboard");
                }
            } else {
                notifyEmail2();
                navigate(' student-google-register');
            }
        } catch (error) {
            console.error('Error checking email:', error);
            notifyEmail1();
        }
    }

    const notifyEmail1 = () => toast.error("Error checking email");
    const notifyEmail2 = () => toast.error("Email does not exist");

    useEffect(() => {
        /* global google */
        google.accounts.id.initialize({
            client_id: "781769058506-oaacaabq6nsplb1od5tnlakdibndc1q7.apps.googleusercontent.com",
            callback: handleCallbackResponse
        });

        google.accounts.id.renderButton(
            document.getElementById("signInDiv"),
            {
                theme: "outline",
                size: "large",
                text: "Continue with Google",
                shape: "rectangular",
                width: "300px",
            }
        );

        google.accounts.id.prompt();
    }, []);

    return (
        <div>
            <ToastContainer />
            <div id="signInDiv"></div>
        </div>
    );
}

export default StudentGoogleLogin;