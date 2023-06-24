import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import {firebaseConf} from './firebase_config.js'


firebase.initializeApp(firebaseConf());
const db = firebase.firestore();

function Redirector() {
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchURL = async () => {
            try {
                const doc = await db.collection('urls').doc(id).get();
                if (doc.exists) {
                    const data = doc.data();
                    window.location.href = data.url;
                } else {
                    console.error('Shortened URL does not exist.');
                    navigate('/'); // Redirect to home page or show an error message
                }
            } catch (error) {
                console.error('Error fetching URL:', error);
                navigate('/'); // Redirect to home page or show an error message
            }
        };

        fetchURL();
    }, [id, navigate]);

    return <div>Redirecting...</div>;
}

export default Redirector;
