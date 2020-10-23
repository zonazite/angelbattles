pragma solidity ^0.4.17;

import "./IPetCardData.sol";
import "./AccessControl.sol";
import "./Utilities.sol";

contract PetCardData is IPetCardData, SafeMath {
    /*** EVENTS ***/
    event CreatedPet(uint64 petId);
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);

    /*** DATA TYPES ***/
    struct PetCardSeries {
        uint8 petCardSeriesId;
        uint32 currentPetTotal;
        uint32 maxPetTotal;
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
    }


    /*** STORAGE ***/
  
    mapping(uint8 => PetCardSeries) public petCardSeriesCollection;
    mapping(uint => Pet) public petCollection;
    mapping(address => uint64[]) public ownerPetCollection;
    
    /*** FUNCTIONS ***/
    //*** Write Access ***//
    function PetCardData() public {
        
    }

    //*** Pets ***/
    function createPetCardSeries(uint8 _petCardSeriesId, uint32 _maxTotal) onlyCREATOR public returns(uint8) {
     if ((now > 1516642200) || (totalPetCardSeries >= 19)) {revert();}
        //This confirms that no one, even the develoopers, can create any angel series after JAN/22/2018 @ 0530pm (UTC) or more than the original 24 series.
      
       PetCardSeries storage petCardSeries = petCardSeriesCollection[_petCardSeriesId];
        petCardSeries.petCardSeriesId = _petCardSeriesId;
        petCardSeries.maxPetTotal = _maxTotal;
        totalPetCardSeries += 1;
        return totalPetCardSeries;
    }
	
	function setPet(uint8 _petCardSeriesId, address _owner, string _name, uint8 _luck, uint16 _auraRed, uint16 _auraYellow, uint16 _auraBlue) onlySERAPHIM external returns(uint64) { 
        PetCardSeries storage series = petCardSeriesCollection[_petCardSeriesId];

        if (series.currentPetTotal >= series.maxPetTotal) {
            revert();
        }
        else {
        totalPets += 1;
        series.currentPetTotal +=1;
        Pet storage pet = petCollection[totalPets];
        pet.petId = totalPets;
        pet.petCardSeriesId = _petCardSeriesId;
        pet.owner = _owner;
        pet.name = _name;
        pet.luck = _luck;
        pet.auraRed = _auraRed;
        pet.auraYellow = _auraYellow;
        pet.auraBlue = _auraBlue;
        pet.lastTrainingTime = 0;
        pet.lastBreedingTime = 0;
        addPetIdMapping(_owner, pet.petId);
        }
    }

    function setPetAuras(uint64 _petId, uint8 _auraRed, uint8 _auraBlue, uint8 _auraYellow) onlySERAPHIM external {
        Pet storage pet = petCollection[_petId];
        if (pet.petId == _petId) {
            pet.auraRed = _auraRed;
            pet.auraBlue = _auraBlue;
            pet.auraYellow = _auraYellow;
        }
    }

    function setPetName(string _name, uint64 _petId) public {
        Pet storage pet = petCollection[_petId];
        if ((pet.petId == _petId) && (msg.sender == pet.owner)) {
            pet.name = _name;
        }
    }


    function setPetLastTrainingTime(uint64 _petId) onlySERAPHIM external {
        Pet storage pet = petCollection[_petId];
        if (pet.petId == _petId) {
            pet.lastTrainingTime = uint64(now);
        }
    }

    function setPetLastBreedingTime(uint64 _petId) onlySERAPHIM external {
        Pet storage pet = petCollection[_petId];
        if (pet.petId == _petId) {
            pet.lastBreedingTime = uint64(now);
        }
    }
    
    function addPetIdMapping(address _owner, uint64 _petId) private {
            uint64[] storage owners = ownerPetCollection[_owner];
            owners.push(_petId);
            Pet storage pet = petCollection[_petId];
            pet.owner = _owner;
            //this is a map of ALL the pets an address has EVER owned. 
            //We check that they are still the current owner in javascrpit and other places on chain. 
        
    }
	
	function transferPet(address _from, address _to, uint64 _petId) onlySERAPHIM public returns(ResultCode) {
        Pet storage pet = petCollection[_petId];
        if (pet.owner != _from) {
            return ResultCode.ERROR_NOT_OWNER;
        }
        if (_from == _to) {revert();}
        addPetIdMapping(_to, _petId);
        pet.owner = _to;
        return ResultCode.SUCCESS;
    }
    
    //Anyone can transfer a pet they own by calling this function. 
    
  function ownerPetTransfer (address _to, uint64 _petId)  public  {
     
        if ((_petId > totalPets) || (_petId == 0)) {revert();}
       if (msg.sender == _to) {revert();} //can't send to yourself. 
        if (pet.owner != msg.sender) {
            revert();
        }
        else {
      Pet storage pet = petCollection[_petId];
        pet.owner = _to;
        addPetIdMapping(_to, _petId);
        }
    }

    //*** Read Access ***//
    function getPetCardSeries(uint8 _petCardSeriesId) constant public returns(uint8 petCardSeriesId, uint32 currentPetTotal, uint32 maxPetTotal) {
        PetCardSeries memory series = petCardSeriesCollection[_petCardSeriesId];
        petCardSeriesId = series.petCardSeriesId;
        currentPetTotal = series.currentPetTotal;
        maxPetTotal = series.maxPetTotal;
    }
	
	function getPet(uint _petId) constant public returns(uint petId, uint8 petCardSeriesId, string name, uint8 luck, uint16 auraRed, uint16 auraBlue, uint16 auraYellow, uint64 lastTrainingTime, uint64 lastBreedingTime, address owner) {
        Pet memory pet = petCollection[_petId];
        petId = pet.petId;
        petCardSeriesId = pet.petCardSeriesId;
        name = pet.name;
        luck = pet.luck;
        auraRed = pet.auraRed;
        auraBlue = pet.auraBlue;
        auraYellow = pet.auraYellow;
        lastTrainingTime = pet.lastTrainingTime;
        lastBreedingTime = pet.lastBreedingTime;
        owner = pet.owner;
    }
	
	function getOwnerPetCount(address _owner) constant public returns(uint) {
        return ownerPetCollection[_owner].length;
    }
	
	function getPetByIndex(address _owner, uint _index) constant public returns(uint) {
        if (_index >= ownerPetCollection[_owner].length)
            return 0;
        return ownerPetCollection[_owner][_index];
    }

    function getTotalPetCardSeries() constant public returns (uint8) {
        return totalPetCardSeries;
    }

    function getTotalPets() constant public returns (uint) {
        return totalPets;
    }
}