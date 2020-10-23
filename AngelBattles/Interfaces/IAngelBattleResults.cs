namespace AngelBattles.Interfaces
{
    public interface IAngelBattleResults
    {
        string LastBattleTime { get; set; }
        string LastVsBattleTime { get; set; }
        int LastBattleResult { get; set; }
    }
}
