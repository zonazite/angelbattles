// Global Variables
var rpcConnected = null;
var account = undefined;
var angelDict = [];
var petDict = [];
var accessoryDict = [];

var angelcarddata_contract_address = "0x6d2e76213615925c5fc436565b5ee788ee0e86dc";
var angelcarddata_contract_abi = [{ "constant": true, "inputs": [{ "name": "_owner", "type": "address" }, { "name": "_index", "type": "uint256" }], "name": "getAngelByIndex", "outputs": [{ "name": "", "type": "uint64" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "uint64" }], "name": "angelCollection", "outputs": [{ "name": "angelId", "type": "uint64" }, { "name": "angelCardSeriesId", "type": "uint8" }, { "name": "owner", "type": "address" }, { "name": "battlePower", "type": "uint16" }, { "name": "aura", "type": "uint8" }, { "name": "experience", "type": "uint16" }, { "name": "price", "type": "uint256" }, { "name": "createdTime", "type": "uint64" }, { "name": "lastBattleTime", "type": "uint64" }, { "name": "lastVsBattleTime", "type": "uint64" }, { "name": "lastBattleResult", "type": "uint16" }, { "name": "ownerLock", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_angelCardSeriesId", "type": "uint8" }, { "name": "_newPrice", "type": "uint64" }, { "name": "_newMaxTotal", "type": "uint64" }], "name": "updateAngelCardSeries", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_angelId", "type": "uint64" }], "name": "transferAngel", "outputs": [{ "name": "", "type": "uint8" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "seraphims", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }, { "name": "", "type": "uint256" }], "name": "ownerAngelCollection", "outputs": [{ "name": "", "type": "uint64" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_angelId", "type": "uint64" }], "name": "setAngelLastVsBattleTime", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_angelCardSeriesId", "type": "uint8" }, { "name": "_basePrice", "type": "uint256" }, { "name": "_maxTotal", "type": "uint64" }, { "name": "_baseAura", "type": "uint8" }, { "name": "_baseBattlePower", "type": "uint16" }, { "name": "_liveTime", "type": "uint64" }], "name": "createAngelCardSeries", "outputs": [{ "name": "", "type": "uint8" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "totalAngels", "outputs": [{ "name": "", "type": "uint64" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_isMaintaining", "type": "bool" }], "name": "updateMaintenanceMode", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "maxRandom", "type": "uint16" }, { "name": "min", "type": "uint8" }, { "name": "privateAddress", "type": "address" }], "name": "getRandomNumber", "outputs": [{ "name": "", "type": "uint8" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "prevSeriesSelloutHours", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "isMaintenanceMode", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_oldSeraphim", "type": "address" }], "name": "removeSERAPHIM", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "removeCreator", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_angelCardSeriesId", "type": "uint8" }, { "name": "_owner", "type": "address" }, { "name": "_price", "type": "uint256" }, { "name": "_battlePower", "type": "uint16" }], "name": "setAngel", "outputs": [{ "name": "", "type": "uint64" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_angelId", "type": "uint64" }, { "name": "_value", "type": "uint256" }], "name": "addToAngelExperienceLevel", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_angelCardSeriesId", "type": "uint8" }], "name": "getAngelCardSeries", "outputs": [{ "name": "angelCardSeriesId", "type": "uint8" }, { "name": "currentAngelTotal", "type": "uint64" }, { "name": "basePrice", "type": "uint256" }, { "name": "maxAngelTotal", "type": "uint64" }, { "name": "baseAura", "type": "uint8" }, { "name": "baseBattlePower", "type": "uint256" }, { "name": "lastSellTime", "type": "uint64" }, { "name": "liveTime", "type": "uint64" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_angelId", "type": "uint64" }, { "name": "_value", "type": "uint16" }], "name": "setLastBattleResult", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_angelId", "type": "uint64" }], "name": "getAngel", "outputs": [{ "name": "angelId", "type": "uint64" }, { "name": "angelCardSeriesId", "type": "uint8" }, { "name": "battlePower", "type": "uint16" }, { "name": "aura", "type": "uint8" }, { "name": "experience", "type": "uint16" }, { "name": "price", "type": "uint256" }, { "name": "createdTime", "type": "uint64" }, { "name": "lastBattleTime", "type": "uint64" }, { "name": "lastVsBattleTime", "type": "uint64" }, { "name": "lastBattleResult", "type": "uint16" }, { "name": "owner", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "uint8" }], "name": "angelCardSeriesCollection", "outputs": [{ "name": "angelCardSeriesId", "type": "uint8" }, { "name": "basePrice", "type": "uint256" }, { "name": "currentAngelTotal", "type": "uint64" }, { "name": "maxAngelTotal", "type": "uint64" }, { "name": "baseAura", "type": "uint8" }, { "name": "baseBattlePower", "type": "uint256" }, { "name": "lastSellTime", "type": "uint64" }, { "name": "liveTime", "type": "uint64" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_angelId", "type": "uint64" }], "name": "setAngelLastBattleTime", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_angelId", "type": "uint64" }], "name": "getAngelLockStatus", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_angelId", "type": "uint64" }, { "name": "newValue", "type": "bool" }], "name": "updateAngelLock", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "totalAngelCardSeries", "outputs": [{ "name": "", "type": "uint8" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSeraphims", "outputs": [{ "name": "", "type": "uint16" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }], "name": "getOwnerAngelCount", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_newSeraphim", "type": "address" }], "name": "addSERAPHIM", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "getTotalAngelCardSeries", "outputs": [{ "name": "", "type": "uint8" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_to", "type": "address" }, { "name": "_angelId", "type": "uint64" }], "name": "ownerAngelTransfer", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "creatorAddress", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getTotalAngels", "outputs": [{ "name": "", "type": "uint64" }], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "angelId", "type": "uint64" }], "name": "CreatedAngel", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": true, "name": "tokenId", "type": "uint256" }], "name": "Transfer", "type": "event" }];
var petcarddata_contract_address = "0xB340686da996b8B3d486b4D27E38E38500A9E926";
var petcarddata_contract_abi = [{ "constant": true, "inputs": [], "name": "getTotalPetCardSeries", "outputs": [{ "name": "", "type": "uint8" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_to", "type": "address" }, { "name": "_petId", "type": "uint64" }], "name": "ownerPetTransfer", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "seraphims", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }, { "name": "_index", "type": "uint256" }], "name": "getPetByIndex", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "uint256" }], "name": "petCollection", "outputs": [{ "name": "petId", "type": "uint64" }, { "name": "petCardSeriesId", "type": "uint8" }, { "name": "owner", "type": "address" }, { "name": "name", "type": "string" }, { "name": "luck", "type": "uint8" }, { "name": "auraRed", "type": "uint16" }, { "name": "auraYellow", "type": "uint16" }, { "name": "auraBlue", "type": "uint16" }, { "name": "lastTrainingTime", "type": "uint64" }, { "name": "lastBreedingTime", "type": "uint64" }, { "name": "price", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_isMaintaining", "type": "bool" }], "name": "updateMaintenanceMode", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_petCardSeriesId", "type": "uint8" }, { "name": "_maxTotal", "type": "uint32" }], "name": "createPetCardSeries", "outputs": [{ "name": "", "type": "uint8" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_petCardSeriesId", "type": "uint8" }], "name": "getPetCardSeries", "outputs": [{ "name": "petCardSeriesId", "type": "uint8" }, { "name": "currentPetTotal", "type": "uint32" }, { "name": "maxPetTotal", "type": "uint32" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "_petId", "type": "uint256" }], "name": "getPet", "outputs": [{ "name": "petId", "type": "uint256" }, { "name": "petCardSeriesId", "type": "uint8" }, { "name": "name", "type": "string" }, { "name": "luck", "type": "uint8" }, { "name": "auraRed", "type": "uint16" }, { "name": "auraBlue", "type": "uint16" }, { "name": "auraYellow", "type": "uint16" }, { "name": "lastTrainingTime", "type": "uint64" }, { "name": "lastBreedingTime", "type": "uint64" }, { "name": "owner", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "maxRandom", "type": "uint16" }, { "name": "min", "type": "uint8" }, { "name": "privateAddress", "type": "address" }], "name": "getRandomNumber", "outputs": [{ "name": "", "type": "uint8" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }], "name": "getOwnerPetCount", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_petCardSeriesId", "type": "uint8" }, { "name": "_owner", "type": "address" }, { "name": "_name", "type": "string" }, { "name": "_luck", "type": "uint8" }, { "name": "_auraRed", "type": "uint16" }, { "name": "_auraYellow", "type": "uint16" }, { "name": "_auraBlue", "type": "uint16" }], "name": "setPet", "outputs": [{ "name": "", "type": "uint64" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "isMaintenanceMode", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_oldSeraphim", "type": "address" }], "name": "removeSERAPHIM", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "uint8" }], "name": "petCardSeriesCollection", "outputs": [{ "name": "petCardSeriesId", "type": "uint8" }, { "name": "currentPetTotal", "type": "uint32" }, { "name": "maxPetTotal", "type": "uint32" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getTotalPets", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_petId", "type": "uint64" }], "name": "setPetLastBreedingTime", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_name", "type": "string" }, { "name": "_petId", "type": "uint64" }], "name": "setPetName", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }, { "name": "", "type": "uint256" }], "name": "ownerPetCollection", "outputs": [{ "name": "", "type": "uint64" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "totalPets", "outputs": [{ "name": "", "type": "uint64" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_petId", "type": "uint64" }], "name": "setPetLastTrainingTime", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "totalPetCardSeries", "outputs": [{ "name": "", "type": "uint8" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSeraphims", "outputs": [{ "name": "", "type": "uint16" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_petId", "type": "uint64" }, { "name": "_auraRed", "type": "uint8" }, { "name": "_auraBlue", "type": "uint8" }, { "name": "_auraYellow", "type": "uint8" }], "name": "setPetAuras", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_petId", "type": "uint64" }], "name": "transferPet", "outputs": [{ "name": "", "type": "uint8" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_newSeraphim", "type": "address" }], "name": "addSERAPHIM", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "creatorAddress", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "petId", "type": "uint64" }], "name": "CreatedPet", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": true, "name": "tokenId", "type": "uint256" }], "name": "Transfer", "type": "event" }];
var accessorydata_contract_address = "0x466c44812835f57b736ef9F63582b8a6693A14D0";
var accessorydata_contract_abi = [{ "constant": true, "inputs": [{ "name": "_accessoryId", "type": "uint256" }], "name": "getAccessory", "outputs": [{ "name": "accessoryID", "type": "uint256" }, { "name": "AccessorySeriesID", "type": "uint8" }, { "name": "owner", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "__accessoryId", "type": "uint64" }], "name": "transferAccessory", "outputs": [{ "name": "", "type": "uint8" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "seraphims", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }, { "name": "", "type": "uint256" }], "name": "ownerAccessoryCollection", "outputs": [{ "name": "", "type": "uint64" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_isMaintaining", "type": "bool" }], "name": "updateMaintenanceMode", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }], "name": "getOwnerAccessoryCount", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_AccessorySeriesId", "type": "uint8" }, { "name": "_maxTotal", "type": "uint32" }, { "name": "_price", "type": "uint256" }], "name": "createAccessorySeries", "outputs": [{ "name": "", "type": "uint8" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "maxRandom", "type": "uint16" }, { "name": "min", "type": "uint8" }, { "name": "privateAddress", "type": "address" }], "name": "getRandomNumber", "outputs": [{ "name": "", "type": "uint8" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "isMaintenanceMode", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_oldSeraphim", "type": "address" }], "name": "removeSERAPHIM", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "uint256" }], "name": "AccessoryCollection", "outputs": [{ "name": "accessoryId", "type": "uint32" }, { "name": "accessorySeriesId", "type": "uint8" }, { "name": "owner", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getTotalAccessories", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "totalAccessorySeries", "outputs": [{ "name": "", "type": "uint8" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "uint8" }], "name": "AccessorySeriesCollection", "outputs": [{ "name": "AccessorySeriesId", "type": "uint8" }, { "name": "currentTotal", "type": "uint32" }, { "name": "maxTotal", "type": "uint32" }, { "name": "price", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSeraphims", "outputs": [{ "name": "", "type": "uint16" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getTotalAccessorySeries", "outputs": [{ "name": "", "type": "uint8" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_newSeraphim", "type": "address" }], "name": "addSERAPHIM", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "totalAccessories", "outputs": [{ "name": "", "type": "uint32" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "creatorAddress", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "_accessorySeriesId", "type": "uint8" }], "name": "getAccessorySeries", "outputs": [{ "name": "accessorySeriesId", "type": "uint8" }, { "name": "currentTotal", "type": "uint32" }, { "name": "maxTotal", "type": "uint32" }, { "name": "price", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_to", "type": "address" }, { "name": "__accessoryId", "type": "uint64" }], "name": "ownerAccessoryTransfer", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_seriesIDtoCreate", "type": "uint8" }, { "name": "_owner", "type": "address" }], "name": "setAccessory", "outputs": [{ "name": "", "type": "uint64" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }, { "name": "_index", "type": "uint256" }], "name": "getAccessoryByIndex", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "accessoryId", "type": "uint64" }], "name": "CreatedAccessory", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": true, "name": "tokenId", "type": "uint256" }], "name": "Transfer", "type": "event" }];

var angelCardDataContractInstance = null;
var petCardDataContractInstance = null;
var accessoryDataContractInstance = null;

var getAngelCardDataContractInstance = function () {
    return web3.eth.contract(angelcarddata_contract_abi).at(angelcarddata_contract_address);
}

var getPetCardDataContractInstance = function () {
    return web3.eth.contract(petcarddata_contract_abi).at(petcarddata_contract_address);
}

var getAccessoryDataContractInstance = function () {
    return web3.eth.contract(accessorydata_contract_abi).at(accessorydata_contract_address);
}

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
            }
            console.log("INFO_LOG|update_account_info|account=" + account);
        }

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
        getAngelByIndex(null, DisplayAngelCards);
        getPetByIndex(null, DisplayPetCards);
        getAccessoryByIndex(null, DisplayAccessoryCards);
    }
});

/*******************************************/

function DisplayAngelCards(value) {
    // Load all the cards
    var angels = {
        AngelsList: value
    }
}

function DisplayPetCards(value) {
    // Load all the cards
    var pets = {
        PetsList: value
    }
}

function DisplayAccessoryCards(value) {
    // Load all the cards
    var accessories = {
        AccessoriesList: value
    }
}

//******* Contract functions **********//
//******* ANGELS *********************//
var getOwnerAngelCount = function (ownerAddress, callbackFun) {
    if (!web3.isAddress(ownerAddress)) {
        console.log("invalid_address|address=" + ownerAddress);
        return;
    }

    angelCardDataContractInstance.getOwnerAngelCount(ownerAddress, function (err, result) {
        if (err) {
            console.log("ERROR_LOG|getAngelCardSeries_txn_fail|error=" + err);
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
                    } else {
                        var value = Number(result);
                        console.log("INFO_LOG|getOwnerAngelCount|value=" + value);

                        angelCardDataContractInstance.getAngel(value, function (err2, result2) {
                            if (err2) {
                                console.log("ERROR_LOG|getAngel_txn_fail|error=" + err2);
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
        }
    }
};

//******* PETS *********************//
var getOwnerPetCount = function (ownerAddress, callbackFun) {
    if (!web3.isAddress(ownerAddress)) {
        console.log("invalid_address|address=" + ownerAddress);
        return;
    }

    petCardDataContractInstance.getOwnerPetCount(ownerAddress, function (err, result) {
        if (err) {
            console.log("ERROR_LOG|getOwnerPetCount_txn_fail|error=" + err);
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
                } else {
                    var value = Number(result);
                    console.log("INFO_LOG|getOwnerPetCount|value=" + value);

                    petCardDataContractInstance.getPet(value, function (err2, result2) {
                        if (err2) {
                            console.log("ERROR_LOG|getPet_txn_fail|error=" + err2);
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
        return;
    }

    accessoryDataContractInstance.getOwnerAccessoryCount(ownerAddress, function (err, result) {
        if (err) {
            console.log("ERROR_LOG|getOwnerAccessoryCount_txn_fail|error=" + err);
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
                } else {
                    var value = Number(result);
                    console.log("INFO_LOG|getOwnerAccessoryCount|value=" + value);

                    accessoryDataContractInstance.getAccessory(value, function (err2, result2) {
                        if (err2) {
                            console.log("ERROR_LOG|getAccessory_txn_fail|error=" + err2);
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