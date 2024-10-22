$(document).ready(function () {
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
  const db = firebase.database().ref("reviews"); // Referensi ke Firebase Realtime Database

  // Submit form untuk menambahkan review (POST)
  $("#reviewForm").submit(function (event) {
      event.preventDefault();

      // Ambil data dari form
      var reviewData = {
          name: $("#name").val(),
          rating: $("#rating").val(),
          review: $("#review").val(),
          createdAt: new Date().toISOString(),
      };

      // Log data sebelum disimpan
      console.log("Review Data: ", reviewData);

      // Simpan data ke Firebase
      db.push(reviewData)
          .then(function () {
              alert("Review berhasil ditambahkan!");
              // Reset form setelah berhasil
              $("#reviewForm")[0].reset();
              fetchReviews(); // Refresh review setelah menambahkan
          })
          .catch(function (error) {
              console.error("Error adding review: ", error);
              alert("Gagal menambahkan review. Silakan coba lagi.");
          });
  });

  // Fungsi untuk mengambil dan menampilkan review (GET)
  function fetchReviews() {
      db.once("value")
          .then(function (snapshot) {
              var reviews = snapshot.val();
              $("#reviews-container").empty(); // Kosongkan kontainer sebelum render ulang

              // Loop untuk setiap review
              for (var id in reviews) {
                  var review = reviews[id];
                  const reviewHtml = `
                      <div class="customer-review">
                          <div class="customer-info">
                              <img src="Image/profil ikon.png" alt="Avatar" />
                              <h2>${review.name}</h2>
                          </div>
                          <div class="rating">
                              ${generateStarRating(review.rating)}
                              <p class="review-text">${review.review}</p>
                              <br />
                              <p class="date">${formatDate(review.createdAt)}</p>
                          </div>
                      </div>
                      <br/>
                  `;

                  // Tambahkan review ke dalam container
                  $("#reviews-container").append(reviewHtml);
              }
          })
          .catch(function (error) {
              console.error("Error fetching reviews: ", error);
          });
  }

  // Fungsi untuk generate rating bintang
  function generateStarRating(rating) {
      const fullStars = Math.floor(rating);
      const halfStar = rating % 1 === 0.5 ? '<i class="fa fa-star-half-o"></i>' : "";
      const starIcons = '<i class="fa fa-star"></i>'.repeat(fullStars);
      return starIcons + halfStar;
  }

  // Fungsi untuk format tanggal
  function formatDate(dateString) {
      const date = new Date(dateString);
      return `${date.getDate()} ${getMonthName(date.getMonth())} ${date.getFullYear()}`;
  }

  // Fungsi untuk mendapatkan nama bulan
  function getMonthName(monthIndex) {
      const monthNames = [
          "January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
      ];
      return monthNames[monthIndex];
  }

  // Panggil fetchReviews untuk memuat data saat halaman dimuat
  fetchReviews();
});
