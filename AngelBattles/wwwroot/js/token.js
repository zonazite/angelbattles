
// Global Variables
var rpcConnected = null;
var account = undefined;
var angelDict = [];
var petDict = [];
var accessoryDict = [];

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
                    break;
                case "3":
                    console.log('INFO_LOG|running_on_ropsten_test_network.');
                    break;
                default:
                    console.log('INFO_LOG|running_on_unknown_network.');
                    break;
            }
        });
        rpcConnected = true;
    } else {
        rpcConnected = false;
        account = null;
    }

    // init contract
    angelCardDataContractInstance = getAngelCardDataContractInstance();
    petCardDataContractInstance = getPetCardDataContractInstance();
    accessoryDataContractInstance = getAccessoryDataContractInstance();

    // Call Contract Read Functions
    var cardId = getCardId();

    if (rpcConnected) {
        if (getCardType() === "angel") {
            getAngel(cardId);
        } else if (getCardType() === "pet") {
            getPet(cardId);
        } else if (getCardType() === "acc") {
            getAccessory(cardId);
        }
    }
});

// ****************** Page functions ***********************

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

var getCardId = function () {
    return getParameterByName('id');
};

var getCardType = function () {
    return getParameterByName('type');
};

// *************** ANGELS *******************

var getAngel = function (angelId) {
    angelCardDataContractInstance.getAngel(angelId, function (err2, result2) {
        if (err2) {
            console.log("ERROR_LOG|getAngel_txn_fail|error=" + err2);
            //callbackFun(RESULT_CODE.ERROR_SERVER, {
            //    "error": "blockchain call failed, error=" + err
            //});
        } else {
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
            angelDict.push({
                "angelId": angelId,
                "angelCardSeriesId": angelCardSeriesId,
                "battlePower": battlePower,
                "aura": aura,
                "experience": experience,
                "price": price,
                "createdTime": createdTime,
                "owner": owner
            });

            var angel = {
                AngelData: angelDict
            };

            $.ajax({
                dataType: 'html',
                type: 'POST',
                url: '/Token/GetAngel',
                data: angel,
                success: function (response) {
                    console.log(response);

                    window.location.href = '/api/TokenApi/byType?type=angel&value=' + encodeURIComponent(response);
                },
                failure: function (response) {
                }
            });
        }
    });
};

// *************** PETS *******************

var getPet = function (petId) {
    petCardDataContractInstance.getPet(petId, function (err2, result2) {
        if (err2) {
            console.log("ERROR_LOG|getPet_txn_fail|error=" + err2);
            //callbackFun(RESULT_CODE.ERROR_SERVER, {
            //    "error": "blockchain call failed, error=" + err
            //});
        } else {
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
            petDict.push({
                "petId": petId,
                "petCardSeriesId": petCardSeriesId,
                "name": name,
                "luck": luck,
                "auraRed": auraRed,
                "auraBlue": auraBlue,
                "auraYellow": auraYellow,
                "owner": owner
            });

            var pet = {
                PetData: petDict
            };

            $.ajax({
                dataType: 'html',
                type: 'POST',
                url: '/Token/GetPet',
                data: pet,
                success: function (response) {
                    console.log(response);

                    window.location.href = '/api/TokenApi/byType?type=pet&value=' + encodeURIComponent(response);
                },
                failure: function (response) {
                }
            });
        }
    });
};

// *************** ACCESSORIES *******************

var getAccessory = function (accId) {
    accessoryDataContractInstance.getAccessory(accId, function (err2, result2) {
        if (err2) {
            console.log("ERROR_LOG|getAccessory_txn_fail|error=" + err2);
            //callbackFun(RESULT_CODE.ERROR_SERVER, {
            //    "error": "blockchain call failed, error=" + err
            //});
        } else {
            var accessoryID = result2[0].toNumber();
            var accessorySeriesID = result2[1].toNumber();
            var owner = result2[2].toString();

            // Add to the collection only the pets that the owner owns
            accessoryDict.push({
                "accessoryId": accessoryID,
                "accessorySeriesId": accessorySeriesID,
                "owner": owner
            });

            var acc = {
                AccessoryData: accessoryDict
            };

            $.ajax({
                dataType: 'html',
                type: 'POST',
                url: '/Token/GetAccessory',
                data: acc,
                success: function (response) {
                    console.log(response);

                    window.location.href = '/api/TokenApi/byType?type=acc&value=' + encodeURIComponent(response);
                },
                failure: function (response) {
                }
            });
        }
    });
};