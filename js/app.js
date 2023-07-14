var tdhUsers = null;
var contract = null;
const tdhAddy = "0x35EA0c670eD9f54Ac07B648aCF0F2EB173A6012D"; // "0xC85eE4670886A54AC97907d0E00B6010c033e670";
const oldDhAddy = "0x1836C33b9350D18304e0F701DE777Cc7501E9C2a";
const dhAddy = "0xc6A7D5f48894A638A629cB7CD7277e30f52FC991";
const lockerAddy = "0xB99E5105B5EA829348Dcd72BCF78C2153450766f";
const migratorAddy = "0xe31Cfc612F6b0bC3a40CFc880Ce8e23F51733167";

document.getElementById('connectWallet').onclick = async () => {
    if (window.ethereum) {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        window.web3 = new Web3(window.ethereum);
        var accounts = await web3.eth.getAccounts();
        tdhUsers = accounts[0];
        document.getElementById('connectWallet').textContent = "Refresh";
        console.log(tdhUsers);
        tdhToken = new web3.eth.Contract(tokenAbi, tdhAddy);
        dhNft = new web3.eth.Contract(nftAbi, dhAddy);
        oldDhNft = new web3.eth.Contract(nftAbi, oldDhAddy);
        locker = new web3.eth.Contract(lockerAbi, lockerAddy);
        migrator = new web3.eth.Contract(migratorAbi, migratorAddy);

        const currentEpoch = Math.round(Date.now() / 1000)
        document.getElementById('currentEpoch').innerHTML = currentEpoch;

        document.getElementById("approveTDH").onclick = async () => {
            var content = 'Approving.';
            var amount = '10000000000000000000000000';
            document.getElementById("approveTDH").textContent = content;
            var event = tdhToken.methods.approve(lockerAddy, amount).send({ from: tdhUsers }).then(function (result) {
                var content = 'Approved!';
                document.getElementById('approveTDH').textContent = content;
                console.log(result);
            });
        }

        document.getElementById("approveForSwap").onclick = async () => {
            var content = "Approving.";
            document.getElementById('approveForSwap').textContent = content;
            var event = oldDhNft.methods.setApprovalForAll(migratorAddy, true).send({ from: tdhUsers }).then(function (result) {
                var content = "Approved!";
                document.getElementById("approveForSwap").textContent = content;
                console.log(result);
            });
        }

        var tdhBalance = tdhToken.methods.balanceOf(tdhUsers).call({ from: tdhUsers }).then(function (result) {
            var content = JSON.stringify(result.toString() / 1000000000000000000);
            var contents = Number(content).toFixed(0);
            document.getElementById('tdhHeld').textContent = contents;
        });

        var dhBalance = dhNft.methods.balanceOf(tdhUsers).call({ from: tdhUsers }).then(function (result) {
            console.log(result);
            document.getElementById('nftHeld').textContent = result;
        });

        var tdhLocked = tdhToken.methods.balanceOf(lockerAddy).call({ from: tdhUsers }).then(function (result) {
            var content = JSON.stringify(result.toString() / 1000000000000000000);
            var contents = Number(content).toFixed(0);
            document.getElementById('totalLocked').textContent = contents;
        });

        var shoppableNFTs = dhNft.methods.balanceOf(lockerAddy).call({ from: tdhUsers }).then(function (result) {
            console.log(result);
            document.getElementById('shopableNFT').textContent = result;
        });

        var lockedBalance = locker.methods.lockedBalance(tdhUsers).call({ from: tdhUsers }).then(function (result) {
            var content = JSON.stringify(result.toString() / 1000000000000000000);
            var contents = Number(content).toFixed(0);
            document.getElementById('lockedByYou').textContent = contents;
        });

        var unlockTime = locker.methods.lockTime(tdhUsers).call({ from: tdhUsers }).then(function (result) {
            console.log(result);
            document.getElementById('unlockTime').textContent = result;
        });

        var generatedRewards = locker.methods.calculateReward(tdhUsers).call({ from: tdhUsers }).then(function (result) {
            console.log(result);
            var content = JSON.stringify(result.toString() / 1000000000000000000);
            document.getElementById('nftTokens').textContent = content;
        });

        var claimedRewards = locker.methods.rewardBalance(tdhUsers).call({ from: tdhUsers }).then(function (result) {
            console.log(result);
            var content = JSON.stringify(result.toString() / 1000000000000000000);
            document.getElementById('cNftTokens').textContent = content;
            document.getElementById('cNftToken').textContent = content;
        });

        document.getElementById('viewNftId').onclick = async () => {
            content = "IDs: ";
            var event = dhNft.methods.balanceOf(lockerAddy).call({ from: tdhUsers }).then(function (result) {
                balance = result;
                for (var i = 0; i < balance; i++) {
                    var event = dhNft.methods.tokenOfOwnerByIndex(lockerAddy, i).call({ from: tdhUsers }).then(function (result) {
                        var event = dhNft.methods.tokenURI(Number(result)).call().then(function (result1) {
                            content += result + "<a href=https://nftrarity.dog/nft/druggedhuskies/punk/" + result + "/ target='_blank' style='text-decoration:none;cursor:pointer;'>" + "(view) " + "</a>";
                            document.getElementById('nftIds').innerHTML = content;
                        });
                    });
                };
            });
        }

        document.getElementById('claimRewards').onclick = async () => {
            var event = locker.methods.claimRewardToken(tdhUsers).send({ from: tdhUsers }).then(function (result) {
                console.log(result);
                var content = 'Claimed';
                document.getElementById('claimRewards').textContent = content;

                var generatedRewards = locker.methods.calculateReward(tdhUsers).call({ from: tdhUsers }).then(function (result) {
                    console.log(result);
                    var content = JSON.stringify(result.toString() / 1000000000000000000);
                    document.getElementById('nftTokens').textContent = content;
                });

                var claimedRewards = locker.methods.rewardBalance(tdhUsers).call({ from: tdhUsers }).then(function (result) {
                    console.log(result);
                    var content = JSON.stringify(result.toString() / 1000000000000000000);
                    document.getElementById('cNftTokens').textContent = content;
                });
            });
        }

        document.getElementById('lockTDH').onclick = async () => {
            var content = 'Locking..';
            var amount = $("#lockAmount").val();
            document.getElementById('lockTDH').textContent = content;
            var event = locker.methods.lockTokens(amount).send({ from: tdhUsers }).then(function (result) {
                console.log(result);
                var content = 'Locked!';
                document.getElementById('lockTDH').textContent = content;

                var unlockTime = locker.methods.lockTime(tdhUsers).call({ from: tdhUsers }).then(function (result) {
                    console.log(result);
                    document.getElementById('unlockTime').textContent = result;
                });

                var lockedBalance = locker.methods.lockedBalance(tdhUsers).call({ from: tdhUsers }).then(function (result) {
                    var content = JSON.stringify(result.toString() / 1000000000000000000);
                    var contents = Number(content).toFixed(0);
                    document.getElementById('lockedByYou').textContent = contents;
                });

                var claimedRewards = locker.methods.rewardBalance(tdhUsers).call({ from: tdhUsers }).then(function (result) {
                    console.log(result);
                    var content = JSON.stringify(result.toString() / 1000000000000000000);
                    document.getElementById('cNftTokens').textContent = content;
                });

                var tdhLocked = tdhToken.methods.balanceOf(lockerAddy).call({ from: tdhUsers }).then(function (result) {
                    var content = JSON.stringify(result.toString() / 1000000000000000000);
                    var contents = Number(content).toFixed(0);
                    document.getElementById('totalLocked').textContent = contents;
                });
            });
        }

        document.getElementById('unlockTDH').onclick = async () => {
            var content = 'unLocking';
            var amount = $("#lockAmount").val();
            document.getElementById('unlockTDH').textContent = content;
            var event = locker.methods.unlockTokens(amount).send({ from: tdhUsers }).then(function (result) {
                console.log(result);
                document.getElementById('unlockTDH').textContent = 'unLocked';

                var lockedBalance = locker.methods.lockedBalance(tdhUsers).call({ from: tdhUsers }).then(function (result) {
                    var content = JSON.stringify(result.toString() / 1000000000000000000);
                    var contents = Number(content).toFixed(0);
                    document.getElementById('lockedByYou').textContent = contents;
                });

                var claimedRewards = locker.methods.rewardBalance(tdhUsers).call({ from: tdhUsers }).then(function (result) {
                    console.log(result);
                    var content = JSON.stringify(result.toString() / 1000000000000000000);
                    document.getElementById('cNftTokens').textContent = content;
                });

                var tdhLocked = tdhToken.methods.balanceOf(lockerAddy).call({ from: tdhUsers }).then(function (result) {
                    var content = JSON.stringify(result.toString() / 1000000000000000000);
                    var contents = Number(content).toFixed(0);
                    document.getElementById('totalLocked').textContent = contents;
                });
            });
        }

        document.getElementById('swapNftId').onclick = async () => {
            var tokenId = $("#snftId").val();;
            var content = 'swapping..';
            document.getElementById('swapNftId').textContent = content;
            var event = migrator.methods.swapNft(tdhUsers, tokenId).send({ from: tdhUsers }).then(function (result) {
                console.log(result);
                var content = 'Swapped!';
                document.getElementById('swapNftId').textContent = content;
            });
        }

        document.getElementById('mintNFT').onclick = async () => {
            var event = dhNft.methods.mintPrice().call({ from: tdhUsers }).then(function(result) {
                console.log(result)

                var noOfNft = $("mintAmount").val();;
                var cost = (result * noOfNft);
                var event = alert(result + "DOGE");
            });
        }

        document.getElementById('shopNFT').onclick = async () => {
            var tokenID = $("#shopNFTId").val();;
            var content = 'Purchasing..';
            document.getElementById('shopNFT').textContent = content;
            var event = locker.methods.shopNFT(tokenID).send({ from: tdhUsers }).then(function (result) {
                console.log(result);
                var content = 'Purchased!';
                document.getElementById('shopNFT').textContent = content;

                var event = dhNft.methods.walletOfOwner(lockerAddy).call({ from: tdhUsers }).then(function (result) {
                    console.log(result);
                    document.getElementById('nftIds').textContent = "IDs: " + result;
                });

                var claimedRewards = locker.methods.rewardBalance(tdhUsers).call({ from: tdhUsers }).then(function (result) {
                    console.log(result);
                    var content = JSON.stringify(result.toString() / 1000000000000000000);
                    document.getElementById('cNftTokens').textContent = content;
                });
            });
        }
    }
}
