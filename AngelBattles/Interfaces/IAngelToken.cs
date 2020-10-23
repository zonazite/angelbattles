namespace AngelBattles.Interfaces
{
    public interface IAngelToken : IAngel
    {
        string Rarity { get; set; }
        string Description { get; set; }
        string AuraDescription { get; set; }
        string PngImageUri { get; set; }
    }
}
