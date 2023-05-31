var tdhUsers = null;
var contract = null;
const tdhAddy = "0xC85eE4670886A54AC97907d0E00B6010c033e670";   // "0x35EA0c670eD9f54Ac07B648aCF0F2EB173A6012D";
const dhAddy =  "0x087a587f7cDB85113d41c9956C130e7F0ECB5490";   // "0x1836C33b9350D18304e0F701DE777Cc7501E9C2a";
const lockerAddy = "0x2d73DD17ba5ddbFBb2aeD9302304a7225eAf7829";

document.getElementById('connectWallet').onclick = async () => {
    if(window.ethereum){
        await window.ethereum.request({ method: "eth_requestAccounts"});
        window.web3 = new Web3(window.ethereum);
        var accounts = await web3.eth.getAccounts();
        tdhUsers = accounts[0];
        document.getElementById('connectWallet').textContent = "Connected!";
        console.log(tdhUsers);
        tdhToken = new web3.eth.Contract(tokenAbi, tdhAddy);
        dhNft = new web3.eth.Contract(nftAbi, dhAddy);
        locker = new web3.eth.Contract(lockerAbi, lockerAddy);

        const currentEpoch = Math.round(Date.now() / 1000)
        document.getElementById('currentEpoch').innerHTML = currentEpoch;

        document.getElementById("approveTDH").onclick = async () => {
            var content = 'Approving.';
            var amount = '10000000000000000000000000';
            document.getElementById("approveTDH").textContent = content;
            var event = tdhToken.methods.approve(lockerAddy, amount).send({from: tdhUsers}).then(function(result){
                var content = 'Approved!';
                document.getElementById('approveTDH').textContent = content;
                console.log(result);
            });
        }

        var tdhBalance = tdhToken.methods.balanceOf(tdhUsers).call({from: tdhUsers}).then(function(result){
            var content = JSON.stringify(result.toString() / 1000000000000000000);
            var contents = Number(content).toFixed(0);
            document.getElementById('tdhHeld').textContent = contents;
        });

        var dhBalance = dhNft.methods.balanceOf(tdhUsers).call({from: tdhUsers}).then(function(result){
            console.log(result);
            document.getElementById('nftHeld').textContent = result;
        });
        
        var tdhLocked = tdhToken.methods.balanceOf(lockerAddy).call({from: tdhUsers}).then(function(result){
            var content = JSON.stringify(result.toString() / 1000000000000000000);
            var contents = Number(content).toFixed(0);
            document.getElementById('totalLocked').textContent = contents;
        });
        
        var shoppableNFTs = dhNft.methods.balanceOf(lockerAddy).call({from: tdhUsers}).then(function(result){
            console.log(result);
            document.getElementById('shopableNFT').textContent = result;
        });
        
        var lockedBalance = locker.methods.lockedBalance(tdhUsers).call({from: tdhUsers}).then(function(result){
            var content = JSON.stringify(result.toString() / 1000000000000000000);
            var contents = Number(content).toFixed(0);
            document.getElementById('lockedByYou').textContent = contents;
        });
        
        var unlockTime = locker.methods.lockTime(tdhUsers).call({from: tdhUsers}).then(function(result){
            console.log(result);
            document.getElementById('unlockTime').textContent = result;
        });
        
        var generatedRewards = locker.methods.calculateReward(tdhUsers).call({from: tdhUsers}).then(function(result){
            console.log(result);
            var content = JSON.stringify(result.toString() / 1000000000000000000);
            document.getElementById('nftTokens').textContent = content;
        });
        
        var claimedRewards = locker.methods.rewardBalance(tdhUsers).call({from: tdhUsers}).then(function(result){
            console.log(result);
            var content = JSON.stringify(result.toString() / 1000000000000000000);
            document.getElementById('cNftTokens').textContent = content;
        });
        
        document.getElementById('viewNftId').onclick = async () => {
             var event = dhNft.methods.walletOfOwner(lockerAddy).call({from: tdhUsers}).then(function(result){
                console.log(result);
                document.getElementById('nftIds').textContent = "<br>" + result;
             });
        }
        
        document.getElementById('lockTDH').onclick = async () => {
            var content = 'Locking..';
            var amount = $("#lockAmount").val();
            document.getElementById('lockTDH').textContent = content;
            var event = locker.methods.lockTokens(amount).send({from: tdhUsers}).then(function(result){
                console.log(result);
                var content = 'Locked!';
                document.getElementById('lockTDH').textContent = content;
                
                var unlockTime = locker.methods.lockTime(tdhUsers).call({from: tdhUsers}).then(function(result){
                    console.log(result);
                    document.getElementById('unlockTime').textContent = result;
                });
                
                var lockedBalance = locker.methods.lockedBalance(tdhUsers).call({from: tdhUsers}).then(function(result){
                    var content = JSON.stringify(result.toString() / 1000000000000000000);
                    var contents = Number(content).toFixed(0);
                    document.getElementById('lockedByYou').textContent = contents;
                });
                
                var claimedRewards = locker.methods.rewardBalance(tdhUsers).call({from: tdhUsers}).then(function(result){
                    console.log(result);
                    var content = JSON.stringify(result.toString() / 1000000000000000000);
                    document.getElementById('cNftTokens').textContent = content;
                });
            });
        }
    }
}
