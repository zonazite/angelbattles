$(document).ready(function () {
    var scene = document.getElementById('scene');
    var parallaxInstance = new Parallax(scene, {
        relativeInput: true
    });

    parallaxInstance.friction(0.2, 0.2);

    // Setup lazy cards
    $('#cardsContainer .lazy').lazy({
        appendScroll: $('#cardsContainer')
    });

    // Setup buttons
    setupButtonEvents();
});

// Global Variables
var rpcConnected = null;
var account = undefined;

    // init the connection and create contract
    window.addEventListener('load', function () {

        // Checking if Web3 has been injected by the browser (Mist/MetaMask)
        if (typeof web3 !== 'undefined') {
            // Use Mist/MetaMask's provider
            window.web3 = new Web3(web3.currentProvider);

            if ((web3.eth.accounts[0] || null) !== account) {
                account = web3.eth.accounts[0] || null;
                if (account) {
                    web3.eth.defaultAccount = account;
                } else {
                    setTimeout(function () {
                        showMetaMaskAlertNotLoggedIn();
                    }, 5000);
                }
                console.log("INFO_LOG|update_account_info|account=" + account);
            }

            // set account
            var accountInterval = setInterval(function () {
                if ((web3.eth.accounts[0] || null) !== account) {
                    account = web3.eth.accounts[0] || null;
                    if (account) {
                        //web3.eth.defaultAccount = account;
                    }
                    location.reload();
                    //dispatchEvent(new Event('load'));

                    console.log("INFO_LOG|update_account_info|account=" + account);
                }
            }, 500);

            web3.version.getNetwork((err, netId) => {
                switch (netId) {
                    case "1":
                        console.log('INFO_LOG|running_on_main_net.');
                        break;
                    case "2":
                        console.log('INFO_LOG|running_on_deprecatedmorden_test_network.');
                        showMetaMaskAlertWrongNetwork();
                        break;
                    case "3":
                        console.log('INFO_LOG|running_on_ropsten_test_network.');
                        showMetaMaskAlertWrongNetwork();
                        break;
                    default:
                        console.log('INFO_LOG|running_on_unknown_network.');
                        showMetaMaskAlertWrongNetwork();
                        break;
                }
            });
            rpcConnected = true;
            showGetCardContainer();
        } else {
            showMetaMaskAlertGetCard();
            account = null;
        }

        // init contract
        realmContractInstance = getRealmContractInstance();
        angelCardDataContractInstance = getAngelCardDataContractInstance();
        petCardDataContractInstance = getPetCardDataContractInstance();
        accessoryDataContractInstance = getAccessoryDataContractInstance();

        // Call Contract Read Functions
        if (getCardType() === "angel") {
            getAngelCardSeries(setupUI);
        } else if (getCardType() === "pet") {
            getPetCardSeries(setupUI);
        } else if (getCardType() === "acc") {
            getAccessorySeries(setupUI);
        }
    });

    function isEtherAccountActive() {
        return account !== null && account !== undefined;
    }

var setupButtonEvents = function () {
    $("#getCard").click(function () {
        if (isEtherAccountActive()) {
            if (getCardType() === "angel") {
                createAngel();
            } else if (getCardType() === "pet") {
                createPet();
            } else if (getCardType() === "acc") {
                createAccessory();
            }
        } else {
            showMetaMaskAlertNotLoggedIn();
        }
    });

    $("#goToMyTeam").click(function () {
        window.location.href = '/team';
    });

    $("#getPets").click(function () {
        $("#cardBoughtContainer").hide();
        $("#buyPetsContainer").show();
    });

    $("#getAnotherPet").click(function () {
        $("#cardBoughtContainer").hide();
        $("#buyPetsContainer").show();
    });

    $("#getAccessories").click(function () {
        $("#cardBoughtContainer").hide();
        $("#buyAccessoriesContainer").show();
    });

    $("#freeAngel").click(function () {
        $("#cardBoughtContainer").hide();
        $("#buyAngelsContainer").show();
    });
};

var setupUI = function (data) {
    var currentAngelTotal = -1;
    var currentPetTotal = -1;
    var currentAccTotal = -1;
    var maxTotal = 0;

    if (getCardType() === "angel") {
        $("#price").text(data["basePrice"].toString() + " ETH");

        currentAngelTotal = parseInt(data["currentAngelTotal"].toString());
        maxTotal = parseInt(data["maxAngelTotal"].toString());
        var totalAngelsRemaining = maxTotal - currentAngelTotal;
        $("#totalRemaining").text(totalAngelsRemaining);

        var battlePowerMax = parseInt(data["baseBattlePower"].toString()) + 10;
        $("#battlePower").text(data["baseBattlePower"].toString() + " to " + battlePowerMax);
        $("#aura").text(getAuraString(data["baseAura"].toString()));

        $("#angelPowerAndAura").show();
    } else if (getCardType() === "pet") {
        $("#price").text("0 ETH");

        currentPetTotal = parseInt(data["currentPetTotal"].toString());
        maxTotal = parseInt(data["maxPetTotal"].toString());
        var totalPetsRemaining = maxTotal - currentPetTotal;
        $("#totalRemaining").text(totalPetsRemaining);

        var luckRange = "";
        var cardSeriesId = getCardSeriesId();
        if (cardSeriesId >= 1 && cardSeriesId <= 4) {
            luckRange = "10 to 19";
        } else if (cardSeriesId >= 5 && cardSeriesId <= 8) {
            luckRange = "20 to 29";
        } else if (cardSeriesId >= 9 && cardSeriesId <= 12) {
            luckRange = "30 to 39";
        } else if (cardSeriesId >= 13 && cardSeriesId <= 16) {
            luckRange = "40 to 49";
        } else if (cardSeriesId >= 17 && cardSeriesId <= 19) {
            luckRange = "50 to 59";
        }
        $("#luck").text(luckRange);

        if (totalPetsRemaining > 0) {
            $("#petNameGroup").show();
        }
        $("#petLuck").show();
    } else if (getCardType() === "acc") {
        $("#price").text(data["price"].toString() + " ETH");

        currentAccTotal = parseInt(data["currentTotal"].toString());
        maxTotal = parseInt(data["maxTotal"].toString());
        var totalAccRemaining = maxTotal - currentAccTotal;
        $("#totalRemaining").text(totalAccRemaining);
    }

    getCardImage();

    var cardDescription = getCardDescription(getCardType(), getCardSeriesId()) + " This card is limited in existence, only " + maxTotal + " can ever be created. Ever.";
    $("#description").text(cardDescription);

    if (totalAngelsRemaining === 0 || totalPetsRemaining === 0 || totalAccRemaining === 0) {
        if (isEtherAccountActive()) {
            $("#soldOut").show();
        }
    } else {
        $("#getCard").show();
    }
};

var showMetaMaskAlertGetCard = function () {
    $("#getCardContainer").hide();
    $('#modalInstallMetaMask').modal('show');
};

var showMetaMaskAlertWrongNetwork = function () {
    $('#modalWrongNetwork').modal('show');
};

var showMetaMaskAlertNotLoggedIn = function () {
    $('#modalMetaMaskNotLoggedIn').modal('show');
};

var showGetCardContainer = function () {
    $("#getCardContainer").show();
};

var getParameterByName = function (name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
};

var getCardSeriesId = function () {
    return getParameterByName('seriesid');
};

var getCardType = function () {
    return getParameterByName('type');
};

var getAuraString = function (value) {
    if (value === "0") {
        return "Blue";
    } else if (value === "1") {
        return "Yellow";
    } else if (value === "2") {
        return "Purple";
    } else if (value === "3") {
        return "Orange";
    } else if (value === "4") {
        return "Red";
    } else if (value === "5") {
        return "Green";
    }
};

var getCardImage = function () {
    var seriesId = getCardSeriesId();

    if (getCardType() === "angel") {
        if (seriesId === "0") {
            $("#cardImage").attr('src', 'images/Angels/BarakielLarge.svg');
        } else if (seriesId === "1") {
            $("#cardImage").attr('src', 'images/Angels/ZadkielLarge.svg');
        } else if (seriesId === "2") {
            $("#cardImage").attr('src', 'images/Angels/LuciferLarge.svg');
        } else if (seriesId === "3") {
            $("#cardImage").attr('src', 'images/Angels/MichaelLarge.svg');
        } else if (seriesId === "4") {
            $("#cardImage").attr('src', 'images/Angels/ArelLarge.svg');
        } else if (seriesId === "5") {
            $("#cardImage").attr('src', 'images/Angels/RaguelLarge.svg');
        } else if (seriesId === "6") {
            $("#cardImage").attr('src', 'images/Angels/LilithLarge.svg');
        } else if (seriesId === "7") {
            $("#cardImage").attr('src', 'images/Angels/FurlacLarge.svg');
        } else if (seriesId === "8") {
            $("#cardImage").attr('src', 'images/Angels/AzazelLarge.svg');
        } else if (seriesId === "9") {
            $("#cardImage").attr('src', 'images/Angels/ElelethLarge.svg');
        } else if (seriesId === "10") {
            $("#cardImage").attr('src', 'images/Angels/VerinLarge.svg');
        } else if (seriesId === "11") {
            $("#cardImage").attr('src', 'images/Angels/ZiwaLarge.svg');
        } else if (seriesId === "12") {
            $("#cardImage").attr('src', 'images/Angels/CimerielLarge.svg');
        } else if (seriesId === "13") {
            $("#cardImage").attr('src', 'images/Angels/NuminelLarge.svg');
        } else if (seriesId === "14") {
            $("#cardImage").attr('src', 'images/Angels/BatGolLarge.svg');
        } else if (seriesId === "15") {
            $("#cardImage").attr('src', 'images/Angels/GabrielLarge.svg');
        } else if (seriesId === "16") {
            $("#cardImage").attr('src', 'images/Angels/MetatronLarge.svg');
        } else if (seriesId === "17") {
            $("#cardImage").attr('src', 'images/Angels/RafaelLarge.svg');
        } else if (seriesId === "18") {
            $("#cardImage").attr('src', 'images/Angels/MelchezidekLarge.svg');
        } else if (seriesId === "19") {
            $("#cardImage").attr('src', 'images/Angels/SemyazaLarge.svg');
        } else if (seriesId === "20") {
            $("#cardImage").attr('src', 'images/Angels/AbaddonLarge.svg');
        } else if (seriesId === "21") {
            $("#cardImage").attr('src', 'images/Angels/BaalzebubLarge.svg');
        } else if (seriesId === "22") {
            $("#cardImage").attr('src', 'images/Angels/BenNezLarge.svg');
        } else if (seriesId === "23") {
            $("#cardImage").attr('src', 'images/Angels/JophielLarge.svg');
        }
    } else if (getCardType() === "pet") {
        if (seriesId === "1") {
            $("#cardImage").attr('src', 'images/Pets/GeckoLarge.svg');
        } else if (seriesId === "2") {
            $("#cardImage").attr('src', 'images/Pets/ParakeetLarge.svg');
        } else if (seriesId === "3") {
            $("#cardImage").attr('src', 'images/Pets/AngryKittyLarge.svg');
        } else if (seriesId === "4") {
            $("#cardImage").attr('src', 'images/Pets/HorseLarge.svg');
        }
    } else if (getCardType() === "acc") {
        if (seriesId === "1") {
            $("#cardImage").attr('src', 'images/Accessories/LeatherBracerSimple.png');
        } else if (seriesId === "2") {
            $("#cardImage").attr('src', 'images/Accessories/MetalBracersSimple.png');
        } else if (seriesId === "3") {
            $("#cardImage").attr('src', 'images/Accessories/ScholarsScrollSimple.png');
        } else if (seriesId === "4") {
            $("#cardImage").attr('src', 'images/Accessories/CosmicScrollSimple.png');
        } else if (seriesId === "5") {
            $("#cardImage").attr('src', 'images/Accessories/4LeafCloverSimple.png');
        } else if (seriesId === "6") {
            $("#cardImage").attr('src', 'images/Accessories/7LeafCloverSimple.png');
        } else if (seriesId === "7") {
            $("#cardImage").attr('src', 'images/Accessories/RedCollarSimple.png');
        } else if (seriesId === "8") {
            $("#cardImage").attr('src', 'images/Accessories/RubyCollarSimple.png');
        } else if (seriesId === "9") {
            $("#cardImage").attr('src', 'images/Accessories/YellowCollarSimple.png');
        } else if (seriesId === "10") {
            $("#cardImage").attr('src', 'images/Accessories/CitrineCollarSimple.png');
        } else if (seriesId === "11") {
            $("#cardImage").attr('src', 'images/Accessories/BlueCollarSimple.png');
        } else if (seriesId === "12") {
            $("#cardImage").attr('src', 'images/Accessories/SapphireCollarSimple.png');
        } else if (seriesId === "13") {
            $("#cardImage").attr('src', 'images/Accessories/CarrotsSimple.png');
        } else if (seriesId === "14") {
            $("#cardImage").attr('src', 'images/Accessories/CricketSimple.png');
        } else if (seriesId === "15") {
            $("#cardImage").attr('src', 'images/Accessories/BirdSeedSimple.png');
        } else if (seriesId === "16") {
            $("#cardImage").attr('src', 'images/Accessories/CatNipSimple.png');
        } else if (seriesId === "17") {
            $("#cardImage").attr('src', 'images/Accessories/LightningRodSimple.png');
        } else if (seriesId === "18") {
            $("#cardImage").attr('src', 'images/Accessories/HolyLightSimple.png');
        }
    }
};

var showCardBought = function () {
    // show correct buttons
    var cardType = getCardType();
    if (cardType === "angel") {
        if (getCardSeriesId() === "0") {
            $("#freeAngel").show();
            $("#freeAngelTip").show();
        }
        $("#getPets").show();
    } else if (cardType === "pet") {
        $("#getAccessories").show();
        $("#getAnotherPet").show();
    } else if (cardType === "acc") {
        $("#goToMyTeam").show();
    }

    $("#cardBoughtContainer").show();
    $("#getCardContainer").hide();
};

//******* Contract functions **********//

var angelCardSeriesDict = {
    "angelCardSeriesId": 0,
    "currentAngelTotal": 0,
    "basePrice": 0,
    "maxAngelTotal": 0,
    "baseAura": 0,
    "baseBattlePower": 0,
    "lastSellTime": 0,
    "liveTime": 0
};

var petCardSeriesDict = {
    "petCardSeriesId": 0,
    "currentPetTotal": 0,
    "maxPetTotal": 0
};

var accessorySeriesDict = {
    "accessorySeriesId": 0,
    "currentTotal": 0,
    "maxTotal": 0,
    "price": 0
};

var getAngelCardSeries = function (callbackFun) {
    angelCardDataContractInstance.getAngelCardSeries(getCardSeriesId(), function (err, result) {
        if (err) {
            console.log("ERROR_LOG|getAngelCardSeries_txn_fail|error=" + err);
            //callbackFun(RESULT_CODE.ERROR_SERVER, {
            //    "error": "blockchain transaction fail!!"
            //});
            alert("error 1");
        } else {
            angelCardSeriesDict["angelCardSeriesId"] = result[0].toNumber();
            angelCardSeriesDict["currentAngelTotal"] = result[1].toNumber();
            angelCardSeriesDict["basePrice"] = Number(web3.fromWei(result[2], 'ether'));
            angelCardSeriesDict["maxAngelTotal"] = result[3].toNumber();
            angelCardSeriesDict["baseAura"] = result[4].toNumber();
            angelCardSeriesDict["baseBattlePower"] = result[5].toNumber();
            angelCardSeriesDict["lastSellTime"] = result[6].toNumber();
            angelCardSeriesDict["liveTime"] = result[7].toNumber();

            callbackFun(angelCardSeriesDict);
        }
    });
};

var getPetCardSeries = function (callbackFun) {
    petCardDataContractInstance.getPetCardSeries(getCardSeriesId(), function (err, result) {
        if (err) {
            console.log("ERROR_LOG|getAngelCardSeries_txn_fail|error=" + err);
            //callbackFun(RESULT_CODE.ERROR_SERVER, {
            //    "error": "blockchain transaction fail!!"
            //});
        } else {
            petCardSeriesDict["petCardSeriesId"] = result[0].toNumber();
            petCardSeriesDict["currentPetTotal"] = result[1].toNumber();
            petCardSeriesDict["maxPetTotal"] = result[2].toNumber();

            callbackFun(petCardSeriesDict);
        }
    });
};

var getAccessorySeries = function (callbackFun) {
    accessoryDataContractInstance.getAccessorySeries(getCardSeriesId(), function (err, result) {
        if (err) {
            console.log("ERROR_LOG|getAngelCardSeries_txn_fail|error=" + err);
            //callbackFun(RESULT_CODE.ERROR_SERVER, {
            //    "error": "blockchain transaction fail!!"
            //});
        } else {
            accessorySeriesDict["accessorySeriesId"] = result[0].toNumber();
            accessorySeriesDict["currentTotal"] = result[1].toNumber();
            accessorySeriesDict["maxTotal"] = result[2].toNumber();
            accessorySeriesDict["price"] = Number(web3.fromWei(result[3], 'ether'));

            callbackFun(accessorySeriesDict);
        }
    });
};

var createAngel = function () {
    realmContractInstance.createAngel(getCardSeriesId(), { value: web3.toWei(angelCardSeriesDict["basePrice"].toString(), 'ether'), gas: 250000 }, function (err, txhash) {
        if (err) {
            console.log("ERROR_LOG|createAngel_txn_fail|error=" + err);
            //callbackFun(RESULT_CODE.ERROR_SERVER, {
            //    "error": "blockchain transaction fail!!"
            //});
        } else {
            //callbackFun(RESULT_CODE.SUCCESS, { "txn_hash": txhash })
            showCardBought();
        }
    });
};

var createPet = function () {
    var petName = $("#petName").val();
    realmContractInstance.createPet(getCardSeriesId(), petName, { value: web3.toWei("0", 'ether'), gas: 250000 }, function (err, txhash) {
        if (err) {
            console.log("ERROR_LOG|createAngel_txn_fail|error=" + err);
            //callbackFun(RESULT_CODE.ERROR_SERVER, {
            //    "error": "blockchain transaction fail!!"
            //});
        } else {
            //callbackFun(RESULT_CODE.SUCCESS, { "txn_hash": txhash })
            showCardBought();
        }
    });
};

var createAccessory = function () {
    realmContractInstance.createAccessory(getCardSeriesId(), { value: web3.toWei(accessorySeriesDict["price"].toString(), 'ether'), gas: 250000 }, function (err, txhash) {
        if (err) {
            console.log("ERROR_LOG|createAngel_txn_fail|error=" + err);
            //callbackFun(RESULT_CODE.ERROR_SERVER, {
            //    "error": "blockchain transaction fail!!"
            //});
        } else {
            //callbackFun(RESULT_CODE.SUCCESS, { "txn_hash": txhash })
            showCardBought();
        }
    });
};