using NUnit.Framework;
using Firebase.Database;
using Firebase.Database.Query;
using System.Threading.Tasks;

namespace CartTests
{
    public class CartItem
    {
        public string id { get; set; }
        public string name { get; set; }
        public int price { get; set; }
        public int quantity { get; set; }
    }

    [TestFixture]
    public class CartCRUDTests
    {
        private const string FirebaseDatabaseUrl = "https://pkpl-b9107-default-rtdb.firebaseio.com/";
        private FirebaseClient _firebaseClient;

        public CartCRUDTests()
        {
            _firebaseClient = new FirebaseClient(FirebaseDatabaseUrl);
        }

        [SetUp]
        public void Setup()
        {
            // Firebase Client is already initialized in the constructor.
        }

        [OneTimeTearDown]
        public void Cleanup()
        {
            _firebaseClient.Dispose();  // Clean up the Firebase client after tests
        }

        [Test]
        public async Task AddItemToCart_ShouldAddSuccessfully()
        {
            // Arrange
            var cartItem = new CartItem
            {
                id = "testProduct1",
                name = "Test Product",
                price = 10000,
                quantity = 1
            };

            // Act
            await _firebaseClient
                .Child("cart")
                .Child(cartItem.id)
                .PutAsync(cartItem);

            // Assert
            var addedItem = await _firebaseClient
                .Child("cart")
                .Child(cartItem.id)
                .OnceSingleAsync<CartItem>();

            Assert.IsNotNull(addedItem, "Item not added to cart");
            Assert.AreEqual("Test Product", addedItem.name);
            Assert.AreEqual(10000, addedItem.price);
            Assert.AreEqual(1, addedItem.quantity);
        }

        [Test]
        public async Task UpdateItemInCart_ShouldUpdateSuccessfully()
        {
            // Arrange
            var updatedCartItem = new CartItem
            {
                id = "testProduct1",
                name = "Updated Test Product",
                price = 12000,
                quantity = 2
            };

            // Act
            await _firebaseClient
                .Child("cart")
                .Child(updatedCartItem.id)
                .PutAsync(updatedCartItem);

            // Assert
            var updatedItem = await _firebaseClient
                .Child("cart")
                .Child(updatedCartItem.id)
                .OnceSingleAsync<CartItem>();

            Assert.IsNotNull(updatedItem, "Item not updated in cart");
            Assert.AreEqual("Updated Test Product", updatedItem.name);
            Assert.AreEqual(12000, updatedItem.price);
            Assert.AreEqual(2, updatedItem.quantity);
        }

        [Test]
        public async Task RemoveItemFromCart_ShouldRemoveSuccessfully()
        {
            // Arrange
            var itemId = "testProduct1";

            // Act
            await _firebaseClient
                .Child("cart")
                .Child(itemId)
                .DeleteAsync();

            // Assert
            var removedItem = await _firebaseClient
                .Child("cart")
                .Child(itemId)
                .OnceSingleAsync<CartItem>();

            Assert.IsNull(removedItem, "Item not removed from cart");
        }

        [Test]
        public async Task FetchCart_ShouldReturnItems()
        {
            // Act
            var cartItems = await _firebaseClient
                .Child("cart")
                .OnceAsync<CartItem>();

            // Assert
            Assert.IsNotNull(cartItems, "Cart is empty or not fetched correctly");
            Assert.IsTrue(cartItems.Count > 0, "Cart should have at least one item");
        }
    }
}
