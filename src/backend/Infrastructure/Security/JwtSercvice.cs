using JWT;
using JWT.Algorithms;
using JWT.Serializers;

namespace BoraLaBackend.Infrastructure.Security
{
   public class JwtService(IConfiguration config) : IJwtService
 {
     private readonly string? secretKey = config["Auth:ServerSecret"];

     public string GenerateToken(string appId, string? email)
     {
         var payload = email == null
             ? CreateAppPayload(appId)
             : CreateUserPayload(email, appId);

         var algorithm = new HMACSHA256Algorithm();
         var serializer = new JsonNetSerializer();
         var urlEncoder = new JwtBase64UrlEncoder(); 
         var jwtEncoder = new JwtEncoder(algorithm, serializer, urlEncoder);

         return jwtEncoder.Encode(payload, secretKey);
     }

     public bool ValidateToken(string token)
     {
         try
         {
             var algorithm = new HMACSHA256Algorithm();
             var serializer = new JsonNetSerializer();
             var provider = new UtcDateTimeProvider();
             var validator = new JwtValidator(serializer, provider);
             var urlEncoder = new JwtBase64UrlEncoder();

             var decoder = new JwtDecoder(serializer, validator, urlEncoder, algorithm);

             var json = decoder.DecodeToObject<Dictionary<string, object>>(token, secretKey, verify: true);

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


     private static Dictionary<string, object> CreateAppPayload(string appId) => new()
     {
         { "sub", appId },
         { "exp", DateTimeOffset.UtcNow.AddMinutes(20).ToUnixTimeSeconds() },
         { "iat", DateTimeOffset.UtcNow.ToUnixTimeSeconds() }
     };

     private static Dictionary<string, object> CreateUserPayload(string email, string appId)
     {
         return new()
         {
             { "email", email },
             { "sub", email },
             { "app_id", appId },
             { "exp", DateTimeOffset.UtcNow.AddHours(1).ToUnixTimeSeconds() },
             { "iat", DateTimeOffset.UtcNow.ToUnixTimeSeconds() }
         };
     } 
 }
}