﻿using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AngelBattles.Utilities;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Nethereum.ABI.FunctionEncoding.Attributes;
using Nethereum.Contracts;
using Nethereum.Web3;
using Newtonsoft.Json;

namespace AngelBattles.Controllers
{
    [FunctionOutput]
    public class ABToken {
        [Parameter("uint8", "cardSeriesId", 1)]
        public int cardSeriesId { get; set; }

        [Parameter("uint16", "power", 1)]
        public int power { get; set; }

        [Parameter("uint16", "auraRed", 1)]
        public int auraRed { get; set; }

        [Parameter("uint16", "auraYellow", 1)]
        public int auraYellow { get; set; }

        [Parameter("uint16", "auraBlue", 1)]
        public int auraBlue { get; set; }

        [Parameter("string", "name", 1)]
        public string name { get; set; }

        [Parameter("uint16", "experience", 1)]
        public int experience { get; set; }

        [Parameter("uint64", "lastBattleTime", 1)]
        public int lastBattleTime { get; set; }

        [Parameter("uint16", "lastBattleResult", 1)]
        public int lastBattleResult { get; set; }

        [Parameter("address", "owner", 1)]
        public string owner { get; set; }

        [Parameter("uint16", "oldId", 1)]
        public int oldId { get; set; }
    }

    public class MetaData {
        [JsonProperty(PropertyName = "description")]
        public string Description { get; set; }

        [JsonProperty(PropertyName = "external_url")]
        public string ExternalUrl { get; set; }

        [JsonProperty(PropertyName = "home_url")]
        public string HomeUrl { get; set; }

        [JsonProperty(PropertyName = "image")]
        public string Image { get; set; }

        [JsonProperty(PropertyName = "image_url")]
        public string ImageUrl { get; set; }

        [JsonProperty(PropertyName = "name")]
        public string Name { get; set; }

        [JsonProperty(PropertyName = "attributes")]
        public List<Attribute> Attributes { get; set; }

        [JsonProperty(PropertyName = "properties")]
        public List<Property> Properties { get; set; }
    }

    public class Attribute {
        [JsonProperty(PropertyName = "trait_type")]
        public string TraitType { get; set; }

        [JsonProperty(PropertyName = "value")]
        public string Value { get; set; }
    }

    public class Property
    {
        [JsonProperty(PropertyName = "key")]
        public string Key { get; set; }

        [JsonProperty(PropertyName = "value")]
        public string Value { get; set; }
    }

    [Produces("application/json")]
    [Route("uri")]
    public class UriController : Controller
    {
        private readonly IHostingEnvironment _hostingEnvironment;

        public UriController(IHostingEnvironment hostingEnvironment)
        {
            _hostingEnvironment = hostingEnvironment;
        }

        // GET: api/Uri
        [HttpGet]
        public JsonResult Get()
        {
             return new JsonResult("Please pass in a TokenId");
        }

        // GET: api/Uri/5
        [HttpGet("{id}")]
        public async Task<JsonResult> Get(int id)
        {
            //The URL endpoint for the blockchain network.
            var url = "https://mainnet.infura.io";

            //The contract address.
            var address = "0xdc32ff5aada11b5ce3caf2d00459cfda05293f96";

            //The ABI for the contract.
            var ABI = @"[{'constant':true,'inputs':[{'name':'interfaceId','type':'bytes4'}],'name':'supportsInterface','outputs':[{'name':'','type':'bool'}],'payable':false,'stateMutability':'view','type':'function'},{'constant':true,'inputs':[],'name':'name','outputs':[{'name':'_name','type':'string'}],'payable':false,'stateMutability':'pure','type':'function'},{'constant':true,'inputs':[{'name':'tokenId','type':'uint256'}],'name':'getApproved','outputs':[{'name':'','type':'address'}],'payable':false,'stateMutability':'view','type':'function'},{'constant':false,'inputs':[{'name':'to','type':'address'},{'name':'tokenId','type':'uint256'}],'name':'approve','outputs':[],'payable':false,'stateMutability':'nonpayable','type':'function'},{'constant':true,'inputs':[{'name':'_angelSeriesId','type':'uint8'}],'name':'getAura','outputs':[{'name':'auraRed','type':'uint8'},{'name':'auraYellow','type':'uint8'},{'name':'auraBlue','type':'uint8'}],'payable':false,'stateMutability':'pure','type':'function'},{'constant':false,'inputs':[{'name':'tokenId','type':'uint256'}],'name':'setLastBreedingTime','outputs':[],'payable':false,'stateMutability':'nonpayable','type':'function'},{'constant':true,'inputs':[],'name':'totalSupply','outputs':[{'name':'','type':'uint256'}],'payable':false,'stateMutability':'view','type':'function'},{'constant':false,'inputs':[{'name':'tokenId','type':'uint256'},{'name':'_experience','type':'uint16'}],'name':'setExperience','outputs':[],'payable':false,'stateMutability':'nonpayable','type':'function'},{'constant':false,'inputs':[{'name':'_accessorySeriesId','type':'uint8'}],'name':'buyAccessory','outputs':[],'payable':true,'stateMutability':'payable','type':'function'},{'constant':false,'inputs':[{'name':'from','type':'address'},{'name':'to','type':'address'},{'name':'tokenId','type':'uint256'}],'name':'transferFrom','outputs':[],'payable':false,'stateMutability':'nonpayable','type':'function'},{'constant':true,'inputs':[{'name':'_cardSeriesId','type':'uint8'}],'name':'getMaxTokenNumbers','outputs':[{'name':'','type':'uint32'}],'payable':false,'stateMutability':'view','type':'function'},{'constant':true,'inputs':[{'name':'','type':'address'}],'name':'seraphims','outputs':[{'name':'','type':'bool'}],'payable':false,'stateMutability':'view','type':'function'},{'constant':false,'inputs':[],'name':'setMaxMedals','outputs':[],'payable':false,'stateMutability':'nonpayable','type':'function'},{'constant':false,'inputs':[{'name':'tokenId','type':'uint256'}],'name':'burnAndRecycle','outputs':[],'payable':false,'stateMutability':'nonpayable','type':'function'},{'constant':false,'inputs':[],'name':'initAngelPrices','outputs':[],'payable':false,'stateMutability':'nonpayable','type':'function'},{'constant':true,'inputs':[{'name':'_cardSeriesId','type':'uint8'}],'name':'getPrice','outputs':[{'name':'','type':'uint256'}],'payable':false,'stateMutability':'view','type':'function'},{'constant':false,'inputs':[{'name':'tokenId','type':'uint256'},{'name':'_oldId','type':'uint16'}],'name':'setoldId','outputs':[],'payable':false,'stateMutability':'nonpayable','type':'function'},{'constant':false,'inputs':[{'name':'_angelSeriesId','type':'uint8'}],'name':'buyAngel','outputs':[],'payable':true,'stateMutability':'payable','type':'function'},{'constant':false,'inputs':[{'name':'from','type':'address'},{'name':'to','type':'address'},{'name':'tokenId','type':'uint256'}],'name':'safeTransferFrom','outputs':[],'payable':false,'stateMutability':'nonpayable','type':'function'},{'constant':false,'inputs':[{'name':'tokenId','type':'uint256'}],'name':'burn','outputs':[],'payable':false,'stateMutability':'nonpayable','type':'function'},{'constant':true,'inputs':[{'name':'tokenId','type':'uint256'}],'name':'getABToken','outputs':[{'name':'cardSeriesId','type':'uint8'},{'name':'power','type':'uint16'},{'name':'auraRed','type':'uint16'},{'name':'auraYellow','type':'uint16'},{'name':'auraBlue','type':'uint16'},{'name':'name','type':'string'},{'name':'experience','type':'uint16'},{'name':'lastBattleTime','type':'uint64'},{'name':'lastBattleResult','type':'uint16'},{'name':'owner','type':'address'},{'name':'oldId','type':'uint16'}],'payable':false,'stateMutability':'view','type':'function'},{'constant':true,'inputs':[{'name':'','type':'uint256'}],'name':'currentTokenNumbers','outputs':[{'name':'','type':'uint32'}],'payable':false,'stateMutability':'view','type':'function'},{'constant':false,'inputs':[{'name':'_isMaintaining','type':'bool'}],'name':'updateMaintenanceMode','outputs':[],'payable':false,'stateMutability':'nonpayable','type':'function'},{'constant':true,'inputs':[{'name':'_owner','type':'address'},{'name':'_index','type':'uint64'}],'name':'getABTokenByIndex','outputs':[{'name':'','type':'uint256'}],'payable':false,'stateMutability':'view','type':'function'},{'constant':false,'inputs':[{'name':'tokenId','type':'uint256'},{'name':'_red','type':'uint16'},{'name':'_blue','type':'uint16'},{'name':'_yellow','type':'uint16'}],'name':'setAuras','outputs':[],'payable':false,'stateMutability':'nonpayable','type':'function'},{'constant':false,'inputs':[],'name':'setMaxAngels','outputs':[],'payable':false,'stateMutability':'nonpayable','type':'function'},{'constant':true,'inputs':[{'name':'maxRandom','type':'uint16'},{'name':'min','type':'uint8'},{'name':'privateAddress','type':'address'}],'name':'getRandomNumber','outputs':[{'name':'','type':'uint8'}],'payable':false,'stateMutability':'view','type':'function'},{'constant':true,'inputs':[{'name':'tokenId','type':'uint256'}],'name':'ownerOf','outputs':[{'name':'','type':'address'}],'payable':false,'stateMutability':'view','type':'function'},{'constant':true,'inputs':[],'name':'isMaintenanceMode','outputs':[{'name':'','type':'bool'}],'payable':false,'stateMutability':'view','type':'function'},{'constant':true,'inputs':[{'name':'owner','type':'address'}],'name':'balanceOf','outputs':[{'name':'','type':'uint256'}],'payable':false,'stateMutability':'view','type':'function'},{'constant':false,'inputs':[{'name':'_oldSeraphim','type':'address'}],'name':'removeSERAPHIM','outputs':[],'payable':false,'stateMutability':'nonpayable','type':'function'},{'constant':false,'inputs':[],'name':'withdrawEther','outputs':[],'payable':false,'stateMutability':'nonpayable','type':'function'},{'constant':false,'inputs':[{'name':'_cardSeriesId','type':'uint8'},{'name':'_newPrice','type':'uint256'}],'name':'setCardSeriesPrice','outputs':[],'payable':false,'stateMutability':'nonpayable','type':'function'},{'constant':true,'inputs':[],'name':'totalTokens','outputs':[{'name':'','type':'uint256'}],'payable':false,'stateMutability':'view','type':'function'},{'constant':true,'inputs':[{'name':'','type':'uint256'}],'name':'maxTokenNumbers','outputs':[{'name':'','type':'uint32'}],'payable':false,'stateMutability':'view','type':'function'},{'constant':true,'inputs':[],'name':'symbol','outputs':[{'name':'_symbol','type':'string'}],'payable':false,'stateMutability':'pure','type':'function'},{'constant':false,'inputs':[{'name':'to','type':'address'},{'name':'approved','type':'bool'}],'name':'setApprovalForAll','outputs':[],'payable':false,'stateMutability':'nonpayable','type':'function'},{'constant':false,'inputs':[{'name':'owner','type':'address'},{'name':'_cardSeriesId','type':'uint8'},{'name':'_power','type':'uint16'},{'name':'_auraRed','type':'uint16'},{'name':'_auraYellow','type':'uint16'},{'name':'_auraBlue','type':'uint16'},{'name':'_name','type':'string'},{'name':'_experience','type':'uint16'},{'name':'_oldId','type':'uint16'}],'name':'mintABToken','outputs':[],'payable':false,'stateMutability':'nonpayable','type':'function'},{'constant':false,'inputs':[{'name':'tokenId','type':'uint256'},{'name':'_result','type':'uint16'}],'name':'setLastBattleResult','outputs':[],'payable':false,'stateMutability':'nonpayable','type':'function'},{'constant':true,'inputs':[{'name':'','type':'uint256'}],'name':'accessoryPrice','outputs':[{'name':'','type':'uint256'}],'payable':false,'stateMutability':'view','type':'function'},{'constant':false,'inputs':[{'name':'from','type':'address'},{'name':'to','type':'address'},{'name':'tokenId','type':'uint256'},{'name':'_data','type':'bytes'}],'name':'safeTransferFrom','outputs':[],'payable':false,'stateMutability':'nonpayable','type':'function'},{'constant':true,'inputs':[],'name':'totalSeraphims','outputs':[{'name':'','type':'uint16'}],'payable':false,'stateMutability':'view','type':'function'},{'constant':false,'inputs':[],'name':'initAccessoryPrices','outputs':[],'payable':false,'stateMutability':'nonpayable','type':'function'},{'constant':false,'inputs':[{'name':'tokenId','type':'uint256'}],'name':'setLastBattleTime','outputs':[],'payable':false,'stateMutability':'nonpayable','type':'function'},{'constant':true,'inputs':[{'name':'_tokenId','type':'uint256'}],'name':'tokenURI','outputs':[{'name':'','type':'string'}],'payable':false,'stateMutability':'pure','type':'function'},{'constant':false,'inputs':[],'name':'setMaxAccessories','outputs':[],'payable':false,'stateMutability':'nonpayable','type':'function'},{'constant':false,'inputs':[{'name':'_newSeraphim','type':'address'}],'name':'addSERAPHIM','outputs':[],'payable':false,'stateMutability':'nonpayable','type':'function'},{'constant':true,'inputs':[],'name':'baseTokenURI','outputs':[{'name':'','type':'string'}],'payable':false,'stateMutability':'pure','type':'function'},{'constant':true,'inputs':[{'name':'','type':'uint256'}],'name':'angelPrice','outputs':[{'name':'','type':'uint256'}],'payable':false,'stateMutability':'view','type':'function'},{'constant':true,'inputs':[{'name':'','type':'uint256'}],'name':'ABTokenCollection','outputs':[{'name':'tokenId','type':'uint256'},{'name':'cardSeriesId','type':'uint8'},{'name':'power','type':'uint16'},{'name':'auraRed','type':'uint16'},{'name':'auraYellow','type':'uint16'},{'name':'auraBlue','type':'uint16'},{'name':'name','type':'string'},{'name':'experience','type':'uint16'},{'name':'lastBattleTime','type':'uint64'},{'name':'lastBreedingTime','type':'uint64'},{'name':'lastBattleResult','type':'uint16'},{'name':'oldId','type':'uint16'}],'payable':false,'stateMutability':'view','type':'function'},{'constant':true,'inputs':[],'name':'creatorAddress','outputs':[{'name':'','type':'address'}],'payable':false,'stateMutability':'view','type':'function'},{'constant':true,'inputs':[{'name':'owner','type':'address'},{'name':'operator','type':'address'}],'name':'isApprovedForAll','outputs':[{'name':'','type':'bool'}],'payable':false,'stateMutability':'view','type':'function'},{'constant':true,'inputs':[{'name':'','type':'address'},{'name':'','type':'uint256'}],'name':'ownerABTokenCollection','outputs':[{'name':'','type':'uint256'}],'payable':false,'stateMutability':'view','type':'function'},{'constant':true,'inputs':[{'name':'_cardSeriesId','type':'uint8'}],'name':'getCurrentTokenNumbers','outputs':[{'name':'','type':'uint32'}],'payable':false,'stateMutability':'view','type':'function'},{'constant':false,'inputs':[{'name':'tokenId','type':'uint256'},{'name':'namechange','type':'string'}],'name':'setName','outputs':[],'payable':false,'stateMutability':'nonpayable','type':'function'},{'inputs':[],'payable':false,'stateMutability':'nonpayable','type':'constructor'},{'anonymous':false,'inputs':[{'indexed':true,'name':'from','type':'address'},{'indexed':true,'name':'to','type':'address'},{'indexed':true,'name':'tokenId','type':'uint256'}],'name':'Transfer','type':'event'},{'anonymous':false,'inputs':[{'indexed':true,'name':'owner','type':'address'},{'indexed':true,'name':'approved','type':'address'},{'indexed':true,'name':'tokenId','type':'uint256'}],'name':'Approval','type':'event'},{'anonymous':false,'inputs':[{'indexed':true,'name':'owner','type':'address'},{'indexed':true,'name':'operator','type':'address'},{'indexed':false,'name':'approved','type':'bool'}],'name':'ApprovalForAll','type':'event'}]";

            //Creates the connecto to the network and gets an instance of the contract.
            var web3 = new Web3(url);
            var contract = web3.Eth.GetContract(ABI, address);

            var abToken = await contract.GetFunction("getABToken").CallDeserializingToObjectAsync<ABToken>(id);

            MetaData metaData = null;

            if (abToken != null)
            {
                var metaDataList = Helpers.MetaDataUrlList(_hostingEnvironment);
                var metaDataInfo = metaDataList.FirstOrDefault(x => x.CardSeriesId == abToken.cardSeriesId.ToString());

                var prop = abToken.GetType().GetProperties();
                var attributesList = new List<Attribute>();
                var propertiesList = new List<Property>();
                foreach (var props in prop)
                {
                    if (props.Name != "oldId" && props.Name != "lastBattleResult")
                    {
                        attributesList.Add(new Attribute
                        {
                            TraitType = props.Name,
                            Value = props.GetValue(abToken, null).ToString()
                        });

                        propertiesList.Add(new Property
                        {
                            Key = props.Name,
                            Value = props.GetValue(abToken, null).ToString()
                        });
                    }
                }

                metaData = new MetaData
                {
                    Description = metaDataInfo?.Description,
                    ExternalUrl = metaDataInfo?.ExternalUrl,
                    HomeUrl = metaDataInfo?.ExternalUrl,
                    Image = metaDataInfo?.ImageUri,
                    ImageUrl = metaDataInfo?.ImageUri,
                    Name = metaDataInfo?.CardName,
                    Attributes = attributesList,
                    Properties = propertiesList
                };
            }

            return new JsonResult(metaData);
        }
    }
}
