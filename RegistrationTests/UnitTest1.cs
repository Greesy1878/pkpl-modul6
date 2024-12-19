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
            Assert.That(ValidateName("John Doe"), Is.True);
        }

        [Test]
        public void ValidateName_ShouldReturnFalse_ForInvalidName()
        {
            Assert.That(ValidateName("Jo"), Is.False);
            Assert.That(ValidateName("John123"), Is.False);
        }

        [Test]
        public void ValidatePhone_ShouldReturnTrue_ForValidPhone()
        {
            Assert.That(ValidatePhone("08123456789"), Is.True);
        }

        [Test]
        public void ValidatePhone_ShouldReturnFalse_ForInvalidPhone()
        {
            Assert.That(ValidatePhone("08123"), Is.False); // Too short
            Assert.That(ValidatePhone("12345abcde"), Is.False); // Contains letters
        }

        [Test]
        public void ValidateEmail_ShouldReturnTrue_ForValidEmail()
        {
            Assert.That(ValidateEmail("user@gmail.com"), Is.True);
        }

        [Test]
        public void ValidateEmail_ShouldReturnFalse_ForInvalidEmail()
        {
            Assert.That(ValidateEmail("user@yahoo.com"), Is.False); // Not @gmail.com
            Assert.That(ValidateEmail("user@.com"), Is.False); // Invalid format
        }

        [Test]
        public void ValidatePassword_ShouldReturnTrue_ForValidPassword()
        {
            Assert.That(ValidatePassword("123456"), Is.True);
        }

        [Test]
        public void ValidatePassword_ShouldReturnFalse_ForInvalidPassword()
        {
            Assert.That(ValidatePassword("123"), Is.False); // Too short
            Assert.That(ValidatePassword("123456789"), Is.False); // Too long
        }
    }
}
