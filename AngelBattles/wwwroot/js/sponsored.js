$(document).ready(function () {
    var scene = document.getElementById('scene');
    var parallaxInstance = new Parallax(scene, {
        relativeInput: true
    });
    parallaxInstance.friction(0.2, 0.2);

    $("#goToLeaderboard").on("click", function (event) {
        event.stopImmediatePropagation();
        event.preventDefault();

        location.reload();
    });

    setupAddTeamConfirm();

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

    $("#addSponsoredLeaderboardConfirm").on("click", function (event) {
        event.stopImmediatePropagation();
        event.preventDefault();

        var sponsorshipAmount = $("#sponsorshipAmountSelect").val();
        var duration = $("#numberOfDaysSelect").val();
        var message = $('[name="messageInput"]').val();
        var url = $('[name="urlInput"]').val();
        var logo = $('[name="logoInput"]').val();

        if (sponsorshipAmount === "Choose...") {
            $("#sponsorshipAmountContainer").addClass("bg-danger");
        } else if (duration === "Choose...") {
            $("#numberOfDaysContainer").addClass("bg-danger");
        } else if (message === "") {
            $("#messageContainer").addClass("bg-danger");
        } else if (url === "") {
            $("#urlContainer").addClass("bg-danger");
        } else if (!isValidUrl(url)) {
            $("#urlContainer").addClass("bg-danger");
        } else if (logo === "") {
            $("#logoContainer").addClass("bg-danger");
        } else if (!isValidLogoType()) {
            $("#logoContainer").addClass("bg-danger");
        } else {
            $("#sponsorshipAmountContainer").removeClass("bg-danger");
            $("#numberOfDaysContainer").removeClass("bg-danger");
            $("#messageContainer").removeClass("bg-danger");
            // Call openleaderboard on web3js
            openLeaderboard();
        }
    });

    $("#sponsorshipAmountSelect").change(function () {
        var sponsorshipAmount = $("#sponsorshipAmountSelect").val();

        if (sponsorshipAmount === "Choose...") {
            $("#sponsorshipAmountContainer").addClass("bg-danger");
        } else {
            $("#sponsorshipAmountContainer").removeClass("bg-danger");
        }
    });

    $("#numberOfDaysContainer").change(function () {
        var duration = $("#numberOfDaysSelect").val();

        if (duration === "Choose...") {
            $("#numberOfDaysContainer").addClass("bg-danger");
        } else {
            $("#numberOfDaysContainer").removeClass("bg-danger");
        }
    });

    $('#messageInput').keyup(function () {
        $("#messageContainer").removeClass("bg-danger");
    });

    $('#urlInput').keyup(function () {
        $("#urlContainer").removeClass("bg-danger");
    });

    $('#logoInput').change(function () {
        $("#logoContainer").removeClass("bg-danger");
    });

});

// Global Variables
var rpcConnected = null;
var account = undefined;
var leaderboardDict = [];
var leaderboardTeamsByRankDict = [];
var angelDict = [];
var petDict = [];
var accessoryDict = [];
var needAngelCards = false;
var needPetCards = false;
var needAccessoryCards = false;
var vsPosition = -1;
var ownersAngelsInPlayDict = [];
var ownersPetsInPlayDict = [];
var ownersAccInPlayDict = [];
var restrictcardseriesid = -1;
var totalLeaderboards = 0;

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
                //location.reload();
                dispatchEvent(new Event('load'));

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
    sponsoredLeaderboardDataContractInstance = getSponsoredLeaderboardDataContractInstance();
    sponsoredLeaderboardContractInstance = getSponsoredLeaderboardContractInstance();
    angelCardDataContractInstance = getAngelCardDataContractInstance();
    petCardDataContractInstance = getPetCardDataContractInstance();
    accessoryDataContractInstance = getAccessoryDataContractInstance();
    leaderboardSlogansContractInstance = getLeaderboardSlogansInstance();
    sponsoredMedalsContractInstance = getSponsoredMedalsContractInstance();

    // Call Contract Read Functions
    if (rpcConnected) {
        loadLeaderboards();

        setupEvents();
    }
});

//*********** Helper Functions *************//

var loadLeaderboards = function () {
    $("#loader").fadeIn();

    getLeaderboard(null, DisplayLeaderboardRows);
    getAngelByIndex(null, DisplayAngelCards);
    getPetByIndex(null, DisplayPetCards);
    getAccessoryByIndex(null, DisplayAccessoryCards);
}

function DisplayLeaderboardRows(value, value2) {
    // Load all the cards
    var leaderboard = {
        SponsoredLeaderboardList: value,
        SponsoredLeaderboardTeamsList: value2
    };

    $.ajax({
        dataType: 'html',
        type: 'POST',
        url: '/Sponsored/GetSponsoredLeaderboardRows',
        data: leaderboard,
        success: function (response) {
            $("#loader").hide();

            $('#sponsoredContainer').html(response);
            $('#sponsoredContainer').fadeIn();

            // Setup logic for the Challenge Last Position button
            setupChallengeLastPositionButton();

            // Show claim metal

            loadEachTeamName();
            loadEachTeamAngel();
            loadEachTeamPet();
            loadEachTeamAccessory();
            loadEachLeaderboardEndTime();
        },
        failure: function (response) {
            $("#warnNoCardsFound").show();
        }
    });
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

                            showBeginBattle();
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

                showBeginBattle();

                $("#accessoriesContainer").fadeOut(200);

                $("#accessoryImage").fadeOut(200, function () {
                }).fadeIn(200);

                $("#accessoryToBattle").attr("data-accessoryid", $item.data("accessoryid"));
            });

            $("#skipAccessorySelection").on("click", function (event) {
                event.stopImmediatePropagation();
                event.preventDefault();

                showBeginBattle();
            });
        },
        failure: function (response) {
            console.log('INFO_LOG|GetAccessoryCardRows response failed');
        }
    });
};

function isEtherAccountActive() {
    return account !== null && account !== undefined;
};

function isValidUrl(s) {
    var regexp = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;
    return regexp.test(s);
};

var isValidLogoType = function () {
    var extension = $('#logoInput').val().split('.').pop();
    if (['png'].indexOf(extension) > -1) {
        return true;
    } else {
        return false;
    }
};

//******* Page functions **************//

//var loadUrlHashState = function () {
//    var hash = window.location.hash;
//    if (hash === "#vsbattle") {
//        loadVsBattle(true);
//    } else {
//        loadVsBattle(false);
//    }
//}

var loadVsBattle = function (isShow) {
    if (isShow) {
        $("#FightContainer").show();
        $("#sponsoredContainer").hide();
    } else {
        $("#FightContainer").hide();
        $("#sponsoredContainer").show();
    }
};

// This shows the begin battle button
var showBeginBattle = function () {
    $("#accessoriesContainer").hide();
    $("#vsPlaceholder").hide();
    $("#vsCommandContainer").removeClass("bg-danger").addClass("bg-warning");
    $("#warnNoCardsFoundAccessory").hide();
    $("#chooseAccessory").hide();
    $("#beginBattleButton").show();

    if (isMobileDevice() && $("#accessoryImageOpponent").attr("src") === "/images/Site/blank.gif") {
        $("#accessoryToBattleOpponent").hide();
    }

    $("#vsContainer").fadeIn(200);

    var tag = $("#beginBattleButton");
    $('html,body').animate({ scrollTop: tag.offset().top }, 'slow');
};

var loadEachTeamName = function () {
    $("tr.leaderboardRow").each(function (index, value) {
        var $item = $(this);
        var angelId = $item.data("angelid");

        leaderboardSlogansContractInstance.getSlogan(angelId, function (err, result) {
            if (err) {
                console.log("ERROR_LOG|getSlogan|error=" + err);
            } else {
                var teamName = result.toString();

                $element = $("tr[data-angelid='" + angelId + "']");
                $element.find(".teamName").text(teamName);
            }
        });
    });
};

var loadEachTeamAngel = function () {
    $("tr.leaderboardRow").each(function (index, value) {
        var $item = $(this);
        var angelid = $item.data("angelid");
        var isLive = $item.data("islive");

        angelCardDataContractInstance.getAngel(angelid, function (err, result) {
            if (err) {
                console.log("ERROR_LOG|getAngel_txn_fail|error=" + err);
            } else {
                var angelId = result[0].toNumber();
                var angelCardSeriesId = result[1].toNumber();
                var battlePower = result[2].toNumber();
                var aura = result[3].toNumber();
                var experience = result[4].toNumber();
                var price = result[5].toNumber();
                if (price > 0)
                    price = Number(web3.fromWei(price, 'ether'));
                var createdTime = result[6].toString();
                var lastBattleTime = result[7].toString();
                var lastVsBattleTime = result[8].toString();
                var lastBattleResult = result[9].toNumber();
                var owner = result[10].toString();

                var $element = $("tr[data-angelid='" + angelId + "']");

                var angelImageSrc = getCardSeriesImageSrc("angel", angelCardSeriesId.toString());
                $element.find(".angelImage").attr("src", angelImageSrc);

                var gemImageSrc = getAuraGemImageSrc(aura.toString());
                $element.find(".angelAuraGem").attr("src", gemImageSrc);

                $element.find(".angelBP").text(battlePower);
                $element.find(".angelEXP").text(experience);

                $element.attr("data-ownerid", owner);
                $element.find(".ownerAddress").text(owner);
                $element.attr("data-angelseriesid", angelCardSeriesId);

                // Show claim medal button
                var claimMedal = $element.find(".claimMedal");
                if (claimMedal.length > 0) {
                    if (claimMedal.data("islive") === true) {
                        claimMedal.show();
                    }
                }
                

                // Set if the it is the owners row -- make row yellow
                if (owner === account.toString()) {
                    $element.addClass("bg-warning").addClass("vs-battle");

                    // Get last position angelid to check if they just did a firstbattle(), if so prevent them from challenging
                    var lastPositionAngelId = $(".last-position").data("angelid");

                    $element.find(".addTeamName").show();
                    

                    // Push owners angels to dict so that we can exclude them from the challenge selection
                    if (isLive) {
                        ownersAngelsInPlayDict.push(angelId);
                    }
                }
            }
        });
    });
};

var loadEachTeamPet = function () {
    $("tr.leaderboardRow").each(function (index, value) {
        var $item = $(this);
        var petid = $item.data("petid");
        var isLive = $item.data("islive");

        petCardDataContractInstance.getPet(petid, function (err, result) {
            if (err) {
                console.log("ERROR_LOG|getPet_txn_fail|error=" + err);
            } else {
                var petId = result[0].toNumber();
                var petCardSeriesId = result[1].toNumber();
                var name = result[2].toString();
                var luck = result[3].toNumber();
                var auraRed = result[4].toNumber();
                var auraBlue = result[5].toNumber();
                var auraYellow = result[6].toNumber();
                var lastTrainingTime = result[7].toString();
                var lastBreedingTime = result[8].toString();
                var owner = result[9].toString();

                $element = $("tr[data-petid='" + petId + "']");
                $element.attr("data-petseriesid", petCardSeriesId);

                // Add gold-card to pet
                //var isGoldCardObject = isGoldCard("pet", petCardSeriesId.toString(), petId.toString());
                //if (isGoldCardObject) {
                //    $element.find(".petGoldContainer").addClass("gold-card");
                //}

                var petImageSrc = getCardSeriesImageSrc("pet", petCardSeriesId.toString());
                $element.find(".petImage").attr("src", petImageSrc);

                $element.find(".petLuck").text(luck);
                $element.find(".petRedAura").text(auraRed);
                $element.find(".petBlueAura").text(auraBlue);
                $element.find(".petYellowAura").text(auraYellow);

                // If it is the owners pet then add to dict to exclude from list later
                if ($element.data("ownerid") === account.toString()) {
                    // Push owners angels to dict so that we can exclude them from the challenge selection
                    if (isLive) {
                        ownersPetsInPlayDict.push(petId);
                    }
                }
            }
        });
    });
};

var loadEachTeamAccessory = function () {
    $("tr.leaderboardRow").each(function (index, value) {
        var $item = $(this);
        var accid = $item.data("accessoryid");
        var isLive = $item.data("islive");

        accessoryDataContractInstance.getAccessory(accid, function (err, result) {
            if (err) {
                console.log("ERROR_LOG|getAccessory_txn_fail|error=" + err);
            } else {
                var accessoryID = result[0].toNumber();
                var accessorySeriesID = result[1].toNumber();
                var owner = result[2].toString();

                $element = $("tr[data-accessoryid='" + accessoryID + "']");
                $element.attr("data-accessoryseriesid", accessorySeriesID);

                if (owner !== "0x0000000000000000000000000000000000000000") {

                    var accImageSrc = getCardSeriesImageSrc("acc", accessorySeriesID.toString());
                    $element.find(".accImage").attr("src", accImageSrc);

                    $element.find(".accText").text(getCardDescription("acc", accessorySeriesID.toString()));


                    // If it is the owners acc then add to dict to exclude from list later
                    if ($element.data("ownerid") === account.toString()) {
                        if (isLive) {
                            // Push owners acc to dict so that we can exclude them from the challenge selection
                            ownersAccInPlayDict.push(accessoryID);
                        }
                    }

                } else {
                    $element.find(".accessoryItemContainer").hide();
                }
            }
        });
    });
};

var loadEachLeaderboardEndTime = function () {
    $(".endCountDownTime").each(function (index, value) {
        var $item = $(this);

        var endTime = new Date(parseInt($item.data("endtime")) * 1000);

        $item.countdown(endTime, function (event) {
            $item.html(
                event.strftime('Earliest End Time: %D days %H hours %M minutes %S seconds')
            );
        });
    });
};

$(document).delegate("#openSponsoredBattle", "click", function (event) {
    event.stopImmediatePropagation();
    event.preventDefault();

    $("#createSponshipDataContainer").show();
    $("#transactionFailedWarn").hide();
    $("#transactionSentWarn").hide();

    $("#modalCreateSponsoredBattle").modal('show');
});

$(document).delegate(".addTeamName", "click", function (event) {
    event.stopImmediatePropagation();
    event.preventDefault();

    var $item = $(this).parents(".leaderboardRow");
    $('#modalAddTeamName').attr("data-teamnameangelid", $item.data("angelid"));

    $('#modalAddTeamName').modal('show');
});

$(document).delegate(".claimMedal", "click", function (event) {
    event.stopImmediatePropagation();
    event.preventDefault();

    var $item = $(this);
    claimMedals($item, $item.data("leaderboardid"));
});

// Wire up vs-battle click 
// Click is called from the leaderboard row click
$(document).delegate(".challengeNextPosition", "click", function (event) {
    event.stopImmediatePropagation();
    event.preventDefault();

    var $item = $(this).parents(".leaderboardRow");

    var newRankPosition = parseInt($item.data("rankposition")) - 1;
    challengeSpotBattle($(this).parents(".table").data("leaderboardid"), newRankPosition);
});

var setupAddTeamConfirm = function () {
    $("#addTeamNameConfirm").on("click", function (event) {
        event.stopImmediatePropagation();
        event.preventDefault();

        var teamName = $('[name="teamNameInput"]').val();
        if (teamName === "") {
            $("#teamNameContainer").addClass("bg-danger");
        } else {
            $("#teamNameContainer").removeClass("bg-danger");
            addTeamName();
        }
    });

    $('[name="teamNameInput"]').keyup(function () {
        $("#teamNameContainer").removeClass("bg-danger");
    });
};

var setupChallengeLastPositionButton = function () {
    $(".challengeLastPosition").on("click", function (event) {
        event.stopImmediatePropagation();
        event.preventDefault();

        var $this = $(this);

        restrictcardseriesid = $this.data("restrictcardseriesid");

        $("#vsContainer").attr("data-leaderboardid", $this.parents(".sponsorContainer").find(".table").data("leaderboardid"));

        // Reset vsPosition to -1 so that correct contract function is called
        vsPosition = -1;

        // Show right container
        $("#sponsoredHeaderContainer").hide();
        $("#sponsoredContainer").hide()
        $("html, body").animate({ scrollTop: $("#top").offset().top }, 500);
        $("#FightContainer").show();

        // Setup buttons
        setupCardButtons();

        // Populate opponent values
        var $leaderboardOpponent = $this.parents(".sponsorContainer").find(".last-position");
        // Angel Opponent
        $("#angelImageOpponent").attr("src", getCardSeriesSimpleImageSrc("angel", $leaderboardOpponent.data("angelseriesid").toString()));
        $("#angelAuraGemOpponent").attr("src", $leaderboardOpponent.find(".angelAuraGem").attr("src"));
        $("#angelBPOpponent").text($leaderboardOpponent.find(".angelBP").text());
        $("#angelEXPOpponent").text($leaderboardOpponent.find(".angelEXP").text());
        // Pet Opponent
        $("#petImageOpponent").attr("src", getCardSeriesSimpleImageSrc("pet", $leaderboardOpponent.data("petseriesid").toString(), isGoldCard("pet", $leaderboardOpponent.data("petseriesid").toString(), $leaderboardOpponent.data("petid").toString())));
        $("#petLuckOpponent").text($leaderboardOpponent.find(".petLuck").text());
        $("#petRedAuraOpponent").text($leaderboardOpponent.find(".petRedAura").text());
        $("#petBlueAuraOpponent").text($leaderboardOpponent.find(".petBlueAura").text());
        $("#petYellowAuraOpponent").text($leaderboardOpponent.find(".petYellowAura").text());
        // Accessory Opponent
        var accImage = $leaderboardOpponent.find(".accImage").attr("src");
        $("#accessoryTextOpponent").text($leaderboardOpponent.find(".accText").text());
        if (accImage !== "/images/Site/blank.gif") {
            $("#accessoryImageOpponent").attr("src", accImage);
        } else {
            $("#accessoryToBattleOpponent").css('background', 'gray');
        }

        // Last Position logic
        $("#chooseAngel").addClass("hand-cursor");
        $("#teamNameContainer").show();
    });
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
    } else if (restrictcardseriesid === 1) {
        $("#angelsAzaelAndBelowContainer").fadeIn();
    } else if (restrictcardseriesid === 2) {
        $("#angelsGabrielAndBelowContainer").fadeIn();
    } else if (restrictcardseriesid === 3) {
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

        // Show need pet warning if they need to get some
        if ($(".pet-battle-card").length === 0) {
            $("#warnNoCardsFoundPet").show();
        }

        choosePet();
    });

    $("#chooseAccessoryGranted").on("click", function (event) {
        event.stopImmediatePropagation();
        event.preventDefault();

        chooseAccessory();
    });

    $("#skipAccessory").on("click", function (event) {
        event.stopImmediatePropagation();
        event.preventDefault();

        showBeginBattle();
    });

    $("#beginBattleButton").on("click", function (event) {
        event.stopImmediatePropagation();
        event.preventDefault();

        firstBattle();
    });
};

//******* Contract functions **********//
//******* LEADERBOARD *********************//

//--------- Leaderboard -----------//
var getTotalLeaderboards = function (callbackFun) {
    sponsoredLeaderboardDataContractInstance.getTotalLeaderboards(function (err, result) {
        if (err) {
            console.log("ERROR_LOG|getTotalLeaderboards_txn_fail|error=" + err);
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

var getLeaderboard = function (_, callbackFun) {

    getTotalLeaderboards(getLeaderboardByPosition);

    async function getLeaderboardByPosition(value, callbackFun2) {
        totalLeaderboards = value["value"];

        if (totalLeaderboards > 0) {
            var i;
            for (i = 0; i < totalLeaderboards; i++) {
                promises.push(processGetLeaderboardByPosition(i));
            }

            await Promise.all(promises);

            var filteredLeaderboards = getLiveLeaderboards(leaderboardDict, "true");
            var leaderboardIdList = leaderboardDict.map(function (n, i) { return n.leaderboardId; });
            $.each(leaderboardIdList, function (key, value) {
                var rank;
                for (rank = 0; rank < 4; rank++) {
                    promisesTeamsFromLeaderboardByRank.push(processGetTeamsFromLeaderboardByRank(value, rank));
                }
            });

            await Promise.all(promisesTeamsFromLeaderboardByRank);

            // Return the lists out
            callbackFun(leaderboardDict, leaderboardTeamsByRankDict);
        } else {
            $("#sponsoredContainer").hide();
        }
    }
};

var promises = [];
var processGetLeaderboardByPosition = function (i) {
    return new Promise(
        function (resolve, reject) {
            sponsoredLeaderboardDataContractInstance.getLeaderboard(i, function (err, result) {
                if (err) {
                    console.log("ERROR_LOG|getAngelByIndex_txn_fail|error=" + err);
                    reject(err);
                    //callbackFun(RESULT_CODE.ERROR_SERVER, {
                    //    "error": "blockchain call failed, error=" + err
                    //});
                } else {

                    var startTime = result[0].toNumber();
                    var endTime = result[1].toNumber();
                    var isLive = result[2].toString();
                    var sponsor = result[3].toString();
                    var prize = web3.fromWei(result[4].toString(), 'ether');
                    var numTeams = result[5].toNumber();
                    var message = result[6].toString();
                    var medalsClaimed = result[7].toString();

                    resolve(leaderboardDict.push({
                        "leaderboardId": i,
                        "startTime": startTime,
                        "endTime": endTime,
                        "isLive": isLive,
                        "sponsor": sponsor,
                        "prize": prize,
                        "message": message,
                        "medalsClaimed": medalsClaimed
                    }));
                }
            });
        }
    );
};

var promisesTeamsFromLeaderboardByRank = [];
var processGetTeamsFromLeaderboardByRank = function (leaderboardId, rank) {
    return new Promise(
        function (resolve, reject) {
            sponsoredLeaderboardDataContractInstance.getTeamFromLeaderboard(leaderboardId, rank, function (err, result) {
                if (err) {
                    console.log("ERROR_LOG|getTeamFromLeaderboard_txn_fail|error=" + err);
                    reject(err);
                    //callbackFun(RESULT_CODE.ERROR_SERVER, {
                    //    "error": "blockchain call failed, error=" + err
                    //});
                } else {

                    var angelId = result[0].toNumber();
                    var petId = result[1].toNumber();
                    var accessoryId = result[2].toNumber();

                    resolve(leaderboardTeamsByRankDict.push({
                        "leaderboardId": leaderboardId,
                        "rank": rank,
                        "angelId": angelId,
                        "petId": petId,
                        "accessoryId": accessoryId
                    }));
                }
            });
        }
    );
};

var getLiveLeaderboards = function (dict, isLive) {
    var filteredLeaderboards = $.grep(dict, function (n, i) {
        return n.isLive === isLive; // isLive: "true" or "false"
    });

    return filteredLeaderboards;
}


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


var addTeamName = function () {
    var angelId = $('#modalAddTeamName').data("teamnameangelid");
    var name = $('[name="teamNameInput"]').val();

    leaderboardSlogansContractInstance.setSlogan(angelId, name, { gas: 250000 }, function (err, txhash) {
        if (err) {
            console.log("ERROR_LOG|setSlogan_txn_fail|error=" + err);
            //callbackFun(RESULT_CODE.ERROR_SERVER, {
            //    "error": "blockchain transaction fail!!"
            //});
        } else {
            //callbackFun(RESULT_CODE.SUCCESS, { "txn_hash": txhash })
            console.log("INFO_LOG|setSlogan_txn_success|name=" + name + ", angelId" + angelId);

            $('#modalAddTeamName').modal('hide');
        }
    });
};

var firstBattle = function () {
    var leaderboardId = $("#vsContainer").data("leaderboardid");
    var angelId = $("#angelToBattle").data("angelid");
    var petId = $("#petToBattle").data("petid");
    var accessoryId = $("#accessoryToBattle").data("accessoryid");

    sponsoredLeaderboardContractInstance.firstBattle(leaderboardId, angelId, petId, accessoryId, { gas: 350000 }, function (err, txhash) {
        if (err) {
            console.log("ERROR_LOG|firstBattle_txn_fail|error=" + err);
            //callbackFun(RESULT_CODE.ERROR_SERVER, {
            //    "error": "blockchain transaction fail!!"
            //});
        } else {
            //callbackFun(RESULT_CODE.SUCCESS, { "txn_hash": txhash })

            $("#sponsoredContainer").hide();
            $("#sponsoredHeaderContainer").hide();
            $("#vsContainer").hide();
            $("#vsBattleInfo").hide();
            $("#battleCompleted").fadeIn();
        }
    });
};

var challengeSpotBattle = function (leaderboardId, challengeSpot) {
    sponsoredLeaderboardContractInstance.challengeSpotBattle(leaderboardId, challengeSpot, { gas: 350000 }, function (err, txhash) {
        if (err) {
            console.log("ERROR_LOG|challengeSpotBattle_txn_fail|error=" + err);
            //callbackFun(RESULT_CODE.ERROR_SERVER, {
            //    "error": "blockchain transaction fail!!"
            //});
        } else {
            //callbackFun(RESULT_CODE.SUCCESS, { "txn_hash": txhash })

            $("#sponsoredContainer").hide();
            $("#sponsoredHeaderContainer").hide();
            $("#vsContainer").hide();
            $("#vsBattleInfo").hide();
            $("#battleCompleted").fadeIn();
        }
    });
};

var openLeaderboard = function () {
    var sponsorshipAmount = $("#sponsorshipAmountSelect").val();
    var duration = $("#numberOfDaysSelect").val();
    var message = "~" + $('[name="urlInput"]').val() + "^ " + $('[name="messageInput"]').val();

    sponsoredLeaderboardDataContractInstance.openLeaderboard(duration, message, { value: web3.toWei(sponsorshipAmount.toString(), 'ether'), gas: 500000 }, function (err, txhash) {
        if (err) {
            console.log("ERROR_LOG|challengeSpotBattle_txn_fail|error=" + err);
            //callbackFun(RESULT_CODE.ERROR_SERVER, {
            //    "error": "blockchain transaction fail!!"
            //});
        } else {
            //callbackFun(RESULT_CODE.SUCCESS, { "txn_hash": txhash })

            // Upload logo
            uploadFile();
        }
    });
};

var uploadFile = function() {
    var $image = $('#logoInput')[0].files[0];
    var extension = "";
    if ($image.type === "image/gif") {
        extension = ".gif";
    } else if ($image.type === "image/png") {
        extension = ".png";
    } else if ($image.type === "image/jpeg") {
        extension = ".jpg";
    } else if ($image.type === "image/bmp") {
        extension = ".bmp";
    } else if ($image.type === "image/webp") {
        extension = ".webp";
    }

    var formData = new FormData();
    formData.append('file', $image, totalLeaderboards.toString() + extension);

    $.ajax({
        url: '/Sponsored/UploadFile',
        type: 'POST',
        processData: false, // important
        contentType: false, // important
        dataType: 'json',
        data: formData,
        success: function (response) {
            $("#createSponshipDataContainer").hide();
            $("#transactionSentWarn").show();
        },
        failure: function (response) {
            $("#createSponshipDataContainer").hide();
            $("#transactionFailedWarn").show();
        }
    });
};

var claimMedals = function (element, leaderboardId) {
    sponsoredMedalsContractInstance.claimMedals(leaderboardId, { gas: 600000 }, function (err, txhash) {
        if (err) {
            console.log("ERROR_LOG|claimMedals_txn_fail|error=" + err);
            //callbackFun(RESULT_CODE.ERROR_SERVER, {
            //    "error": "blockchain transaction fail!!"
            //});
        } else {
            //callbackFun(RESULT_CODE.SUCCESS, { "txn_hash": txhash })
            element.hide();
        }
    });
};


//******** EVENTS *****************//
var setupEvents = function () {
    var eventBattleResult = sponsoredLeaderboardContractInstance.EventBattleResult();
    eventBattleResult.watch(function (error, result) {
        if (!error) {
            //Refresh the leaderboards
            loadLeaderboards();
            console.log("LOG|eventBattleResult_txn|AngelId:" + result.args.angelId + ", OpponentId:" + result.args.opponentId + ", Difference:" + result.args.difference);
        } else {
            console.log("ERROR_LOG|eventBattleResult_txn_fail|error=" + err);
        }
    });
};

var sponsoredDataEvents = function () {
    let events = sponsoredLeaderboardDataContractInstance.allEvents({ fromBlock: 0, toBlock: 'latest' });
    events.get(function (error, result) {
        if (!error)
            console.log(result);
    });
};

var battleResults = [];
var sponsoredEvents = function () {
    let events = sponsoredLeaderboardContractInstance.allEvents({ fromBlock: 0, toBlock: 'latest' });
    events.get(function (error, result) {
        if (!error) {

            console.log(result);

            var accessoryID = result[0].toNumber();
            var accessorySeriesID = result[1].toNumber();
            var owner = result[2].toString();

            // Add to the collection only the pets that the owner owns
            battleResults.push({
                "accessoryId": accessoryID,
                "accessorySeriesId": accessorySeriesID,
                "owner": owner
            });

        }
        else {
            console.log(error);
        }
    });
};

