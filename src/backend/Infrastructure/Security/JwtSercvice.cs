using BoraLaBackend.Models;
using JWT;
using JWT.Algorithms;
using JWT.Serializers;
using MongoDB.Driver;

namespace BoraLaBackend.Infrastructure.Security
{
    public class JwtService: IJwtService
    {
        private readonly string? _secretKey;
        private readonly JwtEncoder _encoder;
        private readonly JwtDecoder _decoder;

        public JwtService(IConfiguration config)
        {
            var algorithm = new HMACSHA256Algorithm();
            var serializer = new JsonNetSerializer();
            var urlEncoder = new JwtBase64UrlEncoder();
            var provider = new UtcDateTimeProvider();
            var validator = new JwtValidator(serializer, provider);

            var encoder = new JwtEncoder(algorithm, serializer, urlEncoder);
            var decoder = new JwtDecoder(serializer, validator, urlEncoder, algorithm);

            _secretKey = config["Auth:ServerSecret"];
            _encoder = encoder;
            _decoder = decoder;
        }

        public string GenerateToken(string appId, string? email)
        {
            var payload = email == null
                ? CreateAppPayload(appId)
                : CreateUserPayload(email, appId);

            return _encoder.Encode(payload, _secretKey);
        }

        public bool ValidateToken(string token)
        {
            try
            {
                var json = _decoder.DecodeToObject<Dictionary<string, object>>(token, _secretKey, verify: true);

                // Valida se o token é válido
                if (json == null) return false;

                // Valida se o token ainda esta ativo
                if (json.TryGetValue("exp", out var expObj))
                {
                    var exp = Convert.ToInt64(expObj);
                    if (DateTimeOffset.UtcNow.ToUnixTimeSeconds() > exp)
                        return false;
                }
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public async Task<bool> InvalidateToken(string token, IMongoCollection<BlacklistedToken> collection)
        {
            try
            {
                var json = _decoder.DecodeToObject<Dictionary<string, object>>(token, _secretKey, verify: true);

                if (json == null || !json.TryGetValue("jti", out var jtiObj))
                    return false;

                var jti = jtiObj.ToString();

                var expiresAt = DateTimeOffset.FromUnixTimeSeconds(
                    Convert.ToInt64(json["exp"])
                ).UtcDateTime;

                BlacklistedToken doc = new()
                {
                    Id = jti,
                    ExpiresAt = expiresAt
                };

                await collection.InsertOneAsync(doc);
                return true;
            }
            catch
            {
                return false;
            }
        }

        private static Dictionary<string, object> CreateAppPayload(string appId) => new()
     {
        { "jti", Guid.NewGuid().ToString() },
        { "sub", appId },
        { "exp", DateTimeOffset.UtcNow.AddMinutes(20).ToUnixTimeSeconds() },
        { "iat", DateTimeOffset.UtcNow.ToUnixTimeSeconds() }
     };

        private static Dictionary<string, object> CreateUserPayload(string email, string appId)
        {
            return new()
            {
                { "jti", Guid.NewGuid().ToString() },
                { "email", email },
                { "sub", email },
                { "app_id", appId },
                { "exp", DateTimeOffset.UtcNow.AddHours(1).ToUnixTimeSeconds() },
                { "iat", DateTimeOffset.UtcNow.ToUnixTimeSeconds() }
            };
        }
    }
}