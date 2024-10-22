$(document).ready(function () {
    $("#sendMsg").submit(function (event) {
        event.preventDefault();

        // Ambil data dari form
        var name = $('#name').val();
        var email = $('#email').val();
        var message = $('#message').val();

        console.log("Name:", name);
        console.log("Email:", email);
        console.log("Message:", message);

        // Validasi form
        if (!name || !email || !message) {
            alert("Semua field harus diisi!");
            return;
        }

        // Referensi ke Firebase Realtime Database
        var db = firebase.database().ref('messages'); // 'messages' adalah nama node di database

        // Menyimpan data ke Firebase
        db.push({
            name: name,
            email: email,
            message: message
        }).then(function () {
            alert("Pesan berhasil dikirim!");
            $('#sendMsg')[0].reset(); // Reset form
        }).catch(function (error) {
            console.error("Error saving message: ", error);
            alert("Gagal mengirim pesan: " + error.message);
        });
    });
});
