// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { getDatabase, ref, set, get, update } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBef-U-wEVon3pBL9_OJZmO_aUCGcqClmM",
    authDomain: "pkpl-b9107.firebaseapp.com",
    databaseURL: "https://pkpl-b9107-default-rtdb.firebaseio.com",
    projectId: "pkpl-b9107",
    storageBucket: "pkpl-b9107.appspot.com",
    messagingSenderId: "102677199151",
    appId: "1:102677199151:web:03dded143f259ec35b89da"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// Get buttons and input fields by ID
const signinButton = document.getElementById("signin-button");
const signupButton = document.getElementById("signup-button");

// Validation functions
function validateName(name) {
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(name) || name.length < 4 || name.length > 12) {
        document.getElementById("name-error").innerText = "Nama harus terdiri dari 4 sampai 12 huruf.";
        return false;
    } else {
        document.getElementById("name-error").innerText = "";
        return true;
    }
}

async function validatePhone(nohp) {
    const phoneRegex = /^\d{10,13}$/; // Matches 10-13 digits
    if (!phoneRegex.test(nohp)) {
        document.getElementById("nohp-error").innerText = "No HP harus memiliki panjang 10 sampai 13 digit angka.";
        return false;
    } else {
        const userRef = ref(database, "users");
        const snapshot = await get(userRef);
        let phoneExists = false;

        snapshot.forEach((childSnapshot) => {
            const childData = childSnapshot.val();
            if (childData.nohp === nohp) {
                phoneExists = true;
            }
        });

        if (phoneExists) {
            document.getElementById("nohp-error").innerText = "No HP sudah terdaftar.";
            return false;
        } else {
            document.getElementById("nohp-error").innerText = "";
            return true;
        }
    }
}


async function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!emailRegex.test(email)) {
        document.getElementById("email-error").innerText = "Email harus berakhiran @gmail.com.";
        return false;
    } else {
        const userRef = ref(database, "users");
        const snapshot = await get(userRef);
        let emailExists = false;

        snapshot.forEach((childSnapshot) => {
            const childData = childSnapshot.val();
            if (childData.email === email) {
                emailExists = true;
            }
        });

        if (emailExists) {
            document.getElementById("email-error").innerText = "Email sudah terdaftar.";
            return false;
        } else {
            document.getElementById("email-error").innerText = "";
            return true;
        }
    }
}

function validatePassword(password) {
    if (password.length < 6 || password.length > 8) {
        document.getElementById("password-error").innerText = "Password harus 6 sampai 8 karakter.";
        return false;
    } else {
        document.getElementById("password-error").innerText = "";
        return true;
    }
}


// Event listener for signup
signupButton.addEventListener("click", async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const nohp = document.getElementById("nohp").value;
    const emailSignup = document.getElementById("email_signup").value;
    const passwordSignup = document.getElementById("psw_signup").value;

    const isValid = validateName(name) && await validatePhone(nohp) && await validateEmail(emailSignup) && validatePassword(passwordSignup);

    if (isValid) {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, emailSignup, passwordSignup);
            const user = userCredential.user;

            await set(ref(database, "users/" + user.uid), {
                name: name,
                nohp: nohp,
                email: emailSignup,
            });

            alert("User berhasil dibuat");
        } catch (error) {
            alert("Gagal registrasi: " + error.message);
        }
    }
});

// Event listener for signin
signinButton.addEventListener("click", async (e) => {
    e.preventDefault();
    const emailSignin = document.getElementById("email_signin").value;
    const passwordSignin = document.getElementById("psw_signin").value;

    let valid = true;

    // Check if email is empty
    const emailError = document.getElementById("email-signin-error");
    if (emailSignin === "") {
        emailError.style.display = "inline";
        valid = false;
    } else {
        emailError.style.display = "none";
    }

    // Check if password is empty
    const passwordError = document.getElementById("password-signin-error");
    if (passwordSignin === "") {
        passwordError.style.display = "inline";
        valid = false;
    } else {
        passwordError.style.display = "none";
    }

    if (valid) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, emailSignin, passwordSignin);
            const user = userCredential.user;
            const lgDate = new Date();

            await update(ref(database, "users/" + user.uid), {
                last_login: lgDate
            });

            window.location.href = "Home.html";
        } catch (error) {
            alert("Gagal login: " + error.message);
        }
    }
});
