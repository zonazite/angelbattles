$(document).ready(function () {
    var scene = document.getElementById('scene');
    var parallaxInstance = new Parallax(scene, {
        relativeInput: true
    });
    parallaxInstance.friction(0.2, 0.2);

    // Wire up click events
    setupBattleButtons();

    loadUrlHashState();
});

// Global Variables
var rpcConnected = null;
var account = undefined;
var angelDict = [];
var petDict = [];
var accessoryDict = [];
var needAngelCards = false;
var needPetCards = false;
var needAccessoryCards = false;
var angelNextBattleTimesDict = [];

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
    arenaBattleContractInstance = getArenaBattleDataContractInstance(); 
    arenaBattle2ContractInstance = getArenaBattle2ContractInstance(); 
    arenaBattle3ContractInstance = getArenaBattle3ContractInstance(); 
    battleCooldownContractInstance = getBattleCooldownContractInstance();

    // Call Contract Read Functions
    if (rpcConnected) {
        getAngelByIndex(null, DisplayAngelCards);
        getPetByIndex(null, DisplayPetCards);
        getAccessoryByIndex(null, DisplayAccessoryCards);
    }
});

//*********** Helper Functions *************//

async function GetEachAngelNextBattleTime(totalList) {
    const angelIdList = totalList.map(function (n, i) { return n.angelId; });

    var i;
    for (i = 0; i < angelIdList.length; i++) {
        const angId = angelIdList[i];
        promisesGetNextBattleTime.push(processGetEachAngelNextBattleTime(angId));
    }

    await window.Promise.all(promisesGetNextBattleTime);

    // After waiting get all the angel rows from the server
    GetAllAngelCardRows(totalList);
}


var promisesGetNextBattleTime = [];
var processGetEachAngelNextBattleTime = function (i) {
    return new Promise(
        function (resolve, reject) {
            battleCooldownContractInstance.getNextBattleTime(i, function (err, result) {
                if (err) {
                    console.log("ERROR_LOG|getNextBattleTime_txn_fail|error=" + err);
                    reject(err);
                    //callbackFun(RESULT_CODE.ERROR_SERVER, {
                    //    "error": "blockchain call failed, error=" + err
                    //});
                } else {

                    const nextBattleTime = result.toString();

                    resolve(angelNextBattleTimesDict.push({
                        "angelId": i,
                        "nextBattleTime": nextBattleTime
                    }));
                }
            });
        }
    );
};

var GetAllAngelCardRows = function (value) {
    // Load all the cards
    const angels = {
        AngelsList: value,
        AngelsNextBattleTimeList: angelNextBattleTimesDict
    };

    $.ajax({
        dataType: 'html',
        type: 'POST',
        url: '/Battle/GetAngelCardRows',
        data: angels,
        success: function (response) {
            $("#loader").hide();

            $('#angelsContainer').html(response);

            // Show resting if cookie is set
            $(".angel-battle-card").not(".in-battle").each(function () {
                var angelid = $(this).data("angelid");
                var isInBattle = Cookies.get("angel1:" + angelid.toString());
                if (isInBattle === "pending") {
                    $(this).find("#inBattleWarn").show();
                    $(this).removeClass("hand-cursor").addClass("no-pointers-events");
                }
            });

            // Remove cookie
            $(".angel-battle-card.in-battle").each(function () {
                var angelid = $(this).data("angelid");
                var isInBattle = Cookies.get("angel1:" + angelid);
                if (isInBattle === "pending") {
                    Cookies.remove("angel1:" + angelid.toString());
                }
            });

            // on the angel card click add them to the training container
            $(".angel-battle-card").on("click", function (event) {
                event.stopImmediatePropagation();
                event.preventDefault();

                const $item = $(this);
                if (!$item.hasClass("in-battle")) {
                    const imageSrc = getCardSeriesImageSrc("angel", $item.data("angelcardseriesid").toString());
                    const hash = window.location.hash;
                    if (hash === "#meadows") {
                        $("#meadowsContainer #chooseAngelText").hide();
                        $("#meadowsContainer #angelImage").attr('src', imageSrc).fadeIn();
                        $("#meadowsContainer #choosePetText").fadeIn();

                        $("#angelsContainer").fadeOut(200, function () {
                            $("#petsContainer").fadeIn(200);
                        });

                        $("#meadowsContainer #angelToBattle").attr("data-angelid", $item.data("angelid"));

                        // Show need pet warning if they need to get some
                        if (needPetCards || $(".pet-battle-card").length === 0) {
                            $("#warnNoCardsFoundPet").fadeIn(200);
                        }
                    } else if (hash === "#forest") {
                        if ($("#forestContainer #chooseAngelText").is(':visible')) {
                            $("#forestContainer #chooseAngelText").hide();
                            $("#forestContainer #angelImage").attr('src', imageSrc).fadeIn();
                            $("#forestContainer #chooseAngel2Text").fadeIn();
                            $("#forestContainer #angelToBattle").attr("data-angelid", $item.data("angelid"));

                            if ($(".angel-battle-card").length === 1) {
                                $("#warnOneMoreAngel").fadeIn(200);
                            }
                        } else if ($("#forestContainer #chooseAngel2Text").is(':visible')) {
                            $("#forestContainer #chooseAngel2Text").hide();
                            $("#forestContainer #angel2Image").attr('src', imageSrc).fadeIn();
                            $("#forestContainer #choosePetText").fadeIn();
                            $("#forestContainer #angel2ToBattle").attr("data-angelid", $item.data("angelid"));

                            $("#angelsContainer").fadeOut(200, function () {
                                $("#petsContainer").fadeIn(200);
                            });

                            // Show need pet warning if they need to get some
                            if (needPetCards || $(".pet-battle-card").length === 0) {
                                $("#warnNoCardsFoundPet").fadeIn(200);
                            }
                        }
                    } else if (hash === "#thunderdome") {
                        if ($("#thunderdomeContainer #chooseAngelText").is(':visible')) {
                            $("#thunderdomeContainer #chooseAngelText").hide();
                            $("#thunderdomeContainer #angelImage").attr('src', imageSrc).fadeIn();
                            $("#thunderdomeContainer #chooseAngel2Text").fadeIn();
                            $("#thunderdomeContainer #angelToBattle").attr("data-angelid", $item.data("angelid"));

                            if ($(".angel-battle-card").length === 1) {
                                $("#warnOneMoreAngel").fadeIn(200);
                            }
                        } else if ($("#thunderdomeContainer #chooseAngel2Text").is(':visible')) {
                            $("#thunderdomeContainer #chooseAngel2Text").hide();
                            $("#thunderdomeContainer #angel2Image").attr('src', imageSrc).fadeIn();
                            $("#thunderdomeContainer #choosePetText").fadeIn();
                            $("#thunderdomeContainer #angel2ToBattle").attr("data-angelid", $item.data("angelid"));

                            $("#angelsContainer").fadeOut(200, function () {
                                $("#petsContainer").fadeIn(200);
                            });

                            // Show need pet warning if they need to get some
                            if (needPetCards || $(".pet-battle-card").length === 0) {
                                $("#warnNoCardsFoundPet").fadeIn(200);
                            }
                        }
                    }

                    $item.fadeOut();
                }
            });

            // Show need angel warning if they need to get some
            if (needAngelCards || $(".angel-battle-card").length === 0) {
                $("#warnNoCardsFoundAngel").fadeIn(200);
            }

            // Set the countdown timer for the angels in training
            loadEachAngelRestEndTime();
        },
        failure: function (response) {
            console.log('INFO_LOG|GetAngelCardRows response failed: ' + response);
        }
    });
}

function DisplayAngelCards(value) {
    // Get list of all angels next battle time
    GetEachAngelNextBattleTime(value);

    
}

function DisplayPetCards(value) {
    const size = 96;
    for (let i = 0; i < value.length; i += size) {
        const smallarray = value.slice(i, i + size);

        const pets = {
            PetsList: smallarray
        };

        $.ajax({
            dataType: 'html',
            type: 'POST',
            url: '/Battle/GetPetCardRows',
            data: pets,
            success: function (response) {
                $('#petsContainer').append(response);

                // on the pet card click add them to the training container
                $(".pet-battle-card").on("click", function (event) {
                    event.stopImmediatePropagation();
                    event.preventDefault();

                    var $item = $(this);

                    var imageSrc = getCardSeriesImageSrc("pet", $item.data("petcardseriesid").toString());

                    var hash = window.location.hash;
                    if (hash === "#meadows") {
                        $("#meadowsContainer  #petImage").fadeOut(200, function () {
                            $("#meadowsContainer #petImage").attr('src', imageSrc);
                        }).fadeIn(200);
                        $("#meadowsContainer #choosePetText").hide();

                        $("#petsContainer").fadeOut(200, function () {
                            $("#accessoriesContainer").fadeIn(200);
                            $("#meadowsContainer #chooseAccessory").fadeIn(200);

                            // If no accessories show warning
                            if ($(".accessory-battle-card").length === 0) {
                                $("#warnNoCardsFoundAccessory").show();
                            }

                            // Wire up skip accessory click
                            $("#meadowsContainer #skipAccessory").on("click", function (event) {
                                event.stopImmediatePropagation();
                                event.preventDefault();

                                $("#meadosContainer #chooseAccessory").hide();

                                showBeginBattle();
                            });
                        });

                        $("#meadowsContainer #petToBattle").attr("data-petid", $item.data("petid"));

                        if (needAccessoryCards) {
                            $("#warnNoCardsFoundAccessory").fadeIn(200);
                        }
                    } else if (hash === "#forest") {
                        if ($("#forestContainer #choosePetText").is(':visible')) {
                            $("#forestContainer #choosePetText").hide();
                            $("#forestContainer #choosePet2Text").fadeIn(200);
                            $("#forestContainer #petImage").attr('src', imageSrc);
                            $("#forestContainer #petImage").fadeIn(200);

                            $("#forestContainer #petToBattle").attr("data-petid", $item.data("petid"));

                            // Show need pet warning if they need to get some
                            if (needPetCards || $(".pet-battle-card").length === 0) {
                                $("#warnNoCardsFoundPet").fadeIn(200);
                            } else if ($(".pet-battle-card").length === 1) {
                                $("#warnOneMorePet").fadeIn(200);
                            }
                        } else if ($("#forestContainer #choosePet2Text").is(':visible')) {
                            $("#forestContainer #choosePet2Text").hide();
                            $("#forestContainer #chooseAccessoryText").fadeIn(200);
                            $("#forestContainer #pet2Image").attr('src', imageSrc);
                            $("#forestContainer #pet2Image").fadeIn(200);

                            $("#forestContainer #pet2ToBattle").attr("data-petid", $item.data("petid"));

                            $("#petsContainer").fadeOut(200, function () {
                                $("#accessoriesContainer").fadeIn(200);
                                $("#forestContainer #chooseAccessory").fadeIn(200);

                                // If no accessories show warning
                                if ($(".accessory-battle-card").length === 0) {
                                    $("#warnNoCardsFoundAccessory").show();
                                }

                                // Wire up skip accessory click
                                $("#forestContainer #skipAccessory").on("click", function (event) {
                                    event.stopImmediatePropagation();
                                    event.preventDefault();

                                    $("#forestContainer #chooseAccessory").hide();

                                    showBeginBattle();
                                });
                            });
                        }
                    } else if (hash === "#thunderdome") {
                        if ($("#thunderdomeContainer #choosePetText").is(':visible')) {
                            $("#thunderdomeContainer #choosePetText").hide();
                            $("#thunderdomeContainer #choosePet2Text").fadeIn(200);
                            $("#thunderdomeContainer #petImage").attr('src', imageSrc);
                            $("#thunderdomeContainer #petImage").fadeIn(200);

                            $("#thunderdomeContainer #petToBattle").attr("data-petid", $item.data("petid"));

                            // Show need pet warning if they need to get some
                            if (needPetCards || $(".pet-battle-card").length === 0) {
                                $("#warnNoCardsFoundPet").fadeIn(200);
                            } else if ($(".pet-battle-card").length === 1) {
                                $("#warnOneMorePet").fadeIn(200);
                            }
                        } else if ($("#thunderdomeContainer #choosePet2Text").is(':visible')) {
                            $("#thunderdomeContainer #choosePet2Text").hide();
                            $("#thunderdomeContainer #chooseAccessoryText").fadeIn(200);
                            $("#thunderdomeContainer #pet2Image").attr('src', imageSrc);
                            $("#thunderdomeContainer #pet2Image").fadeIn(200);

                            $("#thunderdomeContainer #pet2ToBattle").attr("data-petid", $item.data("petid"));

                            $("#petsContainer").fadeOut(200, function () {
                                $("#accessoriesContainer").fadeIn(200);
                                $("#thunderdomeContainer #chooseAccessory").fadeIn(200);

                                // If no accessories show warning
                                if ($(".accessory-battle-card").length === 0) {
                                    $("#warnNoCardsFoundAccessory").show();
                                }

                                // Wire up skip accessory click
                                $("#thunderdomeContainer #skipAccessory").on("click", function (event) {
                                    event.stopImmediatePropagation();
                                    event.preventDefault();

                                    $("#thunderdomeContainer #chooseAccessory").hide();

                                    showBeginBattle();
                                });
                            });
                        }
                    }

                    

                    $item.fadeOut();

                    
                });
            },
            failure: function (response) {
                console.log('INFO_LOG|GetPetCardRows response failed: ' + response);
            }
        });
    }
}

function DisplayAccessoryCards(value) {
    // Load all the cards
    var accessories = {
        AccessoriesList: value
    };

    $.ajax({
        dataType: 'html',
        type: 'POST',
        url: '/Battle/GetAccessoryCardRows',
        data: accessories,
        success: function (response) {
            $('#accessoriesContainer').html(response);

            // on the pet card click add them to the training container
            $(".accessory-battle-card").on("click", function (event) {
                event.stopImmediatePropagation();
                event.preventDefault();

                var $item = $(this);
                var imageSrc = getCardSeriesImageSrc("acc", $item.data("accessorycardseriesid").toString());

                showBeginBattle();

                var hash = window.location.hash;
                if (hash === "#meadows") {
                    $("#accessoriesContainer").fadeOut(200);

                    $("#meadowsContainer #accessoryImage").fadeOut(200, function () {
                        $("#meadowsContainer #accessoryImage").attr('src', imageSrc);
                    }).fadeIn(200);

                    $("#meadowsContainer #accessoryToBattle").attr("data-accessoryid", $item.data("accessoryid"));
                } else if (hash === "#forest") {
                    $("#accessoriesContainer").fadeOut(200);
                    $("#forestContainer #chooseAccessory").hide();

                    $("#forestContainer #accessoryImage").fadeOut(200, function () {
                        $("#forestContainer #accessoryImage").attr('src', imageSrc);
                    }).fadeIn(200);

                    $("#forestContainer #accessoryToBattle").attr("data-accessoryid", $item.data("accessoryid"));
                } else if (hash === "#thunderdome") {
                    $("#accessoriesContainer").fadeOut(200);
                    $("#thunderdomeContainer #chooseAccessory").hide();

                    $("#thunderdomeContainer #accessoryImage").fadeOut(200, function () {
                        $("#thunderdomeContainer #accessoryImage").attr('src', imageSrc);
                    }).fadeIn(200);

                    $("#thunderdomeContainer #accessoryToBattle").attr("data-accessoryid", $item.data("accessoryid"));
                }
            });
        },
        failure: function (response) {
            console.log('INFO_LOG|GetAccessoryCardRows response failed');
        }
    });
}

var loadEachAngelRestEndTime = function () {
    $(".angelRestingTime").each(function (index, value) {
        var $item = $(this);

        var lastBattleTime = $item.data("endtime");
        if (lastBattleTime !== "") {
            var endTime = new Date(parseInt(lastBattleTime) * 1000);

            $item.countdown(endTime, function (event) {
                $item.html(
                    event.strftime('%H hours %M minutes %S seconds')
                );
            });
        }
    });
};

function isEtherAccountActive() {
    return account !== null && account !== undefined;
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


/**** Battle Meadows ****/
var arenaBattle1 = function () {
    var angelId = $("#meadowsContainer #angelToBattle").data("angelid");
    var petId = $("#meadowsContainer #petToBattle").data("petid");
    var accessoryId = $("#meadowsContainer #accessoryToBattle").data("accessoryid");

    arenaBattleContractInstance.WCMBattle(angelId, petId, accessoryId, { gas: 400000 }, function (err, txhash) {
        if (err) {
            console.log("ERROR_LOG|ArenaBattle1_txn_fail|error=" + err);
            //callbackFun(RESULT_CODE.ERROR_SERVER, {
            //    "error": "blockchain transaction fail!!"
            //});
        } else {
            //callbackFun(RESULT_CODE.SUCCESS, { "txn_hash": txhash })

            $("#arenaContainer").hide();
            $("#battleCompleted").fadeIn();

            // Expire in 4 hours
            setCookieInMinutes("angel1", angelId, 15);
        }
    });
};

var arenaBattle2 = function () {
    var angelId = $("#forestContainer #angelToBattle").data("angelid");
    var angel2Id = $("#forestContainer #angel2ToBattle").data("angelid");
    var petId = $("#forestContainer #petToBattle").data("petid");
    var pet2Id = $("#forestContainer #pet2ToBattle").data("petid");
    var accessoryId = $("#forestContainer #accessoryToBattle").data("accessoryid");

    arenaBattle2ContractInstance.MNFBattle(angelId, angel2Id, petId, pet2Id, accessoryId, { gas: 550000 }, function (err, txhash) {
        if (err) {
            console.log("ERROR_LOG|ArenaBattle2_txn_fail|error=" + err);
            //callbackFun(RESULT_CODE.ERROR_SERVER, {
            //    "error": "blockchain transaction fail!!"
            //});
        } else {
            //callbackFun(RESULT_CODE.SUCCESS, { "txn_hash": txhash })

            $("#arenaContainer").hide();
            $("#battleCompleted").fadeIn();

            // Expire in 4 hours
            setCookieInMinutes("angel1", angelId, 15);
            setCookieInMinutes("angel1", angel2Id, 15);
        }
    });
};

var arenaBattle3 = function () {
    var angelId = $("#thunderdomeContainer #angelToBattle").data("angelid");
    var angel2Id = $("#thunderdomeContainer #angel2ToBattle").data("angelid");
    var petId = $("#thunderdomeContainer #petToBattle").data("petid");
    var pet2Id = $("#thunderdomeContainer #pet2ToBattle").data("petid");
    var accessoryId = $("#thunderdomeContainer #accessoryToBattle").data("accessoryid");

    arenaBattle3ContractInstance.TDBattle(angelId, angel2Id, petId, pet2Id, accessoryId, { gas: 550000 }, function (err, txhash) {
        if (err) {
            console.log("ERROR_LOG|ArenaBattle3_txn_fail|error=" + err);
            //callbackFun(RESULT_CODE.ERROR_SERVER, {
            //    "error": "blockchain transaction fail!!"
            //});
        } else {
            //callbackFun(RESULT_CODE.SUCCESS, { "txn_hash": txhash })

            $("#arenaContainer").hide();
            $("#battleCompleted").fadeIn();

            // Expire in 4 hours
            setCookieInMinutes("angel1", angelId, 15);
            setCookieInMinutes("angel1", angel2Id, 15);
        }
    });
};

//******* Page functions **************//

var loadUrlHashState = function () {
    var hash = window.location.hash;
    if (hash === "#meadows") {
        $("#loader").fadeIn();

        loadArena(false);
        loadForest(false);
        loadMeadows(true);
        loadThunderdome(false);
    } else if (hash === "#forest") {
        $("#loader").fadeIn();

        loadArena(false);
        loadMeadows(false);
        loadForest(true);
        loadThunderdome(false);
    } else if (hash === "#thunderdome") {
        $("#loader").fadeIn();

        loadArena(false);
        loadMeadows(false);
        loadForest(false);
        loadThunderdome(true);
    } else {
        loadMeadows(false);
        loadForest(false);
        loadArena(true);
        loadThunderdome(false);
    }
};

var loadArena = function (isShow) {
    if (isShow === true) {
        // Show title text
        $("#titleText").show();

        // Hide arena screen
        $("#battleHell").fadeIn(200);
        $("#battleHellSteam").fadeIn(200);
        $("#arenaSelectionContainer").fadeIn(200);
    } else {
        // Hide arena screen
        $("#battleHell").hide();
        $("#battleHellSteam").hide();
        $("#arenaSelectionContainer").hide();
    }
};

var loadMeadows = function (isShow) {
    if (isShow === true) {
        if (needAngelCards) {
            $("#warnNoCardsFoundAngel").fadeIn(200);
        }

        // Hide title text
        $("#titleText").hide();

        // Hide arena screen
        $("#battleMeadows").fadeIn(200);
        $("#meadowsContainer").fadeIn(200);
        $("#angelsContainer").fadeIn(200);

        $("#battleForest").hide();
        $("#forestContainer").hide();

    } else {
        // Hide arena screen
        $("#battleMeadows").hide();
        $("#meadowsContainer").hide();

        $("#battleForest").hide();
        $("#forestContainer").hide();

        $("#angelsContainer").hide();
    }

};

var loadForest = function (isShow) {
    if (isShow === true) {
        if (needAngelCards) {
            $("#warnNoCardsFoundAngel").fadeIn(200);
        }

        // Hide title text
        $("#titleText").hide();

        // Hide arena screen
        $("#battleForest").fadeIn(200);
        $("#forestContainer").fadeIn(200);
        $("#angelsContainer").fadeIn(200);

        $("#battleMeadows").hide();
        $("#meadowsContainer").hide();

    } else {
        // Hide arena screen
        $("#battleForest").hide();
        $("#forestContainer").hide();

        $("#battleMeadows").hide();
        $("#meadowsContainer").hide();

        $("#angelsContainer").hide();
    }

};

var loadThunderdome = function (isShow) {
    if (isShow === true) {
        if (needAngelCards) {
            $("#warnNoCardsFoundAngel").fadeIn(200);
        }

        // Hide title text
        $("#titleText").hide();

        // Hide arena screen
        $("#battleThunderdome").fadeIn(200);
        $("#thunderdomeContainer").fadeIn(200);
        $("#angelsContainer").fadeIn(200);

        $("#battleForest").hide();
        $("#forestContainer").hide();
        $("#battleMeadows").hide();
        $("#meadowsContainer").hide();

    } else {
        // Hide arena screen
        $("#battleForest").hide();
        $("#forestContainer").hide();

        $("#battleMeadows").hide();
        $("#meadowsContainer").hide();

        $("#battleThunderdome").hide();
        $("#thunderdomeContainer").hide();

        $("#angelsContainer").hide();
    }

};


// This shows the begin battle button
var showBeginBattle = function () {
    $("#beginBattle").fadeIn(200);
    $("#accessoriesContainer").hide();
    $("#warnNoCardsFoundAccessory").hide();
    $("#chooseAccessory").hide();

    $("#beginBattleButton").on("click", function (event) {
        event.stopImmediatePropagation();
        event.preventDefault();

        const hash = window.location.hash;
        if (hash === "#meadows") {
            arenaBattle1();
        } else if (hash === "#forest") {
            arenaBattle2();
        } else if (hash === "#thunderdome") {
            arenaBattle3();
        }
    });
};

// This is the arena battle button setup to choose Meadow, Forest, or ThunderDome
var setupBattleButtons = function () {
    $("#meadowRock").click(function () {
        if (isEtherAccountActive()) {

            // Add hash to url
            parent.location.hash = "meadows";

            // Load the Meadows State
            loadArena(false);
            loadMeadows(true);

        } else {
            showMetaMaskAlertNotLoggedIn();
        }
    });

    $("#forestRock").click(function () {
        if (isEtherAccountActive()) {

            // Add hash to url
            parent.location.hash = "forest";

            // Load the Meadows State
            loadArena(false);
            loadForest(true);

        } else {
            showMetaMaskAlertNotLoggedIn();
        }
    });

    $("#thunderDomeRock").click(function () {
        if (isEtherAccountActive()) {

            // Add hash to url
            parent.location.hash = "thunderdome";

            // Load the Meadows State
            loadArena(false);
            loadForest(false);
            loadThunderdome(true);

        } else {
            showMetaMaskAlertNotLoggedIn();
        }
    });

    $("#keepBattling").on("click", function (event) {
        event.stopImmediatePropagation();
        event.preventDefault();

        setTimeout(function () {
            window.location.href = '/battle';
        }, 100);
    });
};