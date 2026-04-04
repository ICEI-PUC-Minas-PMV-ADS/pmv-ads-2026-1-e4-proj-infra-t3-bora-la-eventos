using BoraLaBackend.Shared.Utils.Interfaces;

namespace BoraLaBackend.Shared.Utils
{
  public class EnumHelper: IEnumHelper
  {
    public string GetName<T>(int code, string defaultValue) where T: Enum
    {
      var name = Enum.GetName(typeof(T), code);
      return name ?? defaultValue;
    }
  }
}