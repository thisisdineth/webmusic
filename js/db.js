import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';
import { getAuth, signOut, onAuthStateChanged, updateProfile } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-storage.js';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA-M8XsFZaZPu_lBIx0TbqcmzhTXeHRjQM",
    authDomain: "ecommerceapp-dab53.firebaseapp.com",
    projectId: "ecommerceapp-dab53",
    storageBucket: "ecommerceapp-dab53.appspot.com",
    messagingSenderId: "429988301014",
    appId: "1:429988301014:web:4f09bb412b6cf0b4a82177"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

// DOM elements
const signOutButton = document.getElementById('signOutButton');
const profileImage = document.getElementById('profileImage');
const uploadProfilePhoto = document.getElementById('uploadProfilePhoto');
const greetingMessage = document.getElementById('greetingMessage');

// Check user authentication
onAuthStateChanged(auth, user => {
    if (user) {
        // User is signed in, show greeting and load profile
        showGreeting(user.displayName);
        loadProfilePhoto(user);
    } else {
        // User is not signed in, redirect to login
        window.location.href = 'login.html';
    }
});

// Function to display greeting message based on the time of day
function showGreeting(userName) {
    const hours = new Date().getHours();
    let greeting = 'Hello';

    if (hours < 12) {
        greeting = 'Good Morning';
    } else if (hours >= 12 && hours < 18) {
        greeting = 'Good Afternoon';
    } else {
        greeting = 'Good Evening';
    }

    // Show actual user name, or 'User' if name is missing
    greetingMessage.textContent = `${greeting}, ${userName || 'User'}!`;
}

// Function to load the user's profile photo
function loadProfilePhoto(user) {
    if (user.photoURL) {
        profileImage.src = user.photoURL;
    } else {
        profileImage.src = 'images/default.png'; // Default profile image if none
    }
}

// Handle profile photo upload and update
uploadProfilePhoto.addEventListener('change', async function () {
    const file = uploadProfilePhoto.files[0];

    if (file) {
        const storageRef = ref(storage, `profilePhotos/${auth.currentUser.uid}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);

        // Update user profile with new photo
        await updateProfile(auth.currentUser, { photoURL: downloadURL });
        profileImage.src = downloadURL; // Update the profile image on the page
        alert('Profile photo updated!');
    }
});

// Sign out functionality
signOutButton.addEventListener('click', async function () {
    await signOut(auth);
    window.location.href = 'login.html'; // Redirect to login page after signing out
});
