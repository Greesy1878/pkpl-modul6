using NUnit.Framework;

namespace RegistrationTests
{
    [TestFixture]
    public class RegistrationValidationTests
    {
        // Method to validate name
        private bool ValidateName(string name)
        {
            var nameRegex = new System.Text.RegularExpressions.Regex(@"^[a-zA-Z\s]+$");
            return nameRegex.IsMatch(name) && name.Length >= 4 && name.Length <= 12;
        }

        // Method to validate phone
        private bool ValidatePhone(string phone)
        {
            var phoneRegex = new System.Text.RegularExpressions.Regex(@"^\d{10,13}$");
            return phoneRegex.IsMatch(phone);
        }

        // Method to validate email
        private bool ValidateEmail(string email)
        {
            var emailRegex = new System.Text.RegularExpressions.Regex(@"^[a-zA-Z0-9._%+-]+@gmail\.com$");
            return emailRegex.IsMatch(email);
        }

        // Method to validate password
        private bool ValidatePassword(string password)
        {
            return password.Length >= 6 && password.Length <= 8;
        }

        [Test]
        public void ValidateName_ShouldReturnTrue_ForValidName()
        {
            Assert.IsTrue(ValidateName("John Doe"));
        }

        [Test]
        public void ValidateName_ShouldReturnFalse_ForInvalidName()
        {
            Assert.IsFalse(ValidateName("Jo"));
            Assert.IsFalse(ValidateName("John123"));
        }

        [Test]
        public void ValidatePhone_ShouldReturnTrue_ForValidPhone()
        {
            Assert.IsTrue(ValidatePhone("08123456789"));
        }

        [Test]
        public void ValidatePhone_ShouldReturnFalse_ForInvalidPhone()
        {
            Assert.IsFalse(ValidatePhone("08123")); // Too short
            Assert.IsFalse(ValidatePhone("12345abcde")); // Contains letters
        }

        [Test]
        public void ValidateEmail_ShouldReturnTrue_ForValidEmail()
        {
            Assert.IsTrue(ValidateEmail("user@gmail.com"));
        }

        [Test]
        public void ValidateEmail_ShouldReturnFalse_ForInvalidEmail()
        {
            Assert.IsFalse(ValidateEmail("user@yahoo.com")); // Not @gmail.com
            Assert.IsFalse(ValidateEmail("user@.com")); // Invalid format
        }

        [Test]
        public void ValidatePassword_ShouldReturnTrue_ForValidPassword()
        {
            Assert.IsTrue(ValidatePassword("123456"));
        }

        [Test]
        public void ValidatePassword_ShouldReturnFalse_ForInvalidPassword()
        {
            Assert.IsFalse(ValidatePassword("123")); // Too short
            Assert.IsFalse(ValidatePassword("123456789")); // Too long
        }
    }
}
