import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Alert from '../../Alert';

import '../../cssElement/Form.css'

function StudentGoogleLogin() {
    const navigate = useNavigate();
    const [user, setUser] = useState({});

    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    async function handleCallbackResponse(response) {
        var userObject = jwt_decode(response.credential);
        localStorage.setItem('user_name', userObject.name);
        localStorage.setItem('user_email', userObject.email);
        localStorage.setItem('user_picture', userObject.picture);
        setUser(userObject);
        try {
            const apiUrl = 'https://special-problem.onrender.com/student-list';
            const response = await axios.get(apiUrl);
            const students = response.data;

            const emailExists = students.some(student => student.Student_Email === userObject.email);

            if (emailExists) {
                // Find the student object that matches the email
                const matchingStudent = students.find(student => student.Student_Email === userObject.email);
                console.log('Matching student:', matchingStudent);

                // Make the POST request with email and password
                const postResponse = await axios.post("https://special-problem.onrender.com/student-login", {
                    Student_Email: matchingStudent.Student_Email,
                    Student_Password: matchingStudent.Student_Password
                });

                if (postResponse.data.Error) {
                    console.log('Error:', postResponse.data.Error);
                } else {
                    const token = postResponse.data.token;
                    localStorage.setItem("studentToken", token);
                    console.log('Login success');
                    navigate("/student-dashboard");
                }
            } else {
                setAlertMessage('Email does not exist');
                setShowAlert(true);
                navigate('/student-google-register');
            }
        } catch (error) {
            console.error('Error checking email:', error);
            setAlertMessage('Error checking email');
            setShowAlert(true);
        }
    }

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
            <div id="signInDiv"></div>

            {showAlert && (
                <Alert
                    message={alertMessage}
                    onClose={() => setShowAlert(false)}
                />
            )}
        </div>
    );
}

export default StudentGoogleLogin;