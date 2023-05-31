var tdhUsers = null;
var contract = null;
const tdhAddy = "0x35EA0c670eD9f54Ac07B648aCF0F2EB173A6012D";
const dhAddy = "0x1836C33b9350D18304e0F701DE777Cc7501E9C2a";

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

        const currentEpoch = Math.round(Date.now() / 1000)
        document.getElementById('currentEpoch').innerHTML = currentEpoch;

        document.getElementById("approveTDH").onclick = async () => {
            var content = 'Approving.';
            document.getElementById("approveTDH").textContent = content;
            var event = tdhToken.methods.approve().send({from: tdhUsers}).then(function(result){
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
        })
    }
}