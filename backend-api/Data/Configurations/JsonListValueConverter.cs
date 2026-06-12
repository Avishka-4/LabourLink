using System.Text.Json;
using System.Linq;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace LabourLinkAPI.Data.Configurations;

public static class JsonListValueConverter
{
    public static readonly ValueConverter<List<string>, string> Converter = new(
        list => JsonSerializer.Serialize(list ?? new List<string>(), (JsonSerializerOptions?)null),
        json => string.IsNullOrEmpty(json)
            ? new List<string>()
            : JsonSerializer.Deserialize<List<string>>(json, (JsonSerializerOptions?)null) ?? new List<string>()
    );

    public static readonly ValueComparer<List<string>> Comparer = new(
        (left, right) => (left ?? new List<string>()).SequenceEqual(right ?? new List<string>()),
        list => (list ?? new List<string>()).Aggregate(0, (hash, item) => HashCode.Combine(hash, item.GetHashCode())),
        list => list == null ? new List<string>() : list.ToList()
    );
}
