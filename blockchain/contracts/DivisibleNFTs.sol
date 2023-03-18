// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract DivisibleNFTs {
    using SafeMath for uint256;

    // ----------------------- Variables for ACoin ------------------------
    string public constant name = "ACoin"; // Name of the coin
    string public constant symbol = "ACNFT"; // Ticker for ACoin
    uint8 public constant decimals = 18; // Precision of use for the ACoin
    mapping(address => uint256) acoinBalances; // ACoin balances of the Traders
    uint256 acoinTotalSupply; // Total supply of the ACoin
    address payable owner;

    // ------------------------------ All Events ------------------------------
	event unitsOwnedOfATokenEvent(uint256  _balance, address payable _caller, string _message);

	event divisibilityEvent(uint256 _divisibility, address payable _caller, string _message);

	event mintEvent(address _owner, string _tokenId, uint _noOfShares, uint _tokenTotalSupply, address payable _caller, string _message);

	event transferTokenEvent(address _from, address _to, string _tokenId, uint _units, address payable _caller, string _message);

	event totalSupplyEvent(uint256 _totalSupply, address payable _caller, string _message);

	event buyACoinEvent(address _account, uint _numACoins, address payable _caller, string _message);

	event burnACoinEvent(address _account, uint _numACoins, address payable _caller, string _message);

    event transferACoinEvent(address _from, address _to, uint _numACoins, address payable _caller, string _message);

	event getAcoinTotalSupplyEvent( uint _acoinTotalSupply, address payable _caller, string _message);

	event acoinBalanceOfEvent(uint _acoinBalance, address payable _caller, string _message);

    event removeShareEvent(address _owner, string _tokenId, uint256 _units, address payable _caller, string _message);

    event addShareEvent(address _owner, string _tokenId, uint256 _units, address payable _caller, string _message);

    event removeOwnerHoldingsEvent(address _owner, string _tokenId, uint256 _units, address payable _caller, string _message);

    event addOwnerHoldingsEvent(address _owner, string _tokenId, uint256 _units, address payable _caller, string _message);

    // ----------------------- Variables for Non Fungible Token Management------------------------

    // Percentage of ownership over a token
    mapping(address => mapping(string => uint256)) ownerToTokenShare;
    // {user_account_address --> tokenId --> amount_holded_of_that_tokenId_by_that_address}

    // How much owners have of a token
    mapping(string => mapping(address => uint256)) tokenToOwnersHoldings;
    // {tokenId --> user_account_address --> amount_holded_of_that_tokenId_by_that_address}

    // If a token has been created
    mapping(string => bool) mintedToken;
    // tokenId --> returns true or false if the token with that Id is minted

    // Number of equal(fungible) units that constitute a token (that a token can be divised to)
    mapping(string => uint256) divisibility; // All tokens would have a different divisibilit factor
    // Divisibility for each token is basically the amount of shares that NFT has

    // total of managed/tracked tokens by this smart contract
    uint256 public tokenTotalSupply;

    // ------------------------------ Constructor ------------------------------
    constructor() payable {
        acoinTotalSupply = 0;
		tokenTotalSupply = 0;
        owner = payable(msg.sender);
    }

    // ====================== Everything related to ACoin =========================

    // ------------------------------ Modifiers ------------------------------
    // Modifier to check that the caller is the owner of
    // the contract.
    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "Only owner can invoke the transfer of ACoins"
        );
        _;
    }

    // ------------------------------ View functions ------------------------------

    /// @dev The total ACoins in circulation at the moment of invocation of this function
    function getAcoinTotalSupply(address payable _caller) public returns (uint256) {
		emit getAcoinTotalSupplyEvent(acoinTotalSupply, _caller, "getAcoinTotalSupply");
        return acoinTotalSupply;
    }

    /// @dev The ACoin balance of that address
    function acoinBalanceOf(address acoinOwner) public view returns (uint256) {
		// emit acoinBalanceOfEvent( acoinBalances[acoinOwner], _caller, "acoinBalanceOf");
        return acoinBalances[acoinOwner];
    }

    

    // ------------------------------ Core public functions ------------------------------
    
	/// @dev Buying ACoin, transferring ETH to owner
    function buyACoin(address account, uint numACoins, address payable _caller)
		payable
        public 
    {
        acoinBalances[account] = acoinBalances[account].add(numACoins);
		acoinTotalSupply = acoinTotalSupply.add(numACoins);
        payable(owner).transfer(msg.value);
		// payable(owner).transfer(numACoins);
        emit buyACoinEvent(account, numACoins, _caller, "buyACoin");
    }

	/// @dev Withdrawing ETH from ACoin, transferring ETH to user from owner
    function burnACoin(address payable account, uint numACoins, address payable _caller)
		payable
        public 
        
    {
		require(acoinBalances[account] >= numACoins);
        acoinBalances[account] = acoinBalances[account].sub(numACoins);
		acoinTotalSupply = acoinTotalSupply.sub(numACoins);
        payable(account).transfer(msg.value);
		// payable(account).transfer(numACoins);
        emit burnACoinEvent(account, numACoins, _caller, "burnACoin");
    }
	
	/// @dev Transferring ACoin from one user account to another
    function transferACoin(address sender, address receiver, uint256 numACoins, address payable _caller)
        public
        onlyOwner
        returns (bool)
    {
        require(numACoins <= acoinBalances[sender]);
        acoinBalances[sender] = acoinBalances[sender].sub(numACoins);
        acoinBalances[receiver] = acoinBalances[receiver].add(numACoins);
        emit transferACoinEvent(sender, receiver, numACoins, _caller, "transferCoin");
        return true;
    }


    // ====================== Everything related to Dividing the NFT =========================
    // ------------------------------ Modifiers ------------------------------

    modifier onlyNonExistentToken(string memory _tokenId) {
        require(mintedToken[_tokenId] == false);
        _;
    }

    modifier onlyExistentToken(string memory _tokenId) {
        require(mintedToken[_tokenId] == true);
        _;
    }

    // ------------------------------ View functions ------------------------------

    /// @dev The divisiblity amount of a token
	function divisibilityOfAToken(string memory _tokenId, address payable _caller) public returns (uint _divisibility)
	{
		emit divisibilityEvent(divisibility[_tokenId], _caller, "divisibilityOfAToken - The divisiblity amount of a token");
	    return divisibility[_tokenId];
	}

	/// @dev The amount of a totalSupply
    // Earlier totalSupplyView()
	function totalSupplyView(address payable _caller) public returns (uint _totalSupply)
	{
		emit totalSupplyEvent(tokenTotalSupply, _caller, "totalSupplyView");
	    return tokenTotalSupply;
	}

    /// @dev The balance an owner have of a token
    function unitsOwnedOfAToken(address _owner, string memory _tokenId, address payable _caller)
        public
        returns (uint256 _balance)
    {
		emit unitsOwnedOfATokenEvent(ownerToTokenShare[_owner][_tokenId], _caller, "unitsOwnedOfAToken");
        return ownerToTokenShare[_owner][_tokenId];
    }

    // ------------------------------ Core public functions ------------------------------

    /// @dev Anybody can create a token in our example
    /// @notice Minting grants 100% of the token to a new owner in our example
    function mint(
        address _owner,
        string memory _tokenId,
        uint256 _noOfShares,
        address payable _caller
    ) public onlyNonExistentToken(_tokenId) {

        divisibility[_tokenId] = _noOfShares;

        mintedToken[_tokenId] = true;

        _addShareToNewOwner(_owner, _tokenId, divisibility[_tokenId], _caller);
        _addNewOwnerHoldingsToToken(_owner, _tokenId, divisibility[_tokenId], _caller);

        tokenTotalSupply = tokenTotalSupply + 1;
        emit mintEvent(_owner, _tokenId, _noOfShares, tokenTotalSupply, _caller, "mint - Minting grants 100% of the token to a new owner");

        //Minted(_owner, _tokenId); // emit event
    }

    /// @dev transfer parts of a token to another user
    // Earlier transfer(_from, _to, _tokenId, _units)
    function transferToken(
        address _from,
        address _to,
        string memory _tokenId,
        uint256 _units,
        address payable _caller
    ) public onlyExistentToken(_tokenId) {
        require(ownerToTokenShare[_from][_tokenId] >= _units);
        // TODO should check _to address to avoid losing tokens units

        _removeShareFromLastOwner(_from, _tokenId, _units, _caller);
        _removeLastOwnerHoldingsFromToken(_from, _tokenId, _units, _caller);

        _addShareToNewOwner(_to, _tokenId, _units, _caller);
        _addNewOwnerHoldingsToToken(_to, _tokenId, _units, _caller);
        emit transferTokenEvent(_from,  _to,  _tokenId,  _units, _caller, "transfer - transfer parts of a token to another user");

        //Transfer(msg.sender, _to, _tokenId, _units); // emit event
    }

    // ------------------------------ Helper functions (internal functions) ------------------------------

    // Remove token units from last owner
    function _removeShareFromLastOwner(
        address _owner,
        string memory _tokenId,
        uint256 _units,
        address payable _caller
    ) internal {
        ownerToTokenShare[_owner][_tokenId] -= _units;
        emit removeShareEvent(_owner, _tokenId, _units, _caller, "_removeShareFromLastOwner - Remove token units from last owner");

    }

    // Add token units to new owner
    function _addShareToNewOwner(
        address _owner,
        string memory _tokenId,
        uint256 _units,
        address payable _caller
    ) internal {
        ownerToTokenShare[_owner][_tokenId] += _units;
        emit addShareEvent(_owner, _tokenId, _units, _caller, "_addShareToNewOwner - Add token units to new owner");

    }

    // Remove units from last owner
    function _removeLastOwnerHoldingsFromToken(
        address _owner,
        string memory _tokenId,
        uint256 _units,
        address payable _caller
    ) internal {
        tokenToOwnersHoldings[_tokenId][_owner] -= _units;
        emit removeOwnerHoldingsEvent(_owner, _tokenId, _units, _caller, "_removeLastOwnerHoldingsFromToken - Remove units from last owner");

    }

    // Add the units to new owner
    function _addNewOwnerHoldingsToToken(
        address _owner,
        string memory _tokenId,
        uint256 _units,
        address payable _caller
    ) internal {
        tokenToOwnersHoldings[_tokenId][_owner] += _units;
        emit addOwnerHoldingsEvent(_owner, _tokenId, _units, _caller, "_addNewOwnerHoldingsToToken - Add the units to new owner");

    }
}


library SafeMath {
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        assert(b <= a);
        return a - b;
    }

    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        assert(c >= a);
        return c;
    }
}