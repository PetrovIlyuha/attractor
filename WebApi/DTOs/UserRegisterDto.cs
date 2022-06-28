using System;
using System.ComponentModel.DataAnnotations;

namespace WebApi.DTOs
{
    public class UserRegisterDto
    {
        [Required] public string Username { get; set; }

        [Required] public string KnownAs { get; set; }
        [Required] public string Gender { get; set; }
        [Required] public DateTime DateOfBirth { get; set; }
        [Required] public string City { get; set; }
        [Required] public string Country { get; set; }

        [Required]
        [MinLength(6)]
        [MaxLength(30)]
        public string Password { get; set; }

    }
}
