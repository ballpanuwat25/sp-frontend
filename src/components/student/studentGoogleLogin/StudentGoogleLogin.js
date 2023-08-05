import jwt_decode from 'jwt-decode';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function StudentGoogleLogin() {
    const navigate = useNavigate();
    const [user, setUser] = useState({});

    function handleCallbackResponse(response) {
        var userObject = jwt_decode(response.credential);
        localStorage.setItem('user_name', userObject.name);
        localStorage.setItem('user_email', userObject.email);
        localStorage.setItem('user_picture', userObject.picture);
        setUser(userObject);
        navigate('/');
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