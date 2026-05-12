using System.ComponentModel.DataAnnotations;

namespace LabourLinkAPI.Models.Entities;

public class LookupValue
{
    [Key]
    public int LookupId { get; set; }

    [Required]
    [MaxLength(100)]
    public string Category { get; set; } = string.Empty;

    public int Value { get; set; }

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;
}
