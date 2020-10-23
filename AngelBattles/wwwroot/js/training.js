$(document).ready(function () {
    var scene = document.getElementById('scene');
    var parallaxInstance = new Parallax(scene, {
        relativeInput: true
    });
    parallaxInstance.friction(0.2, 0.2);

    $('#teamContainer .lazy').lazy({
        appendScroll: $('#cardsContainer')
    });

    $("#beginTrainingButton").click(function () {
        if (isEtherAccountActive()) {
            train();
        } else {
            showMetaMaskAlertNotLoggedIn();
        }
    });

    $("#keepTraining").click(function () {
        setTimeout(function () {
            location.reload();
        }, 100);
    });
});

// Global Variables
var rpcConnected = null;
var account = undefined;
var angelDict = [];
var petDict = [];

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
    trainingFieldContractInstance = getTrainingFieldDataContractInstance();

    // Call Contract Read Functions
    if (rpcConnected) {
        $("#loader").fadeIn();

        getAngelByIndex(null, DisplayAngelCards);
        getPetByIndex(null, DisplayPetCards);
    }
});

//*********** Helper Functions *************//

function DisplayAngelCards(value) {
    // Load all the cards
    var angels = {
        AngelsList: value
    };

    $.ajax({
        dataType: 'html',
        type: 'POST',
        url: '/Training/GetAngelCardRows',
        data: angels,
        success: function (response) {
            $("#loader").hide();
            $("#trainingContainer").fadeIn();

            $('#angelsContainer').html(response);
            $("#angelsContainer").fadeIn();

            // on the angel card click add them to the training container
            $(".angel-training-card").on("click", function (event) {
                var $item = $(this);

                var imageSrc = getCardSeriesImageSrc("angel", $item.data("angelcardseriesid").toString());

                var gemSrc = $item.find(".aura-gem").attr("src");
                $("#angelToTrain #angelAuraGem").attr('src', gemSrc).show();

                $("#chooseAngelText").hide();

                $("#angelToTrain #angelImage").attr('src', imageSrc).fadeIn();

                

                $("#choosePetOneText").fadeIn();

                $("#angelsContainer").fadeOut(200, function () {
                    $("#petsContainer").fadeIn(200);
                });

                $("#angelToTrain").attr("data-angelid", $item.data("angelid"));
            });
        },
        failure: function (response) {
            $("#loader").hide();
            $("#warnNoCardsFoundAngel").show();
        }
    });
}

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
            url: '/Training/GetPetCardRows',
            data: pets,
            success: function (response) {
                $('#petsContainer').append(response);

                // Show resting if cookie is set
                $(".pet-training-card").not(".in-training").each(function () {
                    var petid = $(this).data("petid");
                    var isInTraining = Cookies.get("pet1:" + petid.toString());
                    if (isInTraining === "pending") {
                        $(this).find("#inTrainingWarn").show();
                        $(this).find("#petAura").hide();
                        $(this).removeClass("hand-cursor").addClass("no-pointers-events");
                    }
                });

                // Remove cookie
                $(".pet-training-card.in-training").each(function () {
                    var petid = $(this).data("petid");
                    var isInTraining = Cookies.get("pet1:" + petid);
                    if (isInTraining === "pending") {
                        Cookies.remove("pet1:" + petid.toString());
                    }
                });

                // on the angel card click add them to the training container
                $(".pet-training-card").on("click", function (event) {
                    event.stopImmediatePropagation();
                    event.preventDefault();

                    if ($(event.target).hasClass("get-more")) {
                        var url = $(event.target).attr('href');
                        $(location).attr('href', url);
                    } else {
                        var $item = $(this);

                        var imageSrc = getCardSeriesImageSrc("pet", $item.data("petcardseriesid").toString());

                        if ($("#choosePetOneText").is(":visible")) {
                            $("#petOneImage").fadeOut(200, function () {
                                $("#petOneImage").attr('src', imageSrc);
                            }).fadeIn(200);
                            $("#choosePetOneText").hide();

                            $("#petOneToTrain").attr("data-petoneid", $item.data("petid"));

                            if (!$("#petTwoImage").is(":visible")) {
                                $("#choosePetTwoText").fadeIn();
                            }
                        } else if ($("#choosePetTwoText").is(":visible")) {
                            $("#petTwoImage").fadeOut(200, function () {
                                $("#petTwoImage").attr('src', imageSrc);
                            }).fadeIn(200);
                            $("#choosePetTwoText").hide();

                            $("#petTwoToTrain").attr("data-pettwoid", $item.data("petid"));

                            $("#petsContainer").fadeOut();

                            $("#beginTraining").fadeIn();
                        }

                        $item.fadeOut();
                    }

                    return false;
                });

                // Load pet countdown timer if applies
                loadEachPetRestEndTime();
            },
            failure: function (response) {
                $("#warnNoCardsFoundPet").show();
            }
        });
    }
}

var loadEachPetRestEndTime = function () {
    $(".petRestingTime").each(function (index, value) {
        var $item = $(this);

        var lastBattleTime = $item.data("endtime");
        if (lastBattleTime !== "") {
            var endTime = new Date(parseInt(lastBattleTime) * 1000);
            endTime.setHours(endTime.getHours() + 24);

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

//******* Page functions **************//




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
            $("#warnNoCardsFoundAngel").fadeIn();
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

        if (count >= 2) {
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
            $("#loader").hide();

            if (count === 1) {
                $("#warnNeedOneMorePetCard").fadeIn();
            } else {
                $("#warnNoCardsFoundPet").fadeIn();
            }
        }
    }
};

/**** Training ****/
var train = function () {
    var angelId = $("#angelToTrain").data("angelid");
    var pet1Id = $("#petOneToTrain").data("petoneid");
    var pet2Id = $("#petTwoToTrain").data("pettwoid");

    trainingFieldContractInstance.Train(angelId, pet1Id, pet2Id, { gas: 250000 }, function (err, txhash) {
        if (err) {
            console.log("ERROR_LOG|createAngel_txn_fail|error=" + err);
            //callbackFun(RESULT_CODE.ERROR_SERVER, {
            //    "error": "blockchain transaction fail!!"
            //});
        } else {
            //callbackFun(RESULT_CODE.SUCCESS, { "txn_hash": txhash })

            $("#trainingOuterContainer").hide();
            $("#trainingCompleted").fadeIn();

            // Expire in 4 hours
            setCookie("pet1", pet1Id, 4);
            setCookie("pet1", pet2Id, 4);
        }
    });
};