pragma solidity ^0.4.17;

import "./IAngelCardData.sol";
import "./IAccessoryData.sol";
import "./IPetCardData.sol";
import "./AccessControl.sol";
import "./Utilities.sol";

contract Realm is AccessControl, Enums, SafeMath {
    // Addresses for other contracts realm interacts with. 
    address public angelCardDataContract;
    address public petCardDataContract;
    address public accessoryDataContract;
    
    // events
    event EventCreateAngel(address indexed owner, uint64 angelId);
    event EventCreatePet(address indexed owner, uint petId);
     event EventCreateAccessory(address indexed owner, uint accessoryId);
    

    /*** DATA TYPES ***/
    struct AngelCardSeries {
        uint8 angelCardSeriesId;
        uint basePrice; 
        uint64 currentAngelTotal;
        uint64 maxAngelTotal;
        AngelAura baseAura;
        uint baseBattlePower;
        uint64 lastSellTime;
        uint64 liveTime;
    }

    struct PetCardSeries {
        uint8 petCardSeriesId;
        uint32 currentPetTotal;
        uint32 maxPetTotal;
    }

    struct Angel {
        uint64 angelId;
        uint8 angelCardSeriesId;
        address owner;
        uint16 battlePower;
        AngelAura aura;
        uint16 experience;
        uint price;
        uint64 createdTime;
        uint64 lastBattleTime;
        uint64 lastVsBattleTime;
        uint16 lastBattleResult;
    }

    struct Pet {
        uint64 petId;
        uint8 petCardSeriesId;
        address owner;
        string name;
        uint8 luck;
        uint16 auraRed;
        uint16 auraYellow;
        uint16 auraBlue;
        uint64 lastTrainingTime;
        uint64 lastBreedingTime;
        uint price; 
        uint64 liveTime;
    }
    
      struct AccessorySeries {
        uint8 AccessorySeriesId;
        uint32 currentTotal;
        uint32 maxTotal;
        uint price;
    }

    struct Accessory {
        uint32 accessoryId;
        uint8 accessorySeriesId;
        address owner;
    }

    // write functions
    function SetAngelCardDataContact(address _angelCardDataContract) onlyCREATOR external {
        angelCardDataContract = _angelCardDataContract;
    }
    function SetPetCardDataContact(address _petCardDataContract) onlyCREATOR external {
        petCardDataContract = _petCardDataContract;
    }
    function SetAccessoryDataContact(address _accessoryDataContract) onlyCREATOR external {
        accessoryDataContract = _accessoryDataContract;
    }


    function withdrawEther() external onlyCREATOR {
    creatorAddress.transfer(this.balance);
}

    //Create each mint of a petCard
     function createPet(uint8 _petCardSeriesId, string _newname) isContractActive external {
        IPetCardData petCardData = IPetCardData(petCardDataContract);
        PetCardSeries memory petSeries;
      
      
        (,petSeries.currentPetTotal, petSeries.maxPetTotal) = petCardData.getPetCardSeries(_petCardSeriesId);

        
        if (petSeries.currentPetTotal >= petSeries.maxPetTotal) { revert ();}
        
        //timechecks - in case people try to interact with the contract directly and get pets before they are available
        if (_petCardSeriesId > 4) {revert();} //Pets higher than 4 come from battle, breeding, or marketplace. 
        if ((_petCardSeriesId == 2) && (now < 1518348600)) {revert();}
        if ((_petCardSeriesId == 3) && (now < 1520076600)) {revert();}
        if ((_petCardSeriesId == 4) && (now < 1521804600)) {revert();}
         
        //first find pet luck
        uint8 _newLuck = getRandomNumber(19, 10, msg.sender);
        
        
        uint16 _auraRed = 0;
        uint16 _auraYellow = 0;
        uint16 _auraBlue = 0;
        
        uint32 _auraColor = getRandomNumber(2,0,msg.sender);
        if (_auraColor == 0) { _auraRed = 2;}
        if (_auraColor == 1) { _auraYellow = 2;}
        if (_auraColor == 2) { _auraBlue = 2;}
        
        uint64 petId = petCardData.setPet(_petCardSeriesId, msg.sender, _newname, _newLuck, _auraRed, _auraYellow, _auraBlue);
        
        EventCreatePet(msg.sender, petId);
    }

 //Create each mint of a Accessory card 
     function createAccessory(uint8 _accessorySeriesId) isContractActive external payable {
        if (_accessorySeriesId > 18) {revert();} 
    IAccessoryData AccessoryData = IAccessoryData(accessoryDataContract);
      AccessorySeries memory accessorySeries;
      (,accessorySeries.currentTotal, accessorySeries.maxTotal, accessorySeries.price) = AccessoryData.getAccessorySeries(_accessorySeriesId);
    if (accessorySeries.currentTotal >= accessorySeries.maxTotal) { revert ();}
      if (msg.value < accessorySeries.price) { revert();}
     uint64 accessoryId = AccessoryData.setAccessory(_accessorySeriesId, msg.sender);
     
     EventCreateAccessory(msg.sender, accessoryId);
    }
    
    
    // created every mint of an angel card
    function createAngel(uint8 _angelCardSeriesId) isContractActive external payable {
        IAngelCardData angelCardData = IAngelCardData(angelCardDataContract);
        AngelCardSeries memory series;
        (, series.currentAngelTotal, series.basePrice, series.maxAngelTotal,,series.baseBattlePower, series.lastSellTime, series.liveTime) = angelCardData.getAngelCardSeries(_angelCardSeriesId);
      
      if ( _angelCardSeriesId > 24) {revert();}
        //Checked here and in angelCardData
        if (series.currentAngelTotal >= series.maxAngelTotal) { revert();}
        if (_angelCardSeriesId > 3) {
            // check is it within the  release schedule
            if (now < series.liveTime) {
            revert();
            }
        }
        // Verify the price paid for card is correct
        if (series.basePrice > msg.value) {revert(); }
        
        // add angel
        uint64 angelId = angelCardData.setAngel(_angelCardSeriesId, msg.sender, msg.value, uint16(series.baseBattlePower+getRandomNumber(10,0,msg.sender)));
        
        EventCreateAngel(msg.sender, angelId);
    }
      function kill() onlyCREATOR external {
        selfdestruct(creatorAddress);
    }
}