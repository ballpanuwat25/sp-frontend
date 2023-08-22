import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function StudentGoogleLogin() {
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    const [values, setValues] = useState({
        Student_Email: "",
        Student_Password: "",
    });

    async function handleCallbackResponse(response) {
        var userObject = jwt_decode(response.credential);
        localStorage.setItem('user_name', userObject.name);
        localStorage.setItem('user_email', userObject.email);
        localStorage.setItem('user_picture', userObject.picture);
        setUser(userObject);
        try {
            const apiUrl = 'http://localhost:3001/student-list';
            const response = await axios.get(apiUrl);
            const students = response.data;
    
            const emailExists = students.some(student => student.Student_Email === userObject.email);
    
            if (emailExists) {
                // Find the student object that matches the email
                const matchingStudent = students.find(student => student.Student_Email === userObject.email);
                console.log('Matching student:', matchingStudent);
    
                // Make the POST request with email and password
                const postResponse = await axios.post("http://localhost:3001/student-login", {
                    Student_Email: matchingStudent.Student_Email,
                    Student_Password: matchingStudent.Student_Password
                });
    
                if (postResponse.data.Error) {
                    console.log('Error:', postResponse.data.Error);
                } else {
                    console.log('Login success');
                    navigate("/student-dashboard");
                }
            } else {
                console.log('Email does not exist');
                navigate('/student-google-register');
            }
        } catch (error) {
            console.error('Error checking email:', error);
            // Handle error appropriately, e.g., show an error message to the user
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
            { theme: "outline", size: "Large" }
        );

        google.accounts.id.prompt();
    }, []);

    return (
        <div id="signInDiv"></div>
    );
}

export default StudentGoogleLogin;