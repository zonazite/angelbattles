$(document).ready(function () {
    var scene = document.getElementById('scene');
    var parallaxInstance = new Parallax(scene, {
        relativeInput: true
    });
    parallaxInstance.friction(0.2, 0.2);

    $('#petNameInput').keyup(function () {
        $("#petNameContainer").removeClass("bg-danger");
    });

    $("#beginBreedingButton").click(function () {
        if (isEtherAccountActive()) {
            var newName = $('[name="petNameInput"]').val();
            if (newName === "") {
                $("#petNameContainer").addClass("bg-danger");
            } else {
                $("#petNameContainer").removeClass("bg-danger");
                // Call Breed Card on web3js
                breed();
            }



        } else {
            showMetaMaskAlertNotLoggedIn();
        }
    });

    $("#keepBreeding").click(function () {
        setTimeout(function () {
            location.reload();
        }, 100);
    });
});

// Global Variables
var rpcConnected = null;
var account = undefined;
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
    petCardDataContractInstance = getPetCardDataContractInstance();
    breedingStableContractInstance = getBreedingStableContractInstance();

    // Call Contract Read Functions
    if (rpcConnected) {
        $("#loader").fadeIn();

        getPetByIndex(null, DisplayPetCards);
    }
});

//*********** Helper Functions *************//

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
            url: '/Breeding/GetPetCardRows',
            data: pets,
            success: function (response) {
                $("#loader").hide();
                $("#petWindowContainer").fadeIn();

                $('#petsContainer').append(response);
                $('#petsContainer').fadeIn();

                if ($(".pet-breeding-card").length === 0) {
                    $("#warnNoCardsFound").show();
                } else if ($(".pet-breeding-card").length === 1) {
                    $("#warnNeedOneMorePetCard").show();
                }

                // Show resting if cookie is set
                $(".pet-breeding-card").not(".in-breeding").each(function () {
                    var petid = $(this).data("petid");
                    var isInTraining = Cookies.get("petBreeding:" + petid.toString());
                    if (isInTraining === "pending") {
                        $(this).find("#inBreedingWarn").show();
                        $(this).find("#petAura").hide();
                        $(this).removeClass("hand-cursor").addClass("no-pointers-events");
                    }
                });

                // Remove cookie
                $(".pet-breeding-card.in-breeding").each(function () {
                    var petid = $(this).data("petid");
                    var isInTraining = Cookies.get("petBreeding:" + petid);
                    if (isInTraining === "pending") {
                        Cookies.remove("petBreeding:" + petid.toString());
                    }
                });

                // on the angel card click add them to the training container
                $(".pet-breeding-card").on("click", function (event) {
                    event.stopImmediatePropagation();
                    event.preventDefault();

                    var $item = $(this);

                    var imageSrc = getCardSeriesImageSrc("pet", $item.data("petcardseriesid").toString());

                    if ($("#choosePetOneText").is(":visible")) {
                        $("#choosePetOne").hide();
                        $("#petOneImage").attr('src', imageSrc);
                        $("#petOneToBreed").fadeIn(200);

                        $("#petOneToBreed").attr("data-petoneid", $item.data("petid"));

                        if (!$("#petTwoImage").is(":visible")) {
                            $("#choosePetTwoText").fadeIn();
                            if ($(".pet-breeding-card").length === 1) {
                                $("#warnNeedOneMorePetCard").show();
                            }
                        }
                    } else if ($("#choosePetTwoText").is(":visible")) {
                        $("#choosePetTwo").hide();
                        $("#petTwoImage").attr('src', imageSrc);
                        $("#petTwoToBreed").fadeIn(200);

                        $("#petTwoToBreed").attr("data-pettwoid", $item.data("petid"));

                        $("#petsContainer").fadeOut();

                        $("#beginBreeding").fadeIn();
                    }

                    $item.fadeOut();

                    return false;
                });

                // Load countdown timer for pets
                loadEachPetRestEndTime();
            },
            failure: function (response) {
                $("#loader").hide();
                $("#warnNoCardsFoundPet").show();
            }
        });
    }
}

var loadEachPetRestEndTime = function () {
    $(".petRestingTime").each(function (index, value) {
        var $item = $(this);

        var lastBreedingTime = $item.data("endtime");
        if (lastBreedingTime !== "") {
            var endTime = new Date(parseInt(lastBreedingTime) * 1000);
            endTime.setHours(endTime.getHours() + 2);
            endTime.setDate(endTime.getDate() + 7);

            $item.countdown(endTime, function (event) {
                $item.html(
                    event.strftime('%D days %H hours %M minutes %S seconds')
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
var breed = function () {
    var name = $('[name="petNameInput"]').val();
    var pet1Id = $("#petOneToBreed").data("petoneid");
    var pet2Id = $("#petTwoToBreed").data("pettwoid");

    breedingStableContractInstance.Breed(pet1Id, pet2Id, name, { value: web3.toWei('0.005', 'ether'), gas: 250000 }, function (err, txhash) {
        if (err) {
            console.log("ERROR_LOG|Breed_txn_fail|error=" + err);
            //callbackFun(RESULT_CODE.ERROR_SERVER, {
            //    "error": "blockchain transaction fail!!"
            //});
        } else {
            //callbackFun(RESULT_CODE.SUCCESS, { "txn_hash": txhash })

            $("#breedingContainer").hide();
            $("#breedingCompleted").fadeIn();

            // Expire in 7 days
            setCookie("petBreeding", pet1Id, 5);
            setCookie("petBreeding", pet2Id, 5);
        }
    });
};