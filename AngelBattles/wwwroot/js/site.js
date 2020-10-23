$(document).ready(function () {
    $('#installMetaMask').click(function () {
        window.open('https://metamask.io/');
    });

    $('#learnMore').click(function () {
        window.open('https://medium.com/@michael_41543/guide-to-playing-angelbattles-com-12b6beb5d9cb');
    });
});

var showMetaMaskAlert = function () {
    $("#warnNoCardsFound").show();
    $('#modalInstallMetaMask').modal('show');
};

var showMetaMaskAlertWrongNetwork = function () {
    $("#warnNoCardsFound").show();
    $('#modalWrongNetwork').modal('show');
};

var showMetaMaskAlertNotLoggedIn = function () {
    $('#modalMetaMaskNotLoggedIn').modal('show');
};

var setCookie = function (type, id, hours) {
    var expireTime = new Date(new Date().getTime() + (hours * 60 * 60 * 1000));
    Cookies.set(type + ":" + id, 'pending', { expires: expireTime });
};

var setCookieInMinutes = function (type, id, minutes) {
    var expireTime = new Date(new Date().getTime() + (minutes * 60 * 1000));
    Cookies.set(type + ":" + id, 'pending', { expires: expireTime });
};

var getCardSeriesImageSrc = function (cardType, seriesId) {
    if (cardType === "angel") {
        if (seriesId === "0") {
            return 'images/Angels/Barakiel.svg';
        } else if (seriesId === "1") {
            return 'images/Angels/Zadkiel.svg';
        } else if (seriesId === "2") {
            return 'images/Angels/Lucifer.svg';
        } else if (seriesId === "3") {
            return 'images/Angels/Michael.svg';
        } else if (seriesId === "4") {
            return 'images/Angels/Arel.svg';
        } else if (seriesId === "5") {
            return 'images/Angels/Raguel.svg';
        } else if (seriesId === "6") {
            return 'images/Angels/Lilith.svg';
        } else if (seriesId === "7") {
            return 'images/Angels/Furlac.svg';
        } else if (seriesId === "8") {
            return 'images/Angels/Azazel.svg';
        } else if (seriesId === "9") {
            return 'images/Angels/Eleleth.svg';
        } else if (seriesId === "10") {
            return 'images/Angels/Verin.svg';
        } else if (seriesId === "11") {
            return 'images/Angels/Ziwa.svg';
        } else if (seriesId === "12") {
            return 'images/Angels/Cimeriel.svg';
        } else if (seriesId === "13") {
            return 'images/Angels/Numinel.svg';
        } else if (seriesId === "14") {
            return 'images/Angels/BatGol.svg';
        } else if (seriesId === "15") {
            return 'images/Angels/Gabriel.svg';
        } else if (seriesId === "16") {
            return 'images/Angels/Metatron.svg';
        } else if (seriesId === "17") {
            return 'images/Angels/Rafael.svg';
        } else if (seriesId === "18") {
            return 'images/Angels/Melchezidek.svg';
        } else if (seriesId === "19") {
            return 'images/Angels/Semyaza.svg';
        } else if (seriesId === "20") {
            return 'images/Angels/Abaddon.svg';
        } else if (seriesId === "21") {
            return 'images/Angels/Baalzebub.svg';
        } else if (seriesId === "22") {
            return 'images/Angels/BenNez.svg';
        } else if (seriesId === "23") {
            return 'images/Angels/Jophiel.svg';
        }
    } else if (cardType === "pet") {
        if (seriesId === "1") {
            return 'images/Pets/Gecko.svg';
        } else if (seriesId === "2") {
            return 'images/Pets/Parakeet.svg';
        } else if (seriesId === "3") {
            return 'images/Pets/AngryKitty.svg';
        } else if (seriesId === "4") {
            return 'images/Pets/Horse.svg';
        } else if (seriesId === "5") {
            return 'images/Pets/WildCommonPets/Komodo.svg';
        } else if (seriesId === "6") {
            return 'images/Pets/WildCommonPets/Falcon.svg';
        } else if (seriesId === "7") {
            return 'images/Pets/WildCommonPets/Bobcat.svg';
        } else if (seriesId === "8") {
            return 'images/Pets/WildCommonPets/Unicorn.svg';
        } else if (seriesId === "9") {
            return 'images/Pets/RockDragon.svg';
        } else if (seriesId === "10") {
            return 'images/Pets/Archaeopteryx.svg';
        } else if (seriesId === "11") {
            return 'images/Pets/Sabortooth.svg';
        } else if (seriesId === "12") {
            return 'images/Pets/Pegasus.svg';
        } else if (seriesId === "13") {
            return 'images/Pets/DireDragon.svg';
        } else if (seriesId === "14") {
            return 'images/Pets/Phoenix.svg';
        } else if (seriesId === "15") {
            return 'images/Pets/Liger.svg';
        } else if (seriesId === "16") {
            return 'images/Pets/Alicorn.svg';
        } else if (seriesId === "17") {
            return 'images/Pets/FireElemental.svg';
        } else if (seriesId === "18") {
            return 'images/Pets/WaterElemental.svg';
        } else if (seriesId === "19") {
            return 'images/Pets/SunElemental.svg';
        }
    } else if (cardType === "acc") {
        if (seriesId === "1") {
            return 'images/Accessories/LeatherBracerSimple.png';
        } else if (seriesId === "2") {
            return 'images/Accessories/MetalBracersSimple.png';
        } else if (seriesId === "3") {
            return 'images/Accessories/ScholarsScrollSimple.png';
        } else if (seriesId === "4") {
            return 'images/Accessories/CosmicScrollSimple.png';
        } else if (seriesId === "5") {
            return 'images/Accessories/4LeafCloverSimple.png';
        } else if (seriesId === "6") {
            return 'images/Accessories/7LeafCloverSimple.png';
        } else if (seriesId === "7") {
            return 'images/Accessories/RedCollarSimple.png';
        } else if (seriesId === "8") {
            return 'images/Accessories/RubyCollarSimple.png';
        } else if (seriesId === "9") {
            return 'images/Accessories/YellowCollarSimple.png';
        } else if (seriesId === "10") {
            return 'images/Accessories/CitrineCollarSimple.png';
        } else if (seriesId === "11") {
            return 'images/Accessories/BlueCollarSimple.png';
        } else if (seriesId === "12") {
            return 'images/Accessories/SapphireCollarSimple.png';
        } else if (seriesId === "13") {
            return 'images/Accessories/CarrotsSimple.png';
        } else if (seriesId === "14") {
            return 'images/Accessories/CricketSimple.png';
        } else if (seriesId === "15") {
            return 'images/Accessories/BirdSeedSimple.png';
        } else if (seriesId === "16") {
            return 'images/Accessories/CatNipSimple.png';
        } else if (seriesId === "17") {
            return 'images/Accessories/LightningRodSimple.png';
        } else if (seriesId === "18") {
            return 'images/Accessories/HolyLightSimple.png';
        }
    }
};

var isGoldCard = function (cardType, seriesId, cardIdString) {
    var isGold = false;
    var cardId = parseInt(cardIdString);

    if (cardType === "pet") {
        if (seriesId === "1") {
            if (cardId <= 20) {
                isGold = true;
            }
        } else if (seriesId === "2") {
            if (cardId <= 77) {
                isGold = true;
            }
        } else if (seriesId === "3") {
            if (cardId <= 545) {
                isGold = true;
            }
        } else if (seriesId === "4") {
            if (cardId <= 1377) {
                isGold = true;
            }
        } else if (seriesId === "5") {
            if (cardId <= 210) {
                isGold = true;
            }
        } else if (seriesId === "6") {
            if (cardId <= 277) {
                isGold = true;
            }
        } else if (seriesId === "7") {
            if (cardId <= 276) {
                isGold = true;
            }
        } else if (seriesId === "8") {
            if (cardId <= 333) {
                isGold = true;
            }
        } else if (seriesId === "9") {
            if (cardId <= 1046) {
                isGold = true;
            }
        } else if (seriesId === "10") {
            if (cardId <= 871) {
                isGold = true;
            }
        } else if (seriesId === "11") {
            if (cardId <= 848) {
                isGold = true;
            }
        } else if (seriesId === "12") {
            if (cardId <= 1055) {
                isGold = true;
            }
        } else if (seriesId === "13") {
            if (cardId <= 2094) {
                isGold = true;
            }
        } else if (seriesId === "14") {
            if (cardId <= 1915) {
                isGold = true;
            }
        } else if (seriesId === "15") {
            if (cardId <= 2005) {
                isGold = true;
            }
        } else if (seriesId === "16") {
            if (cardId <= 1859) {
                isGold = true;
            }
        } 
    }

    return isGold;
};

var getCardSeriesSimpleImageSrc = function (cardType, seriesId, isGold) {
    if (isGold === undefined || isGold === null) {
        isGold = "";
    } else {
        if (isGold) {
            isGold = "Gold";
        } else {
            isGold = "";
        }
    }

    if (cardType === "angel") {
        if (seriesId === "0") {
            return 'images/Angels/BarakielCardSimple.png';
        } else if (seriesId === "1") {
            return 'images/Angels/ZadkielCardSimple.png';
        } else if (seriesId === "2") {
            return 'images/Angels/LuciferCardSimple.png';
        } else if (seriesId === "3") {
            return 'images/Angels/MichaelCardSimple.png';
        } else if (seriesId === "4") {
            return 'images/Angels/ArelCardSimple.png';
        } else if (seriesId === "5") {
            return 'images/Angels/RaguelCardSimple.png';
        } else if (seriesId === "6") {
            return 'images/Angels/LilithCardSimple.png';
        } else if (seriesId === "7") {
            return 'images/Angels/FurlacCardSimple.png';
        } else if (seriesId === "8") {
            return 'images/Angels/AzazelCardSimple.png';
        } else if (seriesId === "9") {
            return 'images/Angels/ElelethCardSimple.png';
        } else if (seriesId === "10") {
            return 'images/Angels/VerinCardSimple.png';
        } else if (seriesId === "11") {
            return 'images/Angels/ZiwaCardSimple.png';
        } else if (seriesId === "12") {
            return 'images/Angels/CimerielCardSimple.png';
        } else if (seriesId === "13") {
            return 'images/Angels/NuminelCardSimple.png';
        } else if (seriesId === "14") {
            return 'images/Angels/BatGolCardSimple.png';
        } else if (seriesId === "15") {
            return 'images/Angels/GabrielCardSimple.png';
        } else if (seriesId === "16") {
            return 'images/Angels/MetatronCardSimple.png';
        } else if (seriesId === "17") {
            return 'images/Angels/RafaelCardSimple.png';
        } else if (seriesId === "18") {
            return 'images/Angels/MelchezidekCardSimple.png';
        } else if (seriesId === "19") {
            return 'images/Angels/SemyazaCardSimple.png';
        } else if (seriesId === "20") {
            return 'images/Angels/AbaddonCardSimple.png';
        } else if (seriesId === "21") {
            return 'images/Angels/BaalzebubCardSimple.png';
        } else if (seriesId === "22") {
            return 'images/Angels/BenNezCardSimple.png';
        } else if (seriesId === "23") {
            return 'images/Angels/JophielCardSimple.png';
        }
    } else if (cardType === "pet") {
        if (seriesId === "1") {
            return 'images/Pets/GeckoCardSimple' + isGold + '.png';
        } else if (seriesId === "2") {
            return 'images/Pets/ParakeetCardSimple' + isGold + '.png';
        } else if (seriesId === "3") {
            return 'images/Pets/AngryKittyCardSimple' + isGold + '.png';
        } else if (seriesId === "4") {
            return 'images/Pets/HorseCardSimple' + isGold + '.png';
        } else if (seriesId === "5") {
            return 'images/Pets/WildCommonPets/KomodoSimple' + isGold + '.png';
        } else if (seriesId === "6") {
            return 'images/Pets/WildCommonPets/FalconSimple' + isGold + '.png';
        } else if (seriesId === "7") {
            return 'images/Pets/WildCommonPets/BobcatSimple' + isGold + '.png';
        } else if (seriesId === "8") {
            return 'images/Pets/WildCommonPets/UnicornSimple' + isGold + '.png';
        } else if (seriesId === "9") {
            return 'images/Pets/RockDragonCardSimple' + isGold + '.png';
        } else if (seriesId === "10") {
            return 'images/Pets/ArchaeopteryxCardSimple' + isGold + '.png';
        } else if (seriesId === "11") {
            return 'images/Pets/SabortoothCardSimple' + isGold + '.png';
        } else if (seriesId === "12") {
            return 'images/Pets/PegasusCardSimple' + isGold + '.png';
        } else if (seriesId === "13") {
            return 'images/Pets/DireDragonCardSimple' + isGold + '.png';
        } else if (seriesId === "14") {
            return 'images/Pets/PhoenixCardSimple' + isGold + '.png';
        } else if (seriesId === "15") {
            return 'images/Pets/LigerCardSimple' + isGold + '.png';
        } else if (seriesId === "16") {
            return 'images/Pets/AlicornCardSimple' + isGold + '.png';
        } else if (seriesId === "17") {
            return 'images/Pets/FireElementalCardSimple' + isGold + '.png';
        } else if (seriesId === "18") {
            return 'images/Pets/WaterElementalCardSimple' + isGold + '.png';
        } else if (seriesId === "19") {
            return 'images/Pets/SunElementalCardSimple' + isGold + '.png';
        }
    } else if (cardType === "acc") {
        if (seriesId === "1") {
            return 'images/Accessories/LeatherBracerSimple.svg';
        } else if (seriesId === "2") {
            return 'images/Accessories/MetalBracersSimple.svg';
        } else if (seriesId === "3") {
            return 'images/Accessories/ScholarsScrollSimple.svg';
        } else if (seriesId === "4") {
            return 'images/Accessories/CosmicScrollSimple.svg';
        } else if (seriesId === "5") {
            return 'images/Accessories/4LeafCloverSimple.svg';
        } else if (seriesId === "6") {
            return 'images/Accessories/7LeafCloverSimple.svg';
        } else if (seriesId === "7") {
            return 'images/Accessories/RedCollarSimple.svg';
        } else if (seriesId === "8") {
            return 'images/Accessories/RubyCollarSimple.svg';
        } else if (seriesId === "9") {
            return 'images/Accessories/YellowCollarSimple.svg';
        } else if (seriesId === "10") {
            return 'images/Accessories/CitrineCollarSimple.svg';
        } else if (seriesId === "11") {
            return 'images/Accessories/BlueCollarSimple.svg';
        } else if (seriesId === "12") {
            return 'images/Accessories/SapphireCollarSimple.svg';
        } else if (seriesId === "13") {
            return 'images/Accessories/CarrotsSimple.svg';
        } else if (seriesId === "14") {
            return 'images/Accessories/CricketSimple.svg';
        } else if (seriesId === "15") {
            return 'images/Accessories/BirdSeedSimple.svg';
        } else if (seriesId === "16") {
            return 'images/Accessories/CatNipSimple.svg';
        } else if (seriesId === "17") {
            return 'images/Accessories/LightningRodSimple.svg';
        } else if (seriesId === "18") {
            return 'images/Accessories/HolyLightSimple.svg';
        }
    }
};

var getAuraGemImageSrc = function (value) {
    if (value === "0") {
        return "images/Gems/BlueGem.svg";
    } else if (value === "1") {
        return "images/Gems/YellowGem.svg";
    } else if (value === "2") {
        return "images/Gems/PurpleGem.svg";
    } else if (value === "3") {
        return "images/Gems/OrangeGem.svg";
    } else if (value === "4") {
        return "images/Gems/RedGem.svg";
    } else if (value === "5") {
        return "images/Gems/GreenGem.svg";
    }
};

var getCardDescription = function (cardType, seriesId) {
    if (cardType === "angel") {
        if (seriesId === "0") {
            return ('Barakiel is a common blue aura angel with a warrior’s spirit. Grab your first angel card for free.');
        } else if (seriesId === "1") {
            return ('Zadkiel is the angel of mercy with yellow aura strength. She is a solid addition to any team.');
        } else if (seriesId === "2") {
            return ('Lucifer is one of the strongest cards in the game! His purple aura gives him the strength of blue and red auras.');
        } else if (seriesId === "3") {
            return ('The leader of the Armies of Heaven, Michael is one of the strongest cards in the game! His orange aura allows him to train with both yellow and red aura pets.');
        } else if (seriesId === "4") {
            return ('The Angel of Fire. A menacing force that should not be reckoned with. Using her power of fire to destroy what she wishes.');
        } else if (seriesId === "5") {
            return ('The Angel of Justice. This angel has always kept fallen angels in line, reining down heinous judgement on those who challenge him.');
        } else if (seriesId === "6") {
            return ('Seductive Demon. Despite her beautiful looks and charm, don\'t be fooled she is a dangerous demon of the night. She is to be feared, and makes a vital asset to your team.');
        } else if (seriesId === "7") {
            return ('Angel of the Earth. Drawing her strength from the powers of the earth, she can destroy any demonic threat with ease.');
        } else if (seriesId === "8") {
            return ('Demon of weapons, disguise. A fallen angel given a demonic appearance, his evil led to the corruption of all humanity.');
        } else if (seriesId === "9") {
            return ('Angel of Peace. Spending an eternity trying to end enmity between various peoples and nations.');
        } else if (seriesId === "10") {
            return ('Demon of impatience. He jumps into any confrontation headfirst, without taking time to weigh the consequences.');
        } else if (seriesId === "11") {
            return ('Angel of Light. In this world of darkness, she holds the power to bring light and destory evil. Match her with pets with a strong yellow aura for extra damage.');
        } else if (seriesId === "12") {
            return ('The Darkness of God. Warior that rides through the ages seeking the ruin of all those who dare stand in his way.');
        } else if (seriesId === "13") {
            return ('Angel of Knowledge. With the ancient knowledge of spells, Numinel is able to hand out a beat down.');
        } else if (seriesId === "14") {
            return ('Angel of Heavenly Voice. The singing is imminent, and it is definitely over when she rains her fury down.');
        } else if (seriesId === "15") {
            return ('Archangel. Messenger of God. He can see straight through any plot. This powerful blue aura angel is a powerful addition to your team.');
        } else if (seriesId === "16") {
            return ('Powerful Kingly Angel. Archangel. As the mediator between God and man, he appears with crystalline armor and hand to settle any deeds.');
        } else if (seriesId === "17") {
            return ('Archangel. Whose name means "God heals", designated for physical and emotional healing. The warrior of travelers keeping them safe and ensuring harmonious journeys.');
        } else if (seriesId === "18") {
            return ('Archangel. His name said to mean "King of Righteousness". Welding a colossal hammer of destruction, he is able to release spirits and destruction on a massive level.');
        } else if (seriesId === "19") {
            return ('There are unfortold stories that Semyaza the Leader of fallen angels tried to mate with humans to create giants called Nephilim.');
        } else if (seriesId === "20") {
            return ('Demon of War. Abaddon is known as the "Destroyer" and as the queen of a plague of locusts that torments those who do not bear a seal of God on their foreheads.');
        } else if (seriesId === "21") {
            return ('Prince of Demons. The Lord of the Flies. Wheather it is demonic possesion, one thing is for sure--you do not want this demon fighting against you.');
        } else if (seriesId === "22") {
            return ('Wind Angel. Ben Nez exercises dominion over the wind. It is said that he protects the world from be destroyed by the demon winds.');
        } else if (seriesId === "23") {
            return ('Archangel. Baby cherub who was sent to guard Eden after the fall. Bearing an omnidirectional flaming sword anything is easy to defeat. This is the last and most powerful angel that can be created in Angel Battles.');
        } else {
            return ('');
        }
    } else if (cardType === "pet") {
        if (seriesId === "1") {
            return ('Domestic. Unbreedable. Reptilian Line.');
        } else if (seriesId === "2") {
            return ('Domestic. Unbreedable. Avian Line.');
        } else if (seriesId === "3") {
            return ('Domestic. Unbreedable. Feline Line.');
        } else if (seriesId === "4") {
            return ('Domestic. Unbreedable. Equine Line.');
        }
    } else if (cardType === "acc") {
        if (seriesId === "1") {
            return ('Increase BP + 5');
        } else if (seriesId === "2") {
            return ('Increase BP + 15');
        } else if (seriesId === "3") {
            return ('Increase EXP + 20');
        } else if (seriesId === "4") {
            return ('Increase EXP + 40');
        } else if (seriesId === "5") {
            return ('Increase Pet Luck + 5');
        } else if (seriesId === "6") {
            return ('Increase Pet Luck + 10');
        } else if (seriesId === "7") {
            return ('Increaes Pet Red Aura + 6');
        } else if (seriesId === "8") {
            return ('Increase Pet Red Aura + 12');
        } else if (seriesId === "9") {
            return ('Increase Pet Yellow Aura + 6');
        } else if (seriesId === "10") {
            return ('Increase Pet Yellow Aura + 12');
        } else if (seriesId === "11") {
            return ('Increase Pet Blue Aura + 6');
        } else if (seriesId === "12") {
            return ('Increase Pet Blue Aura + 12');
        } else if (seriesId === "13") {
            return ('Increase chance of fighting Horse Line');
        } else if (seriesId === "14") {
            return ('Increase chance of fighting Lizard Line');
        } else if (seriesId === "15") {
            return ('Increase chance of fighting Avian Line');
        } else if (seriesId === "16") {
            return ('Increase chance of fighting Feline Line');
        } else if (seriesId === "17") {
            return ('Increase chance of fighting Elemental');
        } else if (seriesId === "18") {
            return ('Increase VS battle power against fallen angels');
        }
    }
};

//Define variable
var objQueryString = {};

//Get querystring value
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

//Add or modify querystring
function changeUrl(key, value) {
    //Get query string value
    var searchUrl = location.search;
    if (searchUrl.indexOf("?") == "-1") {
        var urlValue = '?' + key + '=' + value;
        history.pushState({ state: 1, rand: Math.random() }, '', urlValue);
    }
    else {
        //Check for key in query string, if not present
        if (searchUrl.indexOf(key) == "-1") {
            var urlValue = searchUrl + '&' + key + '=' + value;
        }
        else {	//If key present in query string
            oldValue = getParameterByName(key);
            if (searchUrl.indexOf("?" + key + "=") != "-1") {
                urlValue = searchUrl.replace('?' + key + '=' + oldValue, '?' + key + '=' + value);
            }
            else {
                urlValue = searchUrl.replace('&' + key + '=' + oldValue, '&' + key + '=' + value);
            }
        }
        history.pushState({ state: 1, rand: Math.random() }, '', urlValue);
        //history.pushState function is used to add history state.
        //It takes three parameters: a state object, a title (which is currently ignored), and (optionally) a URL.
    }
    objQueryString.key = value;
}

//Function used to remove querystring
function removeQString(key) {
    var urlValue = document.location.href;

    //Get query string value
    var searchUrl = location.search;

    if (key != "") {
        oldValue = getParameterByName(key);
        removeVal = key + "=" + oldValue;
        if (searchUrl.indexOf('?' + removeVal + '&') != "-1") {
            urlValue = urlValue.replace('?' + removeVal + '&', '?');
        }
        else if (searchUrl.indexOf('&' + removeVal + '&') != "-1") {
            urlValue = urlValue.replace('&' + removeVal + '&', '&');
        }
        else if (searchUrl.indexOf('?' + removeVal) != "-1") {
            urlValue = urlValue.replace('?' + removeVal, '');
        }
        else if (searchUrl.indexOf('&' + removeVal) != "-1") {
            urlValue = urlValue.replace('&' + removeVal, '');
        }
    }
    else {
        var searchUrl = location.search;
        urlValue = urlValue.replace(searchUrl, '');
    }
    history.pushState({ state: 1, rand: Math.random() }, '', urlValue);
}

var isMobileDevice = function () {
    var isMobile = false; //initiate as false
    // device detection
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
        || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) isMobile = true;

    return isMobile;
}