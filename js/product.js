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
    const db = firebase.database().ref("products"); // Referensi ke Firebase Realtime Database
    const storage = firebase.storage().ref("product-images"); // Referensi ke Firebase Storage
    const cartRef = firebase.database().ref("cart"); // Referensi ke cart di Firebase Realtime Database

    // Fungsi untuk menampilkan produk yang diambil dari Firebase
    function fetchProducts() {
        db.once("value")
            .then(function (snapshot) {
                var products = snapshot.val(); // Ambil data produk
                var productHTML = '';
                for (var id in products) {
                    var product = products[id];
                    productHTML += '<div class="col">';
                    productHTML += '<img src="' + product.image + '" alt="' + product.name + '">'; // Tampilkan gambar produk
                    productHTML += '<div class="product-info">';
                    productHTML += '<h3 class="product-name">' + product.name + '</h3>';
                    productHTML += '<h4 class="product-price" kategori="' + product.kategori + '" data-price="' + product.price + '">Rp. ' + product.price + '</h4>';
                    productHTML += '<button class="add-to-cart" data-id="' + id + '">Tambah ke Keranjang</button>'; // Tombol untuk menambah ke keranjang
                    productHTML += '</div>';
                    productHTML += '</div>';
                }
                $(".food-container").html(productHTML); // Masukkan ke dalam container produk
            })
            .catch(function (error) {
                console.error("Error fetching products: ", error);
            });
    }

    // Fungsi untuk menambahkan produk ke keranjang
    $(document).on('click', '.add-to-cart', function () {
        const productId = $(this).data('id');
        const productPrice = $(this).siblings('.product-price').data('price');
        const productName = $(this).siblings('.product-name').text();

        const cartItem = {
            id: productId,
            name: productName,
            price: productPrice,
            quantity: 1 // Awalnya satu
        };

        // Tambah produk ke keranjang di Firebase
        cartRef.child(productId).set(cartItem)
            .then(() => {
                alert("Produk berhasil ditambahkan ke keranjang!");
            })
            .catch((error) => {
                console.error("Error adding to cart: ", error);
                alert("Gagal menambahkan produk ke keranjang.");
            });
    });

    // Fungsi untuk menampilkan isi keranjang
    function fetchCart() {
        cartRef.once("value")
            .then(function (snapshot) {
                var cartItems = snapshot.val();
                var cartHTML = '';
                var total = 0;

                for (var id in cartItems) {
                    var item = cartItems[id];
                    cartHTML += '<div class="cart-item">';
                    cartHTML += '<h4>' + item.name + '</h4>';
                    cartHTML += '<p>Harga: Rp. ' + item.price + '</p>';
                    cartHTML += '<button class="remove-from-cart" data-id="' + id + '">Hapus dari Keranjang</button>';
                    cartHTML += '</div>';
                    total += item.price * item.quantity; // Hitung total harga
                }

                cartHTML += '<h3>Total: Rp. ' + total + '</h3>'; // Tampilkan total harga
                $(".cart-container").html(cartHTML); // Masukkan ke dalam container keranjang
            })
            .catch(function (error) {
                console.error("Error fetching cart: ", error);
            });
    }

    // Fungsi untuk menghapus produk dari keranjang
    $(document).on('click', '.remove-from-cart', function () {
        const productId = $(this).data('id');

        // Hapus produk dari keranjang di Firebase
        cartRef.child(productId).remove()
            .then(() => {
                alert("Produk berhasil dihapus dari keranjang!");
                fetchCart(); // Refresh isi keranjang setelah penghapusan
            })
            .catch((error) => {
                console.error("Error removing from cart: ", error);
                alert("Gagal menghapus produk dari keranjang.");
            });
    });

    // Fetch products saat halaman dimuat
    fetchProducts();
    fetchCart(); // Fetch isi keranjang saat halaman dimuat

    // Fungsi untuk upload produk baru
    $('#uploadProductForm').submit(function (event) {
        event.preventDefault(); // Mencegah form submit default

        var productName = $('#productName').val();
        var productCategory = $('#productCategory').val();
        var productPrice = $('#productPrice').val();
        var productImage = $('#productImage')[0].files[0]; // Ambil file gambar

        // Validasi input
        if (!productName || !productCategory || !productPrice || !productImage) {
            alert("Semua field harus diisi!");
            return;
        }

        // Upload gambar ke Firebase Storage
        var storageRef = storage.child(productImage.name);
        storageRef.put(productImage).then(function (snapshot) {
            snapshot.ref.getDownloadURL().then(function (imageUrl) {
                // Simpan data produk ke Firebase Realtime Database
                var newProduct = {
                    name: productName,
                    kategori: productCategory,
                    price: productPrice,
                    image: imageUrl // URL gambar dari Firebase Storage
                };

                db.push(newProduct)
                    .then(function () {
                        alert("Produk berhasil di-upload!");
                        $('#uploadProductForm')[0].reset(); // Reset form
                        fetchProducts(); // Refresh produk setelah upload
                    })
                    .catch(function (error) {
                        console.error("Error adding product: ", error);
                        alert("Gagal mengupload produk.");
                    });
            });
        }).catch(function (error) {
            console.error("Error uploading image: ", error);
            alert("Gagal mengupload gambar.");
        });
    });
});
