$(document).ready(function () {
    var scene = document.getElementById('scene');
    var parallaxInstance = new Parallax(scene, {
        relativeInput: true
    });
    parallaxInstance.friction(0.2, 0.2);

    setupManageCardModel();
});

// Global Variables
var rpcConnected = null;
var account = undefined;
var angelDict = [];
var petDict = [];
var accessoryDict = [];

var modalManageCardType = "";
var modalManageCardId = "";

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
        rpcConnected = false;
        showMetaMaskAlert();
        account = null;
    }

    // init contract
    angelCardDataContractInstance = getAngelCardDataContractInstance();
    petCardDataContractInstance = getPetCardDataContractInstance();
    accessoryDataContractInstance = getAccessoryDataContractInstance();
    pettransferContractInstance = getPetTransferContractInstance();

    // Call Contract Read Functions
    if (rpcConnected) {
        $("#loader").fadeIn();

        getAngelByIndex(null, DisplayAngelCards);
        getPetByIndex(null, DisplayPetCards);
        getAccessoryByIndex(null, DisplayAccessoryCards);
    }
});

//*********** Helper Functions *************//

var getDateTimeFromUnixTimestamp = function(unixtimestamp) {
    var dt = eval(unixtimestamp * 1000);
    var myDate = new Date(dt);

    return myDate.toLocaleString();
};

/**
 * Battle Results
 */
var isWin = false;
var arena = "";
var monster = "";
var isWildCommonPet = false;
var monsterImageSrc = "";
var determineBattleResults = function(value) {
    if (value !== undefined || value !== null) {
        var results = value.split("");

        // Reset values
        isWin = false;
        arena = "";
        monster = 0;

        var mon = "";
        var area = 0;
        if (results.length === 3) {
            area = results[0].toString();
            setArena(area);

            mon = results[1].toString() + results[2].toString();
            setMonster(area, mon);
        } else if (results.length === 2) {
            mon = results[0].toString() + results[1].toString();
            area = "0";
            setMonster(area, mon);
            setArena(area);
        } else if (results.length === 1) {
            area = "0";
            mon = "0" + results[0].toString();
            setMonster(area, mon);
            setArena(area);
        }

        return isWin;
    }
};

var setArena = function(value) {
    if (value === "0") {
        isWin = false;
        arena = "Wimpy Cirrus Meadows";
    } else if (value === "1") {
        isWin = true;
        arena = "Wimpy Cirrus Meadows";
    } else if (value === "2") {
        isWin = false;
        arena = "Menacing Nimbus Forest";
    } else if (value === "3") {
        isWin = true;
        arena = "Menacing Nimbus Forest";
    } else if (value === "4") {
        isWin = false;
        arena = "Thunderdome";
    } else if (value === "5") {
        isWin = true;
        arena = "Thunderdome";
    }
};

var setMonster = function(arena, value) {
    isWildCommonPet = false;
    monsterImageSrc = "";

    if (arena === "0" || arena === "1") {
        //arena = "Wimpy Cirrus Meadows";
        if (value === "01") {
            monster = "Lunkus";
            monsterImageSrc = "images/Monsters/Lunkus.svg";
        } else if (value === "02") {
            monster = "Cornu";
            monsterImageSrc = "images/Monsters/Cornu.svg";
        } else if (value === "03") {
            monster = "Colo-Colo";
            monsterImageSrc = "images/Monsters/Colo.svg";
        } else if (value === "04") {
            monster = "a Nix";
            monsterImageSrc = "images/Monsters/Nix.svg";
        } else if (value === "05") {
            monster = "a Komodo";
            monsterImageSrc = "images/Pets/WildCommonPets/KomodoLarge.svg";
            isWildCommonPet = true;
        } else if (value === "06") {
            monster = "a Falcon";
            monsterImageSrc = "images/Pets/WildCommonPets/FalconLarge.svg";
            isWildCommonPet = true;
        } else if (value === "07") {
            monster = "a Bobcat";
            monsterImageSrc = "images/Pets/WildCommonPets/BobcatLarge.svg";
            isWildCommonPet = true;
        } else if (value === "08") {
            monster = "a Unicorn";
            monsterImageSrc = "images/Pets/WildCommonPets/UnicornLarge.svg";
            isWildCommonPet = true;
        }
    } else if (arena === "2" || arena === "3") {
        //arena = "Menacing Nimbus Forest";
        if (value === "01") {
            monster = "a Foawr";
            monsterImageSrc = "images/Monsters/Foawr.svg";
        } else if (value === "02") {
            monster = "a Moko";
            monsterImageSrc = "images/Monsters/Moko.svg";
        } else if (value === "03") {
            monster = "a Pamba";
            monsterImageSrc = "images/Monsters/Pamba.svg";
        } else if (value === "04") {
            monster = "a Biersal";
            monsterImageSrc = "images/Monsters/Biersal.svg";
        } else if (value === "05") {
            monster = "a Rock Dragon";
            monsterImageSrc = "images/Pets/RockDragonLarge.svg";
            isWildCommonPet = true;
        } else if (value === "06") {
            monster = "a Archaeopteryx";
            monsterImageSrc = "images/Pets/ArchaeopteryxLarge.svg";
            isWildCommonPet = true;
        } else if (value === "07") {
            monster = "a Sabortooth";
            monsterImageSrc = "images/Pets/SabortoothLarge.svg";
            isWildCommonPet = true;
        } else if (value === "08") {
            monster = "a Pegasus";
            monsterImageSrc = "images/Pets/PegasusLarge.svg";
            isWildCommonPet = true;
        }
    } else if (arena === "4" || arena === "5") {
        //arena = "Thunderdome";
        if (value === "01") {
            monster = "a Fire Elemental";
            monsterImageSrc = "images/Pets/FireElemental.svg";
        } else if (value === "02") {
            monster = "a Water Elemental";
            monsterImageSrc = "images/Pets/WaterElemental.svg";
        } else if (value === "03") {
            monster = "a Sun Elemental";
            monsterImageSrc = "images/Pets/SunElemental.svg";
        } else if (value === "04") {
            monster = "a Naughty Nix";
            monsterImageSrc = "images/Monsters/NaughtyNix.svg";
        } else if (value === "05") {
            monster = "a Great Foawr";
            monsterImageSrc = "images/Monsters/GreatFoawr.svg";
        } else if (value === "06") {
            monster = "a Dire Moko";
            monsterImageSrc = "images/Monsters/DireMoko.svg";
        } else if (value === "07") {
            monster = "a Lunkus Captain";
            monsterImageSrc = "images/Monsters/LunkusCaptain.svg";
        } else if (value === "08") {
            monster = "a Dire Cornu";
            monsterImageSrc = "images/Monsters/DireCornu.svg";
        }
    }
};

/*******************************************/

function DisplayAngelCards(value) {
    // Load all the cards
    var angels = {
        AngelsList: value
    }

    $.ajax({
        dataType: 'html',
        type: 'POST',
        url: '/Team/GetAngelCardRows',
        data: angels,
        success: function (response) {
            $("#loader").hide();

            $('#angelsContainer').html(response);

            $(".angel-card").each(function (index, value) {
                var $item = $(this);

                var battleResult = $item.data("lastbattleresult").toString();
                var won = determineBattleResults(battleResult);

                if (won) {
                    $item.parent().find("#award").show();
                }
            });

            $(".battleResultsAngel").on("click", function (event) {
                event.stopImmediatePropagation();
                event.preventDefault();

                var $item = $(this).parents(".angel-card");

                var battleResult = $item.data("lastbattleresult").toString();
                determineBattleResults(battleResult);

                if (isWin) {
                    $("#modalResultsTitle").text("Last Battle Results - " + arena);
                    $("#resultText").text("Won!");

                    var team = "";
                    if (isWildCommonPet) {
                        if (arena === "Menacing Nimbus Forest") {
                            team = " and it has become part of your team! You've also gained +4 EXP";
                        } else {
                            team = " and it has become part of your team! You've also gained +2 EXP";
                        }
                    } else {
                        if (arena === "Menacing Nimbus Forest") {
                            team = "! You've gained +4 EXP";
                        } else if (arena === "Thunderdome") {
                            team = "! You've gained +7 EXP";
                        } else {
                            team = "! You've gained +2 EXP";
                        }
                    }
                    $("#foughtAgainstText").text("You defeated " + monster + team);
                } else if (monster !== "") {
                    $("#modalResultsTitle").text("Last Battle Results - " + arena);
                    $("#resultText").text("You lost--you shall regain honor. You've gained +1 EXP");
                    $("#foughtAgainstText").text("You were defeated by " + monster + ", train harder or try different accessories. You've gained +1 EXP. Having trouble winning, get a stronger angel!");
                } else {
                    $("#modalResultsTitle").text("Last Battle Results");
                    $("#resultText").text("You must first begin a battle.");
                    $("#foughtAgainstText").text("Train your pets to build their aura levels, and start battling to increase the experience level of your angels.");
                }

                var battleDate = $item.data("lastbattletime");
                if (battleDate > 0) {
                    var lastBattleTime = getDateTimeFromUnixTimestamp(battleDate);
                    $("#lastBattleTime").text("Last Battled: " + lastBattleTime);
                    $("#lastBattleTime").show();
                } else {
                    $("#lastBattleTime").hide();
                }
                

                $("#opponentImage").attr('src', monsterImageSrc);

                // Show the modal
                $('#modalAngelStats').modal('show');
            });

            // Click this button to popup the model to select manage function
            $(".manageCardAngel").on("click", function (event) {
                event.stopImmediatePropagation();
                event.preventDefault();

                var $cardAngel = $(this).parents(".angel-card");

                resetManageCardModalToOriginal();

                modalManageCardType = "angel";
                modalManageCardId = $cardAngel.data("cardid");
                $("#renamePet").hide();


                // Show the modal
                $('#modalManageCard').modal('show');
            });
        },
        failure: function (response) {
            $("#loader").hide();
            $("#warnNoCardsFound").show();
        }
    }); 
}

function DisplayPetCards(value) {
    var size = 96;
    for (var i = 0; i < value.length; i += size) {
        var smallarray = value.slice(i, i + size);

        var pets = {
            PetsList: smallarray
        }

        $.ajax({
            dataType: 'html',
            type: 'POST',
            url: '/Team/GetPetCardRows',
            data: pets,
            success: function (response) {
                $("#loader").hide();

                $('#petsContainer').append(response);

                // Setup button click for Manage Card on the cards
                $(".manageCardPet").on("click", function (event) {
                    event.stopImmediatePropagation();
                    event.preventDefault();

                    var $cardPet = $(this).parents(".pet-card");

                    resetManageCardModalToOriginal();

                    modalManageCardType = "pet";
                    modalManageCardId = $cardPet.data("cardid");

                    $("#renamePet").show();

                    // Show the modal
                    $('#modalManageCard').modal('show');
                });
            },
            failure: function (response) {
                $("#loader").hide();
                $("#warnNoCardsFound").show();
            }
        });
    }
}

function DisplayAccessoryCards(value) {
    // Load all the cards
    var accessories = {
        AccessoriesList: value
    }

    $.ajax({
        dataType: 'html',
        type: 'POST',
        url: '/Team/GetAccessoryCardRows',
        data: accessories,
        success: function (response) {
            $("#loader").hide();

            $('#accessoriesContainer').html(response);

            // Setup button click for Manage Card on the cards
            $(".manageCardAccessory").on("click", function (event) {
                event.stopImmediatePropagation();
                event.preventDefault();

                var $cardAcc = $(this).parents(".accessory-card");

                resetManageCardModalToOriginal();

                modalManageCardType = "acc";
                modalManageCardId = $cardAcc.data("cardid");

                $("#renamePet").hide();

                // Show the modal
                $('#modalManageCard').modal('show');
            });
        },
        failure: function (response) {
            $("#loader").hide();
            $("#warnNoCardsFound").show();
        }
    });
}

function isEtherAccountActive() {
    return account !== null && account !== undefined;
}

//******* Page functions **************//

var resetManageCardModalToOriginal = function () {
    // Reset Modal data values
    modalManageCardType = "";
    modalManageCardId = "";

    // Reset the transfer UI back to normal
    $("#manageCardButtons").show();
    $("#renamePet").hide();
    $("#cannotUndoWarn").show();
    $("#transactionSentWarn").hide();

    $("#transferCardContainer").hide();
    $("#typeTransferInputContainer").show();
    $("#transferCardConfirm").hide();
    $("#addressToInput").val("");
    $("#typeTransferInput").val("");
    // Reset delete state back to normal
    $("#deleteCardContainer").hide();
    $("#typeDeleteInputContainer").show();
    $("#deleteCardConfirm").hide();
    $("#typeDeleteInput").val("");
    //Reset rename pet back to normal
    $("#renamePetCardContainer").hide();
    $("#renamePetInput").val("");
};

var setupManageCardModel = function () {
    //*************** Transfer click *********************
    $("#transferCard").on("click", function (event) {
        event.stopImmediatePropagation();
        event.preventDefault();

        $("#manageCardButtons").hide();
        $("#transferCardContainer").fadeIn(200);

        $('#typeTransferInput').keyup(function () {
            if (this.value === "transfer") {
                $("#typeTransferInputContainer").hide(function () {
                    $("#transferCardConfirm").fadeIn(200);
                });
            }
        });

        $('#addressToInput').keyup(function () {
            $("#addressToInputContainer").removeClass("bg-danger");
        });
    });

    // Transfer the card click
    $("#transferCardConfirm").on("click", function (event) {
        event.stopImmediatePropagation();
        event.preventDefault();

        var addressTo = $('[name="addressToInput"]').val();
        if (addressTo === "" || !web3.isAddress(addressTo)) {
            $("#addressToInputContainer").addClass("bg-danger");
        } else {
            $("#addressToInputContainer").removeClass("bg-danger");
            // Call Transfer Card on web3js
            transferCard(modalManageCardType, modalManageCardId, addressTo); 
        }
    });

    //*************** Delete click *******************
    $("#deleteCard").on("click", function (event) {
        event.stopImmediatePropagation();
        event.preventDefault();

        $("#manageCardButtons").hide();
        $("#deleteCardContainer").fadeIn(200);

        $('#typeDeleteInput').keyup(function () {
            if (this.value === "delete") {
                $("#typeDeleteInputContainer").hide(function () {
                    $("#deleteCardConfirm").fadeIn(200);
                });
            }
        });
    });

    // Delete the card click
    $("#deleteCardConfirm").on("click", function (event) {
        event.stopImmediatePropagation();
        event.preventDefault();

        transferCard(modalManageCardType, modalManageCardId, "0x0");
    });

    //************* Rename Pet click ******************
    $("#renamePet").on("click", function (event) {
        event.stopImmediatePropagation();
        event.preventDefault();

        $("#manageCardButtons").hide();
        $("#renamePetCardContainer").fadeIn(200);

        $('#renamePetInput').keyup(function () {
            $("#renamePetInputContainer").removeClass("bg-danger");
        });
    });

    $("#renamePetCardConfirm").on("click", function (event) {
        event.stopImmediatePropagation();
        event.preventDefault();

        var newName = $('[name="renamePetInput"]').val();
        if (newName === "") {
            $("#renamePetInputContainer").addClass("bg-danger");
        } else {
            $("#renamePetInputContainer").removeClass("bg-danger");
            // Call Transfer Card on web3js
            setPetName(newName, modalManageCardId);
        }
    });
}

//******* Contract functions **********//
//******* ANGELS *********************//
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
            $("#loader").hide();
            $("#warnNoCardsFound").fadeIn();
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
    }
};

//************* Transfer Card *********************//
var transferCard = function (type, cardid, addressTo) {
    if (type === "angel") {
        angelCardDataContractInstance.ownerAngelTransfer(addressTo, cardid, { gas: 250000 }, function (err, result) {
            if (err) {
                console.log("ERROR_LOG|ownerAngelTransfer_txn_fail|error=" + err);
                //callbackFun(RESULT_CODE.ERROR_SERVER, {
                //    "error": "blockchain call failed, error=" + err
                //});
            } else {
                $("#transferCardContainer").hide(function () {
                    $("#deleteCardContainer").hide();
                    $("#cannotUndoWarn").hide();
                    $("#renamePetCardContainer").hide();
                    $("#transactionSentWarn").fadeIn(200);
                });
            }
        });
    } else if (type === "pet") {
        pettransferContractInstance.ownerPetTransfer(cardid, addressTo, { gas: 250000 }, function (err, result) {
            if (err) {
                console.log("ERROR_LOG|ownerPetTransfer_txn_fail|error=" + err);
                //callbackFun(RESULT_CODE.ERROR_SERVER, {
                //    "error": "blockchain call failed, error=" + err
                //});
            } else {
                $("#transferCardContainer").hide(function () {
                    $("#deleteCardContainer").hide();
                    $("#cannotUndoWarn").hide();
                    $("#renamePetCardContainer").hide();
                    $("#transactionSentWarn").fadeIn(200);
                });
            }
        });
    } else if (type === "acc") {
        accessoryDataContractInstance.ownerAccessoryTransfer(addressTo, cardid, function (err, result) {
            if (err) {
                console.log("ERROR_LOG|ownerAccessoryTransfer_txn_fail|error=" + err);
                //callbackFun(RESULT_CODE.ERROR_SERVER, {
                //    "error": "blockchain call failed, error=" + err
                //});
            } else {
                $("#transferCardContainer").hide(function () {
                    $("#deleteCardContainer").hide();
                    $("#cannotUndoWarn").hide();
                    $("#renamePetCardContainer").hide();
                    $("#transactionSentWarn").fadeIn(200);
                });
            }
        });
    }
    
};

//********************* Rename Pet *******************************
var setPetName = function (newName, cardid) {
    petCardDataContractInstance.setPetName(newName, cardid, { gas: 250000 }, function (err, result) {
        if (err) {
            console.log("ERROR_LOG|getPetByIndex_txn_fail|error=" + err);
            //callbackFun(RESULT_CODE.ERROR_SERVER, {
            //    "error": "blockchain call failed, error=" + err
            //});
        } else {
            $("#transferCardContainer").hide(function () {
                $("#deleteCardContainer").hide();
                $("#cannotUndoWarn").hide();
                $("#renamePetCardContainer").hide();
                $("#transactionSentWarn").fadeIn(200);
            });
        }
    });
}



///////////////////////////////////////////
var uniqueList = [];
var duplicateList = [];
var GetUniqueAndDuplicateCardsLists = function (type, list) {
    uniqueList = [], duplicateList = [];
    var map = {}, it, item;
    for (var i = 0; i < list.length; i++) {
        it = list[i];

        if (type === "angel") {
            item = map[it.angelCardSeriesId];
        } else if (type === "pet") {
            item = map[it.petCardSeriesId];
        } else if (type === "acc") {
            item = map[it.accessoryCardSeriesId];
        }

        if (item) {
            duplicateList.push(item);
        } else {

            if (type === "angel") {
                map[it.angelCardSeriesId] = item = {
                    angelCardSeriesId: it.angelCardSeriesId
                };
            } else if (type === "pet") {
                map[it.petCardSeriesId] = item = {
                    petCardSeriesId: it.petCardSeriesId
                };
            } else if (type === "acc") {
                map[it.accessorySeriesId] = item = {
                    accessorySeriesId: it.accessorySeriesId
                };
            }

            uniqueList.push(item);
        }
    }
    console.log(uniqueList);
    console.log(duplicateList);
}

var GetUniqueValuesFromList = function (type) {
    var list = [];
    if (type === "angel") {
        list = angelDict;
    } else if (type === "pet") {
        list = petDict;
    } else if (type === "acc") {
        list = accessoryDict;
    }

    var cardsToFetch = $.grep(list, function (value) {
        return $.inArray(value, uniqueList) < 0;
    });

    console.log(cardsToFetch);
}