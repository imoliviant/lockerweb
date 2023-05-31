var tdhUsers = null;
var contract = null;
const tdhAddy = "0x35EA0c670eD9f54Ac07B648aCF0F2EB173A6012D";

document.getElementById('connectWallet').onclick = async () => {
    if(window.ethereum){
        await window.ethereum.request({ method: "eth_requestAccounts"});
        window.web3 = new Web3(window.ethereum);
        var accounts = await web3.eth.getAccounts();
        tdhUsers = accounts[0];
        document.getElementById('connectWallet').textContent = "Connected!";
        console.log(tdhUsers);
        tdhToken = new web3.eth.Contract(tokenAbi, tdhAddy);

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
    }
}