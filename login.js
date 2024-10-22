import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { getDatabase, ref, set, update } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";

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
let signinButton = document.getElementById("signin-button");
let signupButton = document.getElementById("signup-button");

// Fungsi untuk validasi nama
function validateName(name) {
    const nameRegex = /^[a-zA-Z\s]+$/; // Hanya huruf dan spasi
    if (!nameRegex.test(name)) {
        document.getElementById("name-error").innerText = "Nama: Hanya boleh huruf (tanpa angka dan tanda baca).";
        return false;
    } else {
        document.getElementById("name-error").innerText = ""; // Kosongkan pesan kesalahan jika valid
        return true;
    }
}

// Fungsi untuk validasi nomor HP
function validatePhone(nohp) {
    const phoneRegex = /^\+62\d{10,13}$/; // Awalan +62, diikuti 10-13 angka
    if (!phoneRegex.test(nohp)) {
        document.getElementById("nohp-error").innerText = "No HP: Harus diawali dengan +62, minimal 12 angka, maksimal 15 angka.";
        return false;
    } else {
        document.getElementById("nohp-error").innerText = "";
        return true;
    }
}

// Fungsi untuk validasi email
function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/; // Harus menggunakan @gmail.com
    if (!emailRegex.test(email)) {
        document.getElementById("email-error").innerText = "Email: Harus berakhiran dengan @gmail.com.";
        return false;
    } else {
        document.getElementById("email-error").innerText = "";
        return true;
    }
}

// Fungsi untuk validasi password
function validatePassword(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/;
    if (!passwordRegex.test(password)) {
        document.getElementById("password-error").innerText = "Password: Harus berisi huruf besar, huruf kecil, dan angka, minimal 6 karakter.";
        return false;
    } else {
        document.getElementById("password-error").innerText = "";
        return true;
    }
}

// Event listener untuk signup
document.getElementById("signup-button").addEventListener("click", (e) => {
    e.preventDefault(); // Mencegah pengiriman form
    let name = document.getElementById("name").value;
    let nohp = document.getElementById("nohp").value;
    let emailSignup = document.getElementById("email_signup").value;
    let passwordSignup = document.getElementById("psw_signup").value;

    let valid = true;

    // Validasi input nama
    if (!validateName(name)) valid = false;

    // Validasi nomor HP
    if (!validatePhone(nohp)) valid = false;

    // Validasi email
    if (!validateEmail(emailSignup)) valid = false;

    // Validasi password
    if (!validatePassword(passwordSignup)) valid = false;

    // Jika semua validasi berhasil, lanjutkan proses signup Firebase
    if (valid) {
        createUserWithEmailAndPassword(auth, emailSignup, passwordSignup)
            .then((userCredential) => {
                const user = userCredential.user;

                // Simpan data pengguna ke database
                set(ref(database, "users/" + user.uid), {
                    name: name,
                    nohp: nohp,
                    email: emailSignup,
                })
                .then(() => {
                    alert("User telah sukses dibuat");
                })
                .catch((error) => {
                    alert("Gagal menyimpan data: " + error.message);
                });
            })
            .catch((error) => {
                alert("Gagal registrasi: " + error.message);
            });
    }
});

// Event listener untuk signin
signinButton.addEventListener("click", (e) => {
    e.preventDefault(); // Mencegah pengiriman form
    let emailSignin = document.getElementById("email_signin").value;
    let passwordSignin = document.getElementById("psw_signin").value;

    let valid = true;

    // Validasi email
    if (emailSignin === "") {
        document.getElementById("email-signin-error").innerText = "Email tidak boleh kosong.";
        document.getElementById("email-alert").style.display = 'block'; // Tampilkan alert
        valid = false;
    } else {
        document.getElementById("email-signin-error").innerText = "";
        document.getElementById("email-alert").style.display = 'none'; // Sembunyikan alert
    }

    // Validasi password
    if (passwordSignin === "") {
        document.getElementById("password-signin-error").innerText = "Password tidak boleh kosong.";
        document.getElementById("password-alert").style.display = 'block'; // Tampilkan alert
        valid = false;
    } else {
        document.getElementById("password-signin-error").innerText = "";
        document.getElementById("password-alert").style.display = 'none'; // Sembunyikan alert
    }

    // Jika ada kesalahan, hentikan proses
    if (!valid) {
        return;
    }

    // Lakukan autentikasi
    signInWithEmailAndPassword(auth, emailSignin, passwordSignin)
        .then((userCredential) => {
            const user = userCredential.user;
            let lgDate = new Date();
            update(ref(database, "users/" + user.uid), {
                last_login: lgDate
            })
            .then(() => {
                window.location.href = "index.html"; // Redirect ke halaman utama
            })
            .catch((error) => {
                alert("Gagal memperbarui data login: " + error.message);
            });
        })
        .catch((error) => {
            // Tampilkan alert jika email tidak terdaftar atau password salah
            document.getElementById("email-alert").style.display = 'block'; // Tampilkan alert email
            document.getElementById("password-alert").style.display = 'block'; // Tampilkan alert password
            alert("Gagal login: " + error.message);
        });
});
