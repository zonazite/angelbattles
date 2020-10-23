using AngelBattles.Models;
using Microsoft.AspNetCore.Hosting;
using System;
using System.Collections.Generic;
using System.IO;

namespace AngelBattles.Utilities
{
    public class Helpers
    {
        public static DateTime UnixTimeStampToDateTime(string unixTimeStampString)
        {
            DateTime dtDateTime = DateTime.MinValue;
            if (double.TryParse(unixTimeStampString, out double unixTimeStamp))
            {
                // Unix timestamp is seconds past epoch
                dtDateTime = new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc);
                dtDateTime = dtDateTime.AddSeconds(unixTimeStamp).ToLocalTime();
            }

            return dtDateTime;
        }

        public static string JavascriptVersion { get; } = "49";

        public static string GetRestictions(int cardSeriesId)
        {
            string restriction;

            switch (cardSeriesId)
            {
                case 0:
                    restriction = "Barakiel";
                    break;
                case 1:
                    restriction = "Zadkiel";
                    break;
                case 2:
                    restriction = "Lucifer";
                    break;
                case 3:
                    restriction = "Michael";
                    break;
                case 4:
                    restriction = "Arel";
                    break;
                case 5:
                    restriction = "Raguel";
                    break;
                case 6:
                    restriction = "Lilith";
                    break;
                case 7:
                    restriction = "Furlac";
                    break;
                case 8:
                    restriction = "Azazel";
                    break;
                case 9:
                    restriction = "Eleleth";
                    break;
                case 10:
                    restriction = "Verin";
                    break;
                case 11:
                    restriction = "Ziwa";
                    break;
                case 12:
                    restriction = "Cimeriel";
                    break;
                case 13:
                    restriction = "Numinel";
                    break;
                case 14:
                    restriction = "Bat Gol";
                    break;
                case 15:
                    restriction = "Gabriel";
                    break;
                case 16:
                    restriction = "Metatron";
                    break;
                case 17:
                    restriction = "Rafael";
                    break;
                case 18:
                    restriction = "Melchezidek";
                    break;
                case 19:
                    restriction = "Semyaza";
                    break;
                case 20:
                    restriction = "Abbadon";
                    break;
                case 21:
                    restriction = "Baalzebub";
                    break;
                case 22:
                    restriction = "Ben Nez";
                    break;
                case 23:
                    restriction = "Jophiel";
                    break;
                case 24:
                    restriction = "No Restrictions";
                    break;
                default:
                    restriction = "";
                    break;
            }

            if (cardSeriesId != 24 && !string.IsNullOrEmpty(restriction))
            {
                restriction += " or below";
            }

            return restriction;
        }

        public static AngelCardInfo GetAngelCardInfo(int angelCardSeriesId, int aura)
        {
            var cardImage = "";
            var rarityDescription = "";
            var cardDescription = "";
            switch (angelCardSeriesId)
            {
                case 0:
                    cardImage = "images/Angels/BarakielCardSimple.png";
                    rarityDescription = "Common";
                    cardDescription = "Barakiel is a common blue aura angel with a warrior\'s spirit.";
                    break;
                case 1:
                    cardImage = "images/Angels/ZadkielCardSimple.png";
                    rarityDescription = "Rare";
                    cardDescription = "Zadkiel is the angel of mercy with yellow aura strength.";
                    break;
                case 2:
                    cardImage = "images/Angels/LuciferCardSimple.png";
                    rarityDescription = "Limited Edition";
                    cardDescription = "Lucifer is one of the strongest cards in the game! His purple aura gives him the strength of blue and red auras.";
                    break;
                case 3:
                    cardImage = "images/Angels/MichaelCardSimple.png";
                    rarityDescription = "Limited Edition";
                    cardDescription = "The leader of the Armies of Heaven, Michael is one of the strongest cards in the game! His orange aura allows him to train with both yellow and red aura pets.";
                    break;
                case 4:
                    cardImage = "images/Angels/ArelCardSimple.png";
                    rarityDescription = "Ultra Rare";
                    cardDescription = "The Angel of Fire";
                    break;
                case 5:
                    cardImage = "images/Angels/RaguelCardSimple.png";
                    rarityDescription = "Ultra Rare";
                    cardDescription = "The Angel of Justice. This angel has always kept fallen angels in line, reining down heinous judgement on those who challenge him.";
                    break;
                case 6:
                    cardImage = "images/Angels/LilithCardSimple.png";
                    rarityDescription = "Ultra Rare";
                    cardDescription = "Seductive Demon. Despite her beautiful looks and charm, don\'t be fooled she is a dangerous demon of the night. She is to be feared.";
                    break;
                case 7:
                    cardImage = "images/Angels/FurlacCardSimple.png";
                    rarityDescription = "Ultra Rare";
                    cardDescription = "Angel of the Earth. Drawing her strength from the powers of the earth, she can destroy any demonic threat with ease.";
                    break;
                case 8:
                    cardImage = "images/Angels/AzazelCardSimple.png";
                    rarityDescription = "Ultra Rare";
                    cardDescription = "Demon of weapons, disguise. A fallen angel given a demonic appearance, his evil led to the corruption of all humanity.";
                    break;
                case 9:
                    cardImage = "images/Angels/ElelethCardSimple.png";
                    rarityDescription = "Ultra Rare";
                    cardDescription = "Angel of Peace. Spending an eternity trying to end enmity between various peoples and nations.";
                    break;
                case 10:
                    cardImage = "images/Angels/VerinCardSimple.png";
                    rarityDescription = "Ultra Rare";
                    cardDescription = "Demon of impatience. He jumps into any confrontation headfirst, without taking time to weigh the consequences.";
                    break;
                case 11:
                    cardImage = "images/Angels/ZiwaCardSimple.png";
                    rarityDescription = "Ultra Rare";
                    cardDescription = "Angel of Light. In this world of darkness, she holds the power to bring light and destory evil.";
                    break;
                case 12:
                    cardImage = "images/Angels/CimerielCardSimple.png";
                    rarityDescription = "Ultra Rare";
                    cardDescription = "The Darkness of God. Warrior on a black horse.";
                    break;
                case 13:
                    cardImage = "images/Angels/NuminelCardSimple.png";
                    rarityDescription = "Ultra Rare";
                    cardDescription = "Angel of Knowledge. With the ancient knowledge of spells, Numinel is able to hand out a beat down.";
                    break;
                case 14:
                    cardImage = "images/Angels/BatGolCardSimple.png";
                    rarityDescription = "Ultra Rare";
                    cardDescription = "Angel of Heavenly Voice. The singing is imminent, and it is definitely  over when she rains her fury down.";
                    break;
                case 15:
                    cardImage = "images/Angels/GabrielCardSimple.png";
                    rarityDescription = "Rare";
                    cardDescription = "Archangel. Messenger of God. He can see straight through any plot. This powerful blue aura angel is a powerful addition to your team.";
                    break;
                case 16:
                    cardImage = "images/Angels/MetatronCardSimple.png";
                    rarityDescription = "Rare";
                    cardDescription = "Powerful Kingly Angel. Archangel. As the mediator between God and man, he appears with crystalline armor and hand to settle any deeds.";
                    break;
                case 17:
                    cardImage = "images/Angels/RafaelCardSimple.png";
                    rarityDescription = "Rare";
                    cardDescription = "Archangel. Whose name means \'God heals\', designated for physical and emotional healing. The warrior of travelers keeping them safe and ensuring harmonious journeys.";
                    break;
                case 18:
                    cardImage = "images/Angels/MelchezidekCardSimple.png";
                    rarityDescription = "Rare";
                    cardDescription = "Archangel. His name said to mean \'King of Righteousness\'. Welding a colossal hammer of destruction, he is able to release spirits and destruction on a massive level.";
                    break;
                case 19:
                    cardImage = "images/Angels/SemyazaCardSimple.png";
                    rarityDescription = "Ultra Rare";
                    cardDescription = "There are unfortold stories that Semyaza the Leader of fallen angels tried to mate with humans to create giants called Nephilim.";
                    break;
                case 20:
                    cardImage = "images/Angels/AbaddonCardSimple.png";
                    rarityDescription = "Ultra Rare";
                    cardDescription = "Demon of War. Abaddon is known as the 'Destroyer' and as the queen of a plague of locusts that torments those who do not bear a seal of God on their foreheads.";
                    break;
                case 21:
                    cardImage = "images/Angels/BaalzebubCardSimple.png";
                    rarityDescription = "Ultra Rare";
                    cardDescription = "Prince of Demons. The Lord of the Flies. Wheather it is demonic possesion, one thing is for sure--you do not want this demon fighting against you.";
                    break;
                case 22:
                    cardImage = "images/Angels/BenNezCardSimple.png";
                    rarityDescription = "Ultra Rare";
                    cardDescription = "Wind Angel. Ben Nez exercises dominion over the wind. It is said that he protects the world from be destroyed by the demon winds.";
                    break;
                case 23:
                    cardImage = "images/Angels/JophielCardSimple.png";
                    rarityDescription = "Ultra Rare";
                    cardDescription = "Archangel. Baby cherub who was sent to guard Eden after the fall. Bearing an omnidirectional flaming sword anything is easy to defeat. This is the last and most powerful angel that can be created in Angel Battles.";
                    break;
                default:
                    cardImage = "images/Angels/ComingSoonAngel.png";
                    rarityDescription = "Unknown Angel";
                    cardDescription = "This card data will be updated very soon.";
                    break;

            }

            var gemAltText = "";
            var gemImage = "";
            switch (aura)
            {
                case 0:
                    gemImage = "images/Gems/BlueGem.svg";
                    gemAltText = "Blue Aura";
                    break;
                case 1:
                    gemImage = "images/Gems/YellowGem.svg";
                    gemAltText = "Yellow Aura";
                    break;
                case 2:
                    gemImage = "images/Gems/PurpleGem.svg";
                    gemAltText = "Purple Aura";
                    break;
                case 3:
                    gemImage = "images/Gems/OrangeGem.svg";
                    gemAltText = "Orange Aura";
                    break;
                case 4:
                    gemImage = "images/Gems/RedGem.svg";
                    gemAltText = "Red Aura";
                    break;
                case 5:
                    gemImage = "images/Gems/GreenGem.svg";
                    gemAltText = "Green Aura";
                    break;
                default:
                    break;
            }

            return new AngelCardInfo
            {
                CardImage = cardImage,
                RarityDescription = rarityDescription,
                CardDescription = cardDescription,
                GemAltText = gemAltText,
                GemImage = gemImage
            };
        }

        public static string GetPetCardSimple(int petCardSeriesId, bool isGold = false)
        {
            var cardImage = "";
            switch (petCardSeriesId)
            {
                case 1:
                    cardImage = "images/Pets/GeckoCardSimple" + (isGold ? "Gold" : "") + ".png";
                    break;
                case 2:
                    cardImage = "images/Pets/ParakeetCardSimple" + (isGold ? "Gold" : "") + ".png";
                    break;
                case 3:
                    cardImage = "images/Pets/AngryKittyCardSimple" + (isGold ? "Gold" : "") + ".png";
                    break;
                case 4:
                    cardImage = "images/Pets/HorseCardSimple" + (isGold ? "Gold" : "") + ".png";
                    break;
                case 5:
                    cardImage = "images/Pets/WildCommonPets/KomodoSimple" + (isGold ? "Gold" : "") + ".png";
                    break;
                case 6:
                    cardImage = "images/Pets/WildCommonPets/FalconSimple" + (isGold ? "Gold" : "") + ".png";
                    break;
                case 7:
                    cardImage = "images/Pets/WildCommonPets/BobcatSimple" + (isGold ? "Gold" : "") + ".png";
                    break;
                case 8:
                    cardImage = "images/Pets/WildCommonPets/UnicornSimple" + (isGold ? "Gold" : "") + ".png";
                    break;
                case 9:
                    cardImage = "images/Pets/RockDragonCardSimple" + (isGold ? "Gold" : "") + ".png";
                    break;
                case 10:
                    cardImage = "images/Pets/ArchaeopteryxCardSimple" + (isGold ? "Gold" : "") + ".png";
                    break;
                case 11:
                    cardImage = "images/Pets/SabortoothCardSimple" + (isGold ? "Gold" : "") + ".png";
                    break;
                case 12:
                    cardImage = "images/Pets/PegasusCardSimple" + (isGold ? "Gold" : "") + ".png";
                    break;
                case 13:
                    cardImage = "images/Pets/DireDragonCardSimple" + (isGold ? "Gold" : "") + ".png";
                    break;
                case 14:
                    cardImage = "images/Pets/PhoenixCardSimple" + (isGold ? "Gold" : "") + ".png";
                    break;
                case 15:
                    cardImage = "images/Pets/LigerCardSimple" + (isGold ? "Gold" : "") + ".png";
                    break;
                case 16:
                    cardImage = "images/Pets/AlicornCardSimple" + (isGold ? "Gold" : "") + ".png";
                    break;
                case 17:
                    cardImage = "images/Pets/FireElementalCardSimple" + (isGold ? "Gold" : "") + ".png";
                    break;
                case 18:
                    cardImage = "images/Pets/WaterElementalCardSimple" + (isGold ? "Gold" : "") + ".png";
                    break;
                case 19:
                    cardImage = "images/Pets/SunElementalCardSimple" + (isGold ? "Gold" : "") + ".png";
                    break;
                default:
                    cardImage = "images/Angels/ComingSoonAngel.png";
                    break;

            }

            return cardImage;
        }

        public static bool IsGoldCard(int cardSeriesId, int cardId)
        {
            var isGoldCard = false;

            switch (cardSeriesId)
            {
                case 1:
                    if (cardId <= 20)
                    {
                        isGoldCard = true;
                    }
                    break;
                case 2:
                    if (cardId <= 77)
                    {
                        isGoldCard = true;
                    }
                    break;
                case 3:
                    if (cardId <= 545)
                    {
                        isGoldCard = true;
                    }
                    break;
                case 4:
                    if (cardId <= 1377)
                    {
                        isGoldCard = true;
                    }
                    break;
                case 5:
                    if (cardId <= 210)
                    {
                        isGoldCard = true;
                    }
                    break;
                case 6:
                    if (cardId <= 277)
                    {
                        isGoldCard = true;
                    }
                    break;
                case 7:
                    if (cardId <= 276)
                    {
                        isGoldCard = true;
                    }
                    break;
                case 8:
                    if (cardId <= 333)
                    {
                        isGoldCard = true;
                    }
                    break;
                case 9:
                    if (cardId <= 1046)
                    {
                        isGoldCard = true;
                    }
                    break;
                case 10:
                    if (cardId <= 871)
                    {
                        isGoldCard = true;
                    }
                    break;
                case 11:
                    if (cardId <= 848)
                    {
                        isGoldCard = true;
                    }
                    break;
                case 12:
                    if (cardId <= 1055)
                    {
                        isGoldCard = true;
                    }
                    break;
                case 13:
                    if (cardId <= 2094)
                    {
                        isGoldCard = true;
                    }
                    break;
                case 14:
                    if (cardId <= 1915)
                    {
                        isGoldCard = true;
                    }
                    break;
                case 15:
                    if (cardId <= 2005)
                    {
                        isGoldCard = true;
                    }
                    break;
                case 16:
                    if (cardId <= 1859)
                    {
                        isGoldCard = true;
                    }
                    break;
                default:
                    break;
            }

            return isGoldCard;
        }

        public static AccessoryCardInfo GetAccessoryCardInfo(int accessoryCardSeriesId)
        {
            var cardImage = "";
            var cardDescription = "";
            switch (accessoryCardSeriesId)
            {
                case 1:
                    cardImage = "images/Accessories/LeatherBracerSimple.png";
                    cardDescription = "Increase BP + 5";
                    break;
                case 2:
                    cardImage = "images/Accessories/MetalBracersSimple.png";
                    cardDescription = "Increase BP + 15";
                    break;
                case 3:
                    cardImage = "images/Accessories/ScholarsScrollSimple.png";
                    cardDescription = "Increase EXP + 20";
                    break;
                case 4:
                    cardImage = "images/Accessories/CosmicScrollSimple.png";
                    cardDescription = "Increase EXP + 40";
                    break;
                case 5:
                    cardImage = "images/Accessories/4LeafCloverSimple.png";
                    cardDescription = "Increase Pet Luck + 5";
                    break;
                case 6:
                    cardImage = "images/Accessories/7LeafCloverSimple.png";
                    cardDescription = "Increase Pet Luck + 10";
                    break;
                case 7:
                    cardImage = "images/Accessories/RedCollarSimple.png";
                    cardDescription = "Increaes Pet Red Aura + 6";
                    break;
                case 8:
                    cardImage = "images/Accessories/RubyCollarSimple.png";
                    cardDescription = "Increase Pet Red Aura + 12";
                    break;
                case 9:
                    cardImage = "images/Accessories/YellowCollarSimple.png";
                    cardDescription = "Increase Pet Yellow Aura + 6";
                    break;
                case 10:
                    cardImage = "images/Accessories/CitrineCollarSimple.png";
                    cardDescription = "Increase Pet Yellow Aura + 12";
                    break;
                case 11:
                    cardImage = "images/Accessories/BlueCollarSimple.png";
                    cardDescription = "Increase Pet Blue Aura + 6";
                    break;
                case 12:
                    cardImage = "images/Accessories/SapphireCollarSimple.png";
                    cardDescription = "Increase Pet Blue Aura + 12";
                    break;
                case 13:
                    cardImage = "images/Accessories/CarrotsSimple.png";
                    cardDescription = "Increase chance of fighting Horse Line";
                    break;
                case 14:
                    cardImage = "images/Accessories/CricketSimple.png";
                    cardDescription = "Increase chance of fighting Lizard Line";
                    break;
                case 15:
                    cardImage = "images/Accessories/BirdSeedSimple.png";
                    cardDescription = "Increase chance of fighting Avian Line";
                    break;
                case 16:
                    cardImage = "images/Accessories/CatNipSimple.png";
                    cardDescription = "Increase chance of fighting Feline Line";
                    break;
                case 17:
                    cardImage = "images/Accessories/LightningRodSimple.png";
                    cardDescription = "Increase chance of fighting Elemental";
                    break;
                case 18:
                    cardImage = "images/Accessories/HolyLightSimple.png";
                    cardDescription = "Increase VS battle power against fallen angels";
                    break;
                default:
                    cardImage = "images/Angels/ComingSoonAngelSimple.png";
                    cardDescription = "This card data will be updated very soon.";
                    break;

            }

            return new AccessoryCardInfo
            {
                CardImage = cardImage,
                CardDescription = cardDescription
            };
        }

        private static List<Images> PngImagesList { get; set; }
        public static List<Images> GetPngImageUrlList(IHostingEnvironment hostingEnvironment)
        {
            if (PngImagesList == null)
            {
                PngImagesList = new List<Images>();

                var file = Path.Combine(hostingEnvironment.WebRootPath, "public", "imagesPng.csv");
                using (var streamReader = File.OpenText(file))
                {
                    while (!streamReader.EndOfStream)
                    {
                        var line = streamReader.ReadLine();
                        var data = line.Split(new[] { ',' });
                        var images = new Images() { CardSeriesType = data[0], CardSeriesId = data[1], CardName = data[2], ImageUri = data[3] };
                        PngImagesList.Add(images);
                    }
                }
            } 

            return PngImagesList;
        }

        private static List<Images> SvgImagesList { get; set; }
        public static List<Images> GetSvgImageUrlList(IHostingEnvironment hostingEnvironment)
        {
            if (SvgImagesList == null)
            {
                SvgImagesList = new List<Images>();

                var file = Path.Combine(hostingEnvironment.WebRootPath, "public", "imagesSvg.csv");
                using (var streamReader = File.OpenText(file))
                {
                    while (!streamReader.EndOfStream)
                    {
                        var line = streamReader.ReadLine();
                        var data = line.Split(new[] { ',' });
                        var images = new Images() { CardSeriesType = data[0], CardSeriesId = data[1], CardName = data[2], ImageUri = data[3] };
                        SvgImagesList.Add(images);
                    }
                }
            }

            return SvgImagesList;
        }

        private static List<Images> MetaDataList { get; set; }
        public static List<Images> MetaDataUrlList(IHostingEnvironment hostingEnvironment)
        {
            if (MetaDataList == null)
            {
                MetaDataList = new List<Images>();

                var file = Path.Combine(hostingEnvironment.WebRootPath, "public", "metaData.csv");
                using (var streamReader = File.OpenText(file))
                {
                    while (!streamReader.EndOfStream)
                    {
                        var line = streamReader.ReadLine();
                        var data = line.Split(new[] { '|' });
                        var images = new Images() { CardSeriesType = data[0], CardSeriesId = data[1], CardName = data[2], ImageUri = data[3], Description = data[4], ExternalUrl = data[5] };
                        MetaDataList.Add(images);
                    }
                }
            }

            return MetaDataList;
        }

    }
}
