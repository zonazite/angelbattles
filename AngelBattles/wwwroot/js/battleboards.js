$(document).ready(function () {
    // Setup buttons
    setupCardButtons();

    $("#angelToBattle").on("click", function (event) {
        event.stopImmediatePropagation();
        event.preventDefault();

        chooseAngel();
    });

    $("#petToBattle").on("click", function (event) {
        event.stopImmediatePropagation();
        event.preventDefault();

        choosePet();
    });

    $("#accessoryToBattle").on("click", function (event) {
        event.stopImmediatePropagation();
        event.preventDefault();

        chooseAccessory();
    });

    $("#goToAddAnotherTeammate").on("click", function (event) {
        event.stopImmediatePropagation();
        event.preventDefault();

        $("#addTeamCompleted").hide();
        $("#battleboardGuideText").fadeIn();

        resetVsContainer();
        buildTeam(battleboardId);
    });
});

// Global Variables
var rpcConnected = null;
var account = undefined;
var battleboardDict = [];
var battleboardTurns = [];
var totalBattleboards = 0;
var angelDict = [];
var petDict = [];
var accessoryDict = [];
var ownersAngelsInPlayDict = [];
var ownersPetsInPlayDict = [];
var ownersAccInPlayDict = [];
var needAngelCards = false;
var needPetCards = false;
var needAccessoryCards = false;
var restrictcardseriesid = -1;
var teamToAddTo = -1;
var battleboardId = -1;

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
                    if (account) {
                        web3.eth.defaultAccount = account;
                    } else {
                        showMetaMaskAlertNotLoggedIn();
                    }
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
    } else {
        showMetaMaskAlert();
        account = null;
    }

    // init contract
    battleboardDataContractInstance = getBattleboardDataContractInstance();
    battleboardManageContractInstance = getBattleboardManageContractInstance();
    battleboardsContactInstance = getBattleboardsContractInstance();
    angelCardDataContractInstance = getAngelCardDataContractInstance();
    petCardDataContractInstance = getPetCardDataContractInstance();
    accessoryDataContractInstance = getAccessoryDataContractInstance();

    // Call Contract Read Functions
    if (rpcConnected) {
        loadBattleboards();

        setupEvents();
    }
});

//*********** Helper Functions *************//

//--------- Angels -----------//
var getOwnerAngelCount = function (ownerAddress, callbackFun) {
    if (!web3.isAddress(ownerAddress)) {
        console.log("invalid_address|address=" + ownerAddress);
        //callbackFun(RESULT_CODE.ERROR_PARAMS, { "error": "the address is invalid" });
        return;
    }

    angelCardDataContractInstance.getOwnerAngelCount(ownerAddress, function (err, result) {
        if (err) {
            console.log("ERROR_LOG|getAngelCardSeries_txn_fail|error=" + err);
            //callbackFun(RESULT_CODE.ERROR_SERVER, {
            //    "error": "blockchain call failed, error=" + err
            //});
        } else {
            var value = result.toNumber();
            if (value > 0)
                value = Number(value);
            console.log("INFO_LOG|getOwnerAngelCount|value=" + value);
            callbackFun({ "value": value });
        }
    });
};


var getAngelByIndex = function (_, callbackFun) {

    getOwnerAngelCount(account, getAngels);

    function getAngels(value, callbackFun2) {
        var count = value["value"];
        var responseCount = 0;

        function collectAngelResponse() {
            if (responseCount === count) {
                callbackFun(angelDict);
            }
        }

        if (count > 0) {
            var i;
            for (i = 0; i < count; i++) {
                angelCardDataContractInstance.getAngelByIndex(account, i, function (err, result) {
                    if (err) {
                        console.log("ERROR_LOG|getAngelByIndex_txn_fail|error=" + err);
                        //callbackFun(RESULT_CODE.ERROR_SERVER, {
                        //    "error": "blockchain call failed, error=" + err
                        //});
                    } else {
                        var value = Number(result);
                        console.log("INFO_LOG|getOwnerAngelCount|value=" + value);

                        angelCardDataContractInstance.getAngel(value, function (err2, result2) {
                            if (err2) {
                                console.log("ERROR_LOG|getAngel_txn_fail|error=" + err2);
                                //callbackFun(RESULT_CODE.ERROR_SERVER, {
                                //    "error": "blockchain call failed, error=" + err
                                //});
                            } else {
                                responseCount += 1;

                                var angelId = result2[0].toNumber();
                                var angelCardSeriesId = result2[1].toNumber();
                                var battlePower = result2[2].toNumber();
                                var aura = result2[3].toNumber();
                                var experience = result2[4].toNumber();
                                var price = result2[5].toNumber();
                                if (price > 0)
                                    price = Number(web3.fromWei(price, 'ether'));
                                var createdTime = result2[6].toString();
                                var lastBattleTime = result2[7].toString();
                                var lastVsBattleTime = result2[8].toString();
                                var lastBattleResult = result2[9].toNumber();
                                var owner = result2[10].toString();

                                // Add to the collection only the angels that the owner owns
                                if (owner === account) {
                                    angelDict.push({
                                        "angelId": angelId,
                                        "angelCardSeriesId": angelCardSeriesId,
                                        "battlePower": battlePower,
                                        "aura": aura,
                                        "experience": experience,
                                        "price": price,
                                        "createdTime": createdTime,
                                        "lastBattleTime": lastBattleTime,
                                        "lastVsBattleTime": lastVsBattleTime,
                                        "lastBattleResult": lastBattleResult,
                                        "owner": owner
                                    });
                                }

                                collectAngelResponse();
                            }
                        });
                    }
                });
            }
        } else {
            needAngelCards = true;
        }
    }
};

//******* PETS *********************//
var getOwnerPetCount = function (ownerAddress, callbackFun) {
    if (!web3.isAddress(ownerAddress)) {
        console.log("invalid_address|address=" + ownerAddress);
        //callbackFun(RESULT_CODE.ERROR_PARAMS, { "error": "the address is invalid" });
        return;
    }

    petCardDataContractInstance.getOwnerPetCount(ownerAddress, function (err, result) {
        if (err) {
            console.log("ERROR_LOG|getOwnerPetCount_txn_fail|error=" + err);
            //callbackFun(RESULT_CODE.ERROR_SERVER, {
            //    "error": "blockchain call failed, error=" + err
            //});
        } else {
            var value = result.toNumber();
            if (value > 0)
                value = Number(value);
            console.log("INFO_LOG|getOwnerPetCount|value=" + value);
            callbackFun({ "value": value });
        }
    });
};

var getPetByIndex = function (_, callbackFun) {

    getOwnerPetCount(account, getPets);

    function getPets(value, callbackFun2) {
        var count = value["value"];
        var responseCount = 0;

        function collectPetResponse() {
            if (responseCount === count) {
                callbackFun(petDict);
            }
        }

        if (count > 0) {
            var i;
            for (i = 0; i < count; i++) {
                petCardDataContractInstance.getPetByIndex(account, i, function (err, result) {
                    if (err) {
                        console.log("ERROR_LOG|getPetByIndex_txn_fail|error=" + err);
                        //callbackFun(RESULT_CODE.ERROR_SERVER, {
                        //    "error": "blockchain call failed, error=" + err
                        //});
                    } else {
                        var value = Number(result);
                        console.log("INFO_LOG|getOwnerPetCount|value=" + value);

                        petCardDataContractInstance.getPet(value, function (err2, result2) {
                            if (err2) {
                                console.log("ERROR_LOG|getPet_txn_fail|error=" + err2);
                                //callbackFun(RESULT_CODE.ERROR_SERVER, {
                                //    "error": "blockchain call failed, error=" + err
                                //});
                            } else {
                                responseCount += 1;

                                var petId = result2[0].toNumber();
                                var petCardSeriesId = result2[1].toNumber();
                                var name = result2[2].toString();
                                var luck = result2[3].toNumber();
                                var auraRed = result2[4].toNumber();
                                var auraBlue = result2[5].toNumber();
                                var auraYellow = result2[6].toNumber();
                                var lastTrainingTime = result2[7].toString();
                                var lastBreedingTime = result2[8].toString();
                                var owner = result2[9].toString();

                                // Add to the collection only the pets that the owner owns
                                if (owner === account) {
                                    petDict.push({
                                        "petId": petId,
                                        "petCardSeriesId": petCardSeriesId,
                                        "name": name,
                                        "luck": luck,
                                        "auraRed": auraRed,
                                        "auraBlue": auraBlue,
                                        "auraYellow": auraYellow,
                                        "lastTrainingTime": lastTrainingTime,
                                        "lastBreedingTime": lastBreedingTime,
                                        "owner": owner
                                    });
                                }

                                collectPetResponse();
                            }
                        });
                    }
                });
            }
        } else {
            needPetCards = true;
        }
    }
};

//******* ACCESSORIES *********************//
var getOwnerAccessoryCount = function (ownerAddress, callbackFun) {
    if (!web3.isAddress(ownerAddress)) {
        console.log("invalid_address|address=" + ownerAddress);
        //callbackFun(RESULT_CODE.ERROR_PARAMS, { "error": "the address is invalid" });
        return;
    }

    accessoryDataContractInstance.getOwnerAccessoryCount(ownerAddress, function (err, result) {
        if (err) {
            console.log("ERROR_LOG|getOwnerAccessoryCount_txn_fail|error=" + err);
            //callbackFun(RESULT_CODE.ERROR_SERVER, {
            //    "error": "blockchain call failed, error=" + err
            //});
        } else {
            var value = result.toNumber();
            if (value > 0)
                value = Number(value);
            console.log("INFO_LOG|getOwnerAccessoryCount|value=" + value);
            callbackFun({ "value": value });
        }
    });
};

var getAccessoryByIndex = function (_, callbackFun) {

    getOwnerAccessoryCount(account, getAccessories);

    function getAccessories(value, callbackFun2) {
        var count = value["value"];
        var responseCount = 0;

        function collectAccessoryResponse() {
            if (responseCount === count) {
                callbackFun(accessoryDict);
            }
        }

        if (count > 0) {
            var i;
            for (i = 0; i < count; i++) {
                accessoryDataContractInstance.getAccessoryByIndex(account, i, function (err, result) {
                    if (err) {
                        console.log("ERROR_LOG|getAccessoryByIndex_txn_fail|error=" + err);
                        //callbackFun(RESULT_CODE.ERROR_SERVER, {
                        //    "error": "blockchain call failed, error=" + err
                        //});
                    } else {
                        var value = Number(result);
                        console.log("INFO_LOG|getOwnerAccessoryCount|value=" + value);

                        accessoryDataContractInstance.getAccessory(value, function (err2, result2) {
                            if (err2) {
                                console.log("ERROR_LOG|getAccessory_txn_fail|error=" + err2);
                                //callbackFun(RESULT_CODE.ERROR_SERVER, {
                                //    "error": "blockchain call failed, error=" + err
                                //});
                            } else {
                                responseCount += 1;

                                var accessoryID = result2[0].toNumber();
                                var accessorySeriesID = result2[1].toNumber();
                                var owner = result2[2].toString();

                                // Add to the collection only the pets that the owner owns
                                if (owner === account) {
                                    accessoryDict.push({
                                        "accessoryId": accessoryID,
                                        "accessorySeriesId": accessorySeriesID,
                                        "owner": owner
                                    });
                                }

                                collectAccessoryResponse();
                            }
                        });
                    }
                });
            }
        } else {
            needAccessoryCards = true;
        }
    }
};

function DisplayAngelCards(value) {
    // Load all the cards
    $.ajax({
        dataType: 'html',
        type: 'POST',
        url: '/Leaderboard/GetAngelCardRows',
        data: { AngelsList: value },
        success: function (response) {
            $('#angelsContainer').html(response);

            // Show resting if cookie is set
            $("#angelsContainer .angel-battle-card").not(".in-battle").each(function () {
                var angelid = $(this).data("angelid");
                var isInBattle = Cookies.get("angelVsBattle:" + angelid.toString());
                if (isInBattle === "pending") {
                    $(this).find("#inBattleWarn").show();
                    $(this).removeClass("hand-cursor").addClass("no-pointers-events");
                }
            });

            // Remove cookie
            $("#angelsContainer .angel-battle-card.in-battle").each(function () {
                var angelid = $(this).data("angelid");
                var isInBattle = Cookies.get("angelVsBattle:" + angelid);
                if (isInBattle === "pending") {
                    Cookies.remove("angelVsBattle:" + angelid.toString());
                }
            });

            // on the angel card click add them to the training container
            $("#angelsContainer .angel-battle-card").on("click", function (event) {
                event.stopImmediatePropagation();
                event.preventDefault();

                var $item = $(this);

                if (!$item.hasClass("in-battle")) {
                    $("#chooseAngel").hide();
                    $("#angelToBattle").show();
                    // Fill AngelToBattle card
                    var imageSrc = getCardSeriesSimpleImageSrc("angel", $item.data("angelcardseriesid").toString());
                    $("#angelImageVsBattle").attr('src', imageSrc).show();
                    $("#angelBPVsBattle").text($item.find("#angelCardRowBP").text());
                    $("#angelEXPVsBattle").text($item.find("#angelCardRowEXP").text());
                    $("#angelAuraGemVsBattle").attr("src", $item.find("#angelCardRowAuraGem").attr("src"));

                    $("#angelToBattle").attr("data-angelid", $item.data("angelid"));

                    $("#angelsContainer").fadeOut(200, function () {
                        $("#vsContainer").fadeIn(200);
                        $("#choosePetText").show();
                        $("#choosePet").addClass("hand-cursor");
                    });
                }
            });
        },
        failure: function (response) {
            console.log('INFO_LOG|GetAngelCardRows response failed');
        }
    });

    // Barakiel only cards
    $.ajax({
        dataType: 'html',
        type: 'POST',
        url: '/Leaderboard/GetAngelCardRowsLimitCardSeriesId',
        data: { AngelsList: value, limitCardSeriesId: 0 },
        success: function (response) {
            $('#angelsBarakielOnlyContainerCards').html(response);

            // Show resting if cookie is set
            $("#angelsBarakielOnlyContainer .angel-battle-card").not(".in-battle").each(function () {
                var angelid = $(this).data("angelid");
                var isInBattle = Cookies.get("angelVsBattle:" + angelid.toString());
                if (isInBattle === "pending") {
                    $(this).find("#inBattleWarn").show();
                    $(this).removeClass("hand-cursor").addClass("no-pointers-events");
                }
            });

            // Remove cookie
            $("#angelsBarakielOnlyContainer .angel-battle-card.in-battle").each(function () {
                var angelid = $(this).data("angelid");
                var isInBattle = Cookies.get("angelVsBattle:" + angelid);
                if (isInBattle === "pending") {
                    Cookies.remove("angelVsBattle:" + angelid.toString());
                }
            });

            // on the angel card click add them to the training container
            $("#angelsBarakielOnlyContainer .angel-battle-card").on("click", function (event) {
                event.stopImmediatePropagation();
                event.preventDefault();

                var $item = $(this);

                if (!$item.hasClass("in-battle")) {
                    $("#chooseAngel").hide();
                    $("#angelToBattle").show();
                    // Fill AngelToBattle card
                    var imageSrc = getCardSeriesSimpleImageSrc("angel", $item.data("angelcardseriesid").toString());
                    $("#angelImageVsBattle").attr('src', imageSrc).show();
                    $("#angelBPVsBattle").text($item.find("#angelCardRowBP").text());
                    $("#angelEXPVsBattle").text($item.find("#angelCardRowEXP").text());
                    $("#angelAuraGemVsBattle").attr("src", $item.find("#angelCardRowAuraGem").attr("src"));

                    $("#angelToBattle").attr("data-angelid", $item.data("angelid"));

                    $("#angelsBarakielOnlyContainer").fadeOut(200, function () {
                        $("#vsContainer").fadeIn(200);
                        $("#choosePetText").show();
                        $("#choosePet").addClass("hand-cursor");
                    });
                }
            });
        },
        failure: function (response) {
            console.log('INFO_LOG|GetAngelCardRows response failed');
        }
    });

    // Azazel only cards
    $.ajax({
        dataType: 'html',
        type: 'POST',
        url: '/Leaderboard/GetAngelCardRowsLimitCardSeriesId',
        data: { AngelsList: value, limitCardSeriesId: 1 },
        success: function (response) {
            $('#angelsAzaelAndBelowContainerCards').html(response);

            // Show resting if cookie is set
            $("#angelsAzaelAndBelowContainer .angel-battle-card").not(".in-battle").each(function () {
                var angelid = $(this).data("angelid");
                var isInBattle = Cookies.get("angelVsBattle:" + angelid.toString());
                if (isInBattle === "pending") {
                    $(this).find("#inBattleWarn").show();
                    $(this).removeClass("hand-cursor").addClass("no-pointers-events");
                }
            });

            // Remove cookie
            $("#angelsAzaelAndBelowContainer .angel-battle-card.in-battle").each(function () {
                var angelid = $(this).data("angelid");
                var isInBattle = Cookies.get("angelVsBattle:" + angelid);
                if (isInBattle === "pending") {
                    Cookies.remove("angelVsBattle:" + angelid.toString());
                }
            });

            // on the angel card click add them to the training container
            $("#angelsAzaelAndBelowContainer .angel-battle-card").on("click", function (event) {
                event.stopImmediatePropagation();
                event.preventDefault();

                var $item = $(this);

                if (!$item.hasClass("in-battle")) {
                    $("#chooseAngel").hide();
                    $("#angelToBattle").show();
                    // Fill AngelToBattle card
                    var imageSrc = getCardSeriesSimpleImageSrc("angel", $item.data("angelcardseriesid").toString());
                    $("#angelImageVsBattle").attr('src', imageSrc).show();
                    $("#angelBPVsBattle").text($item.find("#angelCardRowBP").text());
                    $("#angelEXPVsBattle").text($item.find("#angelCardRowEXP").text());
                    $("#angelAuraGemVsBattle").attr("src", $item.find("#angelCardRowAuraGem").attr("src"));

                    $("#angelToBattle").attr("data-angelid", $item.data("angelid"));

                    $("#angelsAzaelAndBelowContainer").fadeOut(200, function () {
                        $("#vsContainer").fadeIn(200);
                        $("#choosePetText").show();
                        $("#choosePet").addClass("hand-cursor");
                    });
                }
            });
        },
        failure: function (response) {
            console.log('INFO_LOG|GetAngelCardRows response failed');
        }
    });

    // Gabriel only cards
    $.ajax({
        dataType: 'html',
        type: 'POST',
        url: '/Leaderboard/GetAngelCardRowsLimitCardSeriesId',
        data: { AngelsList: value, limitCardSeriesId: 2 },
        success: function (response) {
            $('#angelsGabrielAndBelowContainerCards').html(response);

            // Show resting if cookie is set
            $("#angelsGabrielAndBelowContainer .angel-battle-card").not(".in-battle").each(function () {
                var angelid = $(this).data("angelid");
                var isInBattle = Cookies.get("angelVsBattle:" + angelid.toString());
                if (isInBattle === "pending") {
                    $(this).find("#inBattleWarn").show();
                    $(this).removeClass("hand-cursor").addClass("no-pointers-events");
                }
            });

            // Remove cookie
            $("#angelsGabrielAndBelowContainer .angel-battle-card.in-battle").each(function () {
                var angelid = $(this).data("angelid");
                var isInBattle = Cookies.get("angelVsBattle:" + angelid);
                if (isInBattle === "pending") {
                    Cookies.remove("angelVsBattle:" + angelid.toString());
                }
            });

            // on the angel card click add them to the training container
            $("#angelsGabrielAndBelowContainer .angel-battle-card").on("click", function (event) {
                event.stopImmediatePropagation();
                event.preventDefault();

                var $item = $(this);

                if (!$item.hasClass("in-battle")) {
                    $("#chooseAngel").hide();
                    $("#angelToBattle").show();
                    // Fill AngelToBattle card
                    var imageSrc = getCardSeriesSimpleImageSrc("angel", $item.data("angelcardseriesid").toString());
                    $("#angelImageVsBattle").attr('src', imageSrc).show();
                    $("#angelBPVsBattle").text($item.find("#angelCardRowBP").text());
                    $("#angelEXPVsBattle").text($item.find("#angelCardRowEXP").text());
                    $("#angelAuraGemVsBattle").attr("src", $item.find("#angelCardRowAuraGem").attr("src"));

                    $("#angelToBattle").attr("data-angelid", $item.data("angelid"));

                    $("#angelsGabrielAndBelowContainer").fadeOut(200, function () {
                        $("#vsContainer").fadeIn(200);
                        $("#choosePetText").show();
                        $("#choosePet").addClass("hand-cursor");
                    });
                }
            });
        },
        failure: function (response) {
            console.log('INFO_LOG|GetAngelCardRows response failed');
        }
    });

    // Melchizedek only cards
    $.ajax({
        dataType: 'html',
        type: 'POST',
        url: '/Leaderboard/GetAngelCardRowsLimitCardSeriesId',
        data: { AngelsList: value, limitCardSeriesId: 2 },
        success: function (response) {
            $('#angelsMelchizedekAndBelowContainerCards').html(response);

            // Show resting if cookie is set
            $("#angelsMelchizedekAndBelowContainer .angel-battle-card").not(".in-battle").each(function () {
                var angelid = $(this).data("angelid");
                var isInBattle = Cookies.get("angelVsBattle:" + angelid.toString());
                if (isInBattle === "pending") {
                    $(this).find("#inBattleWarn").show();
                    $(this).removeClass("hand-cursor").addClass("no-pointers-events");
                }
            });

            // Remove cookie
            $("#angelsMelchizedekAndBelowContainer .angel-battle-card.in-battle").each(function () {
                var angelid = $(this).data("angelid");
                var isInBattle = Cookies.get("angelVsBattle:" + angelid);
                if (isInBattle === "pending") {
                    Cookies.remove("angelVsBattle:" + angelid.toString());
                }
            });

            // on the angel card click add them to the training container
            $("#angelsMelchizedekAndBelowContainer .angel-battle-card").on("click", function (event) {
                event.stopImmediatePropagation();
                event.preventDefault();

                var $item = $(this);

                if (!$item.hasClass("in-battle")) {
                    $("#chooseAngel").hide();
                    $("#angelToBattle").show();
                    // Fill AngelToBattle card
                    var imageSrc = getCardSeriesSimpleImageSrc("angel", $item.data("angelcardseriesid").toString());
                    $("#angelImageVsBattle").attr('src', imageSrc).show();
                    $("#angelBPVsBattle").text($item.find("#angelCardRowBP").text());
                    $("#angelEXPVsBattle").text($item.find("#angelCardRowEXP").text());
                    $("#angelAuraGemVsBattle").attr("src", $item.find("#angelCardRowAuraGem").attr("src"));

                    $("#angelToBattle").attr("data-angelid", $item.data("angelid"));

                    $("#angelsMelchizedekAndBelowContainer").fadeOut(200, function () {
                        $("#vsContainer").fadeIn(200);
                        $("#choosePetText").show();
                        $("#choosePet").addClass("hand-cursor");
                    });
                }
            });
        },
        failure: function (response) {
            console.log('INFO_LOG|GetAngelCardRows response failed');
        }
    });
};

function DisplayPetCards(value) {
    var size = 96;
    for (var i = 0; i < value.length; i += size) {
        var smallarray = value.slice(i, i + size);

        var pets = {
            PetsList: smallarray
        };

        $.ajax({
            dataType: 'html',
            type: 'POST',
            url: '/Leaderboard/GetPetCardRows',
            data: pets,
            success: function (response) {
                $('#petsContainer').append(response);

                // on the pet card click add them to the training container
                $(".pet-battle-card").on("click", function (event) {
                    event.stopImmediatePropagation();
                    event.preventDefault();

                    var $item = $(this);

                    $("#choosePet").hide();
                    $("#petToBattle").show();
                    // Fill PetToBattle card
                    var imageSrc = getCardSeriesSimpleImageSrc("pet", $item.data("petcardseriesid").toString(), isGoldCard("pet", $item.data("petcardseriesid").toString(), $item.data("petid").toString()));
                    $("#petImageVsBattle").attr('src', imageSrc).show();
                    $("#petLuckVsBattle").text($item.find("#petCardRowLuck").text());
                    $("#petRedAuraVsBattle").text($item.find("#petCardRowAuraRed").text());
                    $("#petBlueAuraVsBattle").text($item.find("#petCardRowAuraBlue").text());
                    $("#petYellowAuraVsBattle").text($item.find("#petCardRowAuraYellow").text());

                    $("#petToBattle").attr("data-petid", $item.data("petid"));

                    $("#petsContainer").fadeOut(200, function () {
                        $("#vsContainer").fadeIn(200);
                        $("#chooseAccessoryText").show();
                        $("#skipAccessory").show();
                        $("#chooseAccessory").addClass("hand-cursor");

                        // Wire up skip accessory click
                        $(".skip-accessory").on("click", function (event) {
                            event.stopImmediatePropagation();
                            event.preventDefault();

                            $("#warnNoCardsFoundAccessory").hide();
                            $("#accessoriesContainer").hide();
                            $("#vsContainer").show();

                            showAddTeam();
                        });
                    });

                    $("#petToBattle").attr("data-petid", $item.data("petid"));
                });
            },
            failure: function (response) {
                console.log('INFO_LOG|GetPetCardRows response failed');
            }
        });
    }
};

function DisplayAccessoryCards(value) {
    // Load all the cards
    var accessories = {
        AccessoriesList: value
    };

    $.ajax({
        dataType: 'html',
        type: 'POST',
        url: '/Leaderboard/GetAccessoryCardRows',
        data: accessories,
        success: function (response) {
            $('#accessoriesContainer').html(response);

            // on the pet card click add them to the training container
            $(".accessory-battle-card").on("click", function (event) {
                event.stopImmediatePropagation();
                event.preventDefault();

                var $item = $(this);

                $("#chooseAccessory").hide();
                $("#accessoryToBattle").show();
                // Fill AccessoryToBattle card
                var imageSrc = getCardSeriesSimpleImageSrc("acc", $item.data("accessorycardseriesid").toString());
                $("#accessoryImageVsBattle").attr('src', imageSrc);
                $("#accessoryTextVsBattle").text($item.find("#accessoryCardRowDescription").text());

                showAddTeam();

                $("#accessoriesContainer").fadeOut(200);

                $("#accessoryImage").fadeOut(200, function () {
                }).fadeIn(200);

                $("#accessoryToBattle").attr("data-accessoryid", $item.data("accessoryid"));
            });

            $("#skipAccessorySelection").on("click", function (event) {
                event.stopImmediatePropagation();
                event.preventDefault();

                showAddTeam();
            });
        },
        failure: function (response) {
            console.log('INFO_LOG|GetAccessoryCardRows response failed');
        }
    });
};

var loadBattleboards = function () {
    $("#loader").fadeIn();

    loadBattleboardsMenu(null, displayBattleboardRows);

    getAngelByIndex(null, DisplayAngelCards);
    getPetByIndex(null, DisplayPetCards);
    getAccessoryByIndex(null, DisplayAccessoryCards);
};

var displayBattleboardRows = function (value, value2) {
    // Load all the battleboard rows
    var battleboards = {
        BattleboardList: value, 
        BattleboardTurnList: value2
    };

    $.ajax({
        dataType: 'html',
        type: 'POST',
        url: '/BattleBoards/GetBattleBoardRows',
        data: battleboards,
        success: function (response) {
            $("#openBattleBoardButtons").fadeIn();
            $("#loader").hide();

            $('#statusBoardContainer').empty().html(response);
            //$('#sponsoredContainer').fadeIn();

            //// Setup logic for the Challenge Last Position button
            //setupChallengeLastPositionButton();

            //// Show claim metal

            //loadEachTeamName();
            //loadEachTeamAngel();
            //loadEachTeamPet();
            //loadEachTeamAccessory();
            //loadEachLeaderboardEndTime();
        },
        failure: function (response) {
            $("#warnNoCardsFound").show();
        }
    });
};

var loadBattleboardsMenu = function (_, callbackFun) {

    getTotalBattleboards(getBattleboardData);

    async function getBattleboardData(value, callbackFun2) {
        totalBattleboards = value["value"];

        // reset the dictionarys
        battleboardDict = [];
        battleboardTurns = [];

        if (totalBattleboards > 0) {
            var i;
            for (i = 0; i < totalBattleboards; i++) {
                promises.push(processGetBattleboardByPosition(i));
            }
            await Promise.all(promises);

            for (i = 0; i < totalBattleboards; i++) {
                promisesTurnByPosition.push(processGetBattleboardTurnByPosition(i));
            }
            await Promise.all(promisesTurnByPosition);

            // Return the lists out
            callbackFun(battleboardDict, battleboardTurns);
        } else {
            $("#statusBoardContainer").hide();
        }
    }
};

var promises = [];
var processGetBattleboardByPosition = function (i) {
    return new Promise(
        function (resolve, reject) {
            battleboardDataContractInstance.getBattleboard(i, function (err, result) {
                if (err) {
                    console.log("ERROR_LOG|getBattleboard_txn_fail|error=" + err);
                    reject(err);
                    //callbackFun(RESULT_CODE.ERROR_SERVER, {
                    //    "error": "blockchain call failed, error=" + err
                    //});
                } else {

                    var turn = result[0].toNumber();
                    var isLive = result[1].toString();
                    var prize = web3.fromWei(result[2].toString(), 'ether');
                    var numTeams = result[3].toNumber();
                    var numTiles = result[4].toNumber();
                    var createdBarriers = result[5].toNumber();
                    var restrictions = result[6].toNumber();
                    var lastMoveTime = result[7].toNumber();
                    var numTeams1 = result[8].toNumber();
                    var numTeams2 = result[9].toNumber();
                    var monster1 = result[10].toNumber();
                    var monster2 = result[11].toNumber();

                    resolve(battleboardDict.push({
                        "battleboardId": i,
                        "turn": turn,
                        "isLive": isLive,
                        "prize": prize,
                        "numTeams": numTeams,
                        "numTiles": numTiles,
                        "createdBarriers": createdBarriers,
                        "restrictions": restrictions,
                        "lastMoveTime": lastMoveTime,
                        "numTeams1": numTeams1,
                        "numTeams2": numTeams2,
                        "monster1": monster1,
                        "monster2": monster2
                    }));
                }
            });
        }
    );
};

var promisesTurnByPosition = [];
var processGetBattleboardTurnByPosition = function (i) {
    return new Promise(
        function (resolve, reject) {
            battleboardDataContractInstance.getTurn(i, function (err, result) {
                if (err) {
                    console.log("ERROR_LOG|getTurn_txn_fail|error=" + err);
                    reject(err);
                    //callbackFun(RESULT_CODE.ERROR_SERVER, {
                    //    "error": "blockchain call failed, error=" + err
                    //});
                } else {

                    var turn = result.toString();

                    resolve(battleboardTurns.push({
                        "battleboardId": i,
                        "turnAddress": turn,
                    }));
                }
            });
        }
    );
};


var setupEvents = function() {

};

//---------------------- Button Delegates -----------------------------//
$(document).delegate("#openFreeBattleboard", "click", function (event) {
    event.stopImmediatePropagation();
    event.preventDefault();

    $("#modalOpenFreeBattleboard").modal('show');
});

$(document).delegate("#openFreeBattleboardConfirm", "click", function (event) {
    event.stopImmediatePropagation();
    event.preventDefault();

    openFreeBattleboard();
});

$(document).delegate(".formTeam", "click", function (event) {
    event.stopImmediatePropagation();
    event.preventDefault();

    const $item = $(this);
    battleboardId = $item.parents(".battleboardRow").data("battleboardid");

    buildTeam(battleboardId);
});

$(document).delegate("#team1position1", "click", function (event) {
    teamByPositionClickDelegate(1, 0, 1);
});

$(document).delegate("#team1position2", "click", function (event) {
    teamByPositionClickDelegate(1, 1, 2);
});

$(document).delegate("#team1position3", "click", function (event) {
    teamByPositionClickDelegate(1, 2, 3);
});

$(document).delegate("#team2position1", "click", function (event) {
    teamByPositionClickDelegate(2, 0, 1);
});

$(document).delegate("#team2position2", "click", function (event) {
    teamByPositionClickDelegate(2, 1, 2);
});

$(document).delegate("#team2position3", "click", function (event) {
    teamByPositionClickDelegate(2, 2, 3);
});

//------------------------------------------------------------------------

var teamByPositionClickDelegate = function(team, numTeams, position) {
    var battleboardRowData = battleboardDict.find(item => item.battleboardId === battleboardId);

    if (team === 1) {
        if (battleboardRowData.numTeams1 === numTeams) {
            $("#buildYourTeamOuterContainer").hide();
            $("#FightContainer").fadeIn();

            teamToAddTo = 1;
        }
    } else if (team === 2) {
        if (battleboardRowData.numTeams2 === numTeams) {
            $("#buildYourTeamOuterContainer").hide();
            $("#FightContainer").fadeIn();

            teamToAddTo = 2;
        }
    }
}

// This resets the VsContainer back to its original state so that new selections can be made
var resetVsContainer = function() {
    // Angel
    $("#chooseAngel").show();
    $("#angelToBattle").hide();
    $("#angelToBattle").data("angelid", "");
    $("#angelImageVsBattle").attr("src", "/images/Site/blank.gif");
    $("#angelBPVsBattle").text("");
    $("#angelEXPVsBattle").text("");

    // Pet
    $("#choosePet").show();
    $("#choosePet").removeClass("hand-cursor");
    $("#choosePetText").hide();
    $("#petToBattle").hide();
    $("#petToBattle").data("petid", "");
    $("#petImageVsBattle").attr("src", "/images/Site/blank.gif");
    $("#petLuckVsBattle").text("");
    $("#petRedAuraVsBattle").text("");
    $("#petBlueAuraVsBattle").text("");
    $("#petYellowAuraVsBattle").text("");

    // Accessory
    $("#chooseAccessory").show();
    $("#skipAccessory").hide();
    $("#chooseAccessory").removeClass("hand-cursor");
    $("#chooseAccessoryText").hide();
    $("#accessoryToBattle").hide();
    $("#accessoryToBattle").data("accessoryid", "");
    $("#accessoryImageVsBattle").attr("src", "/images/Site/blank.gif");
    $("#accessoryTextVsBattle").text("");

    // Button
    $("#addTeamCommandContainer").hide();
};

// This shows the begin battle button
var showAddTeam = function () {
    $("#accessoriesContainer").hide();
    $("#vsPlaceholder").hide();
    $("#vsCommandContainer").removeClass("bg-danger").addClass("bg-warning");
    $("#warnNoCardsFoundAccessory").hide();
    $("#chooseAccessory").hide();
    $("#addTeamCommandContainer").show();

    if (isMobileDevice() && $("#accessoryImageOpponent").attr("src") === "/images/Site/blank.gif") {
        $("#accessoryToBattleOpponent").hide();
    }

    $("#vsContainer").fadeIn(200);

    var tag = $("#addTeamButton");
    $('html,body').animate({ scrollTop: tag.offset().top }, 'slow');
};

var chooseAngel = function () {
    // Determine what angel cards are already on the leaderboard and show warning
    $(".angel-battle-card").each(function () {
        var $item = $(this);

        if ($.inArray($item.data("angelid"), ownersAngelsInPlayDict) !== -1) {
            $item.find("#onLeaderboardWarn").show();
            $item.unbind();
            $item.find(".card").removeClass("hand-cursor");
        }
    });

    $("#vsContainer").hide();

    if (restrictcardseriesid === 0) {
        $("#angelsBarakielOnlyContainer").fadeIn();
    } else if (restrictcardseriesid <= 8 && restrictcardseriesid >= 1) {
        $("#angelsAzaelAndBelowContainer").fadeIn();
    } else if (restrictcardseriesid <= 15 && restrictcardseriesid >= 9) {
        $("#angelsGabrielAndBelowContainer").fadeIn();
    } else if (restrictcardseriesid <= 18 && restrictcardseriesid >= 16) {
        $("#angelsMelchizedekAndBelowContainer").fadeIn();
    }
    else {
        $("#angelsContainer").fadeIn();
    }
};

var choosePet = function () {
    // Determine what pet cards are already on the leaderboard and show warning
    $(".pet-battle-card").each(function () {
        var $item = $(this);

        if ($.inArray($item.data("petid"), ownersPetsInPlayDict) !== -1) {
            $item.find("#onLeaderboardWarnPet").show();
            $item.find("#petDetails").hide();
            $item.unbind();
            $item.removeClass("hand-cursor");
        }
    });

    $("#vsContainer").hide();
    $("#petsContainer").fadeIn();
};

var chooseAccessory = function () {
    // Determine what acc cards are already on the leaderboard and show warning
    $(".accessory-battle-card").each(function () {
        var $item = $(this);

        if ($.inArray($item.data("accessoryid"), ownersAccInPlayDict) !== -1) {
            $item.find("#onLeaderboardWarnAcc").show();
            $item.find("#accDetails").hide();
            $item.unbind();
            $item.removeClass("hand-cursor");
        }
    });

    if ($(".accessory-battle-card").length === 0) {
        $("#warnNoCardsFoundAccessory").show();
    }

    $("#vsContainer").hide();
    $("#skipAccessorySelection").show();
    $("#accessoriesContainer").fadeIn();
};

var setupCardButtons = function () {
    $("#chooseAngel").on("click", function (event) {
        event.stopImmediatePropagation();
        event.preventDefault();

        if ($(".angel-battle-card").length === 0) {
            $("#warnNoCardsFoundAngel").show();
        }

        chooseAngel();
    });

    $("#choosePet").on("click", function (event) {
        event.stopImmediatePropagation();
        event.preventDefault();

        $item = $(this);

        if ($item.find("#choosePetText").is(':visible')) {
            // Show need pet warning if they need to get some
            if ($(".pet-battle-card").length === 0) {
                $("#warnNoCardsFoundPet").show();
            }

            choosePet();
        }
    });

    $("#chooseAccessoryGranted").on("click", function (event) {
        event.stopImmediatePropagation();
        event.preventDefault();

        $item = $(this);

        if ($item.find("#chooseAccessoryText").is(':visible')) {
            chooseAccessory();
        }
    });

    $("#skipAccessory").on("click", function (event) {
        event.stopImmediatePropagation();
        event.preventDefault();

        showAddTeam();
    });

    $("#addTeamButton").on("click", function (event) {
        event.stopImmediatePropagation();
        event.preventDefault();

        addTeam();
    });
};

var buildTeam = function (battleboardId) {
    $("#battleboardsTitle").hide();
    $("#openBattleBoardButtons").hide();
    $("#statusBoardContainer").hide();

    setupBuildYourTeamOuterContainer(battleboardId);

    $("#buildYourTeamOuterContainer").fadeIn();
};

var setupBuildYourTeamOuterContainer = function (battleboardId) {
    var battleboardRowData = battleboardDict.find(item => item.battleboardId === battleboardId);

    if (battleboardRowData.numTeams1 === 0) {
        $("#team1position1").addClass("hand-cursor");
        $("#chooseTeam1position1Text").show();
    } else if (battleboardRowData.numTeams1 === 1) {
        $("#team1position2").addClass("hand-cursor");
        $("#chooseTeam1position2Text").show();
        $("#team1position1ViewTeam").show();
    } else if (battleboardRowData.numTeams1 === 2) {
        $("#team1position3").addClass("hand-cursor");
        $("#chooseTeam1position3Text").show();
        $("#team1position1ViewTeam").show();
        $("#team1position2ViewTeam").show();
    } else if (battleboardRowData.numTeams1 === 3) {
        $("#team1position1ViewTeam").show();
        $("#team1position2ViewTeam").show();
        $("#team1position3ViewTeam").show();
    }

    if (battleboardRowData.numTeams2 === 0) {
        $("#team2position1").addClass("hand-cursor");
        $("#chooseTeam2position1ext").show();
    } else if (battleboardRowData.numTeams2 === 1) {
        $("#team2position2").addClass("hand-cursor");
        $("#chooseTeam2position2Text").show();
        $("#team2position1ViewTeam").show();
    } else if (battleboardRowData.numTeams2 === 2) {
        $("#team2position3").addClass("hand-cursor");
        $("#chooseTeam2position3Text").show();
        $("#team2position1ViewTeam").show();
        $("#team2position2ViewTeam").show();
    } else if (battleboardRowData.numTeams1 === 3) {
        $("#team2position1ViewTeam").show();
        $("#team2position2ViewTeam").show();
        $("#team2position3ViewTeam").show();
    }

    restrictcardseriesid = battleboardRowData.restrictions;
};

var setBoardView = function () {
    var offset = 70;
    var tileHeight = 42;
    var halfOffset = 22;

    for (let i = 1; i < 16; i++) {
        if (i === 1) {
            $(".row-" + i).css("top", (offset + tileHeight + halfOffset) + "px");
        } else if (i === 15) {
            $(".row-" + i).css("top", (offset + (tileHeight * i) - halfOffset - 2) + "px");
        } else {
            $(".row-" + i).css("top", (offset + (tileHeight * i)) + "px");
        }
    }

    $(".free-battleboard").fadeIn();
};


//******* Contract functions **********//

//--------- Battleboards Data -----------//
var getTotalBattleboards = function (callbackFun) {
    battleboardDataContractInstance.getTotalBattleboards(function (err, result) {
        if (err) {
            console.log("ERROR_LOG|getTotalBattleboards_txn_fail|error=" + err);
            //callbackFun(RESULT_CODE.ERROR_SERVER, {
            //    "error": "blockchain call failed, error=" + err
            //});
        } else {
            var value = result.toNumber();
            if (value > 0)
                value = Number(value);
            console.log("INFO_LOG|getTotalLeaderboards|value=" + value);
            callbackFun({ "value": value });
        }
    });
};

var openFreeBattleboard = function () {
    var restriction = $("#freeBattleboardRestrictionsSelect").val();

    battleboardManageContractInstance.createBattleboard(restriction, { gas: 500000 }, function (err, txhash) {
        if (err) {
            console.log("ERROR_LOG|createBattleboard_txn_fail|error=" + err);
            //callbackFun(RESULT_CODE.ERROR_SERVER, {
            //    "error": "blockchain transaction fail!!"
            //});
        } else {
            //callbackFun(RESULT_CODE.SUCCESS, { "txn_hash": txhash })
            console.log("INFO_LOG|createBattleboard_txn_success|name=" + name + ", angelId" + angelId);

            $("#openFreeBattleboardBodyContainer").hide();
            $("#transactionSentWarn").fadeIn();
        }
    });
};

//--------- Battleboards Manage -----------//
var addTeam = function () {
    var angelId = $("#angelToBattle").data("angelid");
    var petId = $("#petToBattle").data("petid");
    var accId = $("#accessoryToBattle").data("accessoryid");

    if (teamToAddTo === 1) {
        battleboardManageContractInstance.addTeam1(angelId, petId, accId, battleboardId, { gas: 800000 }, function (err, txhash) {
            if (err) {
                console.log("ERROR_LOG|addTeam1_txn_fail|error=" + err);
                //callbackFun(RESULT_CODE.ERROR_SERVER, {
                //    "error": "blockchain transaction fail!!"
                //});
            } else {
                //callbackFun(RESULT_CODE.SUCCESS, { "txn_hash": txhash })
                console.log("INFO_LOG|addTeam1_txn_success|name=" + name + ", angelId" + angelId);

                $("#FightContainer").hide();
                $("#battleboardGuideText").hide();
                $("#addTeamCompleted").fadeIn();
            }
        });
    } else if (teamToAddTo === 2) {
        battleboardManageContractInstance.addTeam2(angelId, petId, accId, battleboardId, { gas: 800000 }, function (err, txhash) {
            if (err) {
                console.log("ERROR_LOG|addTeam1_txn_fail|error=" + err);
                //callbackFun(RESULT_CODE.ERROR_SERVER, {
                //    "error": "blockchain transaction fail!!"
                //});
            } else {
                //callbackFun(RESULT_CODE.SUCCESS, { "txn_hash": txhash })
                console.log("INFO_LOG|addTeam1_txn_success|name=" + name + ", angelId" + angelId);

                $("#FightContainer").hide();
                $("#battleboardGuideText").hide();
                $("#addTeamCompleted").fadeIn();
            }
        });
    }
};