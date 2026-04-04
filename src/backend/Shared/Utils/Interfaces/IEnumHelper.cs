namespace BoraLaBackend.Shared.Utils.Interfaces
{
  public interface IEnumHelper
  {
    public string GetName<T>(int position, string defaultValue) where T: Enum;
  }
}