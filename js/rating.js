$(document).ready(function() {
    // Inisialisasi Firebase
    const firebaseConfig = {
        apiKey: "AIzaSyBef-U-wEVon3pBL9_OJZmO_aUCGcqClmM",
        authDomain: "pkpl-b9107.firebaseapp.com",
        databaseURL: "https://pkpl-b9107-default-rtdb.firebaseio.com",
        projectId: "pkpl-b9107",
        storageBucket: "pkpl-b9107.appspot.com",
        messagingSenderId: "102677199151",
        appId: "1:102677199151:web:03dded143f259ec35b89da"
      };

    // Inisialisasi Firebase
    firebase.initializeApp(firebaseConfig);
    const db = firebase.database().ref("reviews"); // Referensi ke Realtime Database 'reviews'

    // Fungsi untuk mengambil review dari Firebase dan menampilkannya
    function fetchReviews() {
        db.once("value")
            .then(function(snapshot) {
                var reviews = snapshot.val(); // Mendapatkan semua review
                var reviewsHTML = '';

                // Loop melalui review yang diambil
                for (var id in reviews) {
                    var review = reviews[id];
                    reviewsHTML += '<div class="review">';
                    reviewsHTML += '<h4>' + review.name + '</h4>';
                    reviewsHTML += '<p>Rating: ' + review.rating + '</p>';
                    reviewsHTML += '<p>' + review.review + '</p>';
                    reviewsHTML += '</div>';
                }

                // Memasukkan review ke dalam kontainer
                $("#reviews-container").html(reviewsHTML);
            })
            .catch(function(error) {
                console.error("Error fetching reviews: ", error);
            });
    }

    // Panggil fungsi fetchReviews untuk memuat data review saat halaman dimuat
    fetchReviews();
});
