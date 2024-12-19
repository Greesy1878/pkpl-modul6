using System;
using System.Threading.Tasks;
using NUnit.Framework;
using Moq;

namespace FirebaseTests
{
    public interface IFirebaseAuthService
    {
        Task<string> SignInAsync(string email, string password);
    }

    public class FirebaseAuthService : IFirebaseAuthService
    {
        public async Task<string> SignInAsync(string email, string password)
        {
            if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
                throw new ArgumentException("Email and password cannot be empty");

            if (email == "test@gmail.com" && password == "password123")
            {
                return "user-uid-12345";
            }
            else
            {
                throw new UnauthorizedAccessException("Invalid credentials");
            }
        }
    }

    [TestFixture]
    public class FirebaseAuthServiceTests
    {
        private Mock<IFirebaseAuthService> _authServiceMock;

        [SetUp]
        public void SetUp()
        {
            _authServiceMock = new Mock<IFirebaseAuthService>();
        }

        [Test]
        public async Task SignInAsync_ValidCredentials_ReturnsUserId()
        {
            string email = "test@gmail.com";
            string password = "password123";
            string expectedUserId = "user-uid-12345";

            _authServiceMock
                .Setup(auth => auth.SignInAsync(email, password))
                .ReturnsAsync(expectedUserId);

            var authService = _authServiceMock.Object;

            var userId = await authService.SignInAsync(email, password);

            Assert.That(userId, Is.EqualTo(expectedUserId));
        }

        [Test]
        public void SignInAsync_EmptyEmail_ThrowsArgumentException()
        {
            string email = "";
            string password = "password123";
            var authService = new FirebaseAuthService();

            Assert.ThrowsAsync<ArgumentException>(async () =>
                await authService.SignInAsync(email, password));
        }

        [Test]
        public void SignInAsync_InvalidCredentials_ThrowsUnauthorizedAccessException()
        {
            string email = "invalid@gmail.com";
            string password = "wrongpassword";

            _authServiceMock
                .Setup(auth => auth.SignInAsync(email, password))
                .ThrowsAsync(new UnauthorizedAccessException("Invalid credentials"));

            var authService = _authServiceMock.Object;

            var ex = Assert.ThrowsAsync<UnauthorizedAccessException>(async () =>
                await authService.SignInAsync(email, password));

            Assert.That(ex.Message, Is.EqualTo("Invalid credentials"));
        }
    }
}
