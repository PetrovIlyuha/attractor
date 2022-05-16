using System.ComponentModel.DataAnnotations;

namespace WebApi.DTOs
{
    public class UserRegisterDto
    {
        [Required]
        public string Username { get; set; }

        [Required]
        [MinLength(6)]
        [MaxLength(30)]
        public string Password { get; set; }
        
    }
}
