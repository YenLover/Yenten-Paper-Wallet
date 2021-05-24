
var qrcodeAddress = new QRCode(document.getElementById("qrcodeAddress"),{width: 120,height: 120});
var qrcodeSecret = new QRCode(document.getElementById("qrcodeSecret"),{width: 120, height: 120});

newytn();

function getConfig() {
	var networkConfigs = {
		'YENTEN': {
			'uri': 'yentencoin:',
			'title': 'Yenten Wallet',
			'name': 'Main Network (YTN)',
			'api': 'https://api.yentencoin.info',
			'ticker': 'YTN',
			'decimals': 8,
			'fee': 0.00001,
			'network': {
				'messagePrefix': '\x19Yenten Signed Message:\n',
				'bip32': {
					'public': 0x0488b21e,
					'private': 0x0488ade4
				},
				'bech32': 'ytn',
				'pubKeyHash': 0x4e,
				'scriptHash': 0x0a,
				'wif': 0x7b
			}
		}
	}
	network=Object.keys(networkConfigs)[0]
	return networkConfigs[network]
}

// Create new wallet
function newytn(){
	var keys = bitcoin.ECPair.makeRandom({'network': getConfig()['network']})
	var address = getAddress(keys)

	if (address != undefined) {
		var addrurl = "https://ytn.ccore.online/search/"+address;
		document.getElementById("address").innerHTML = address;
		document.getElementById("secret").innerHTML = keys.toWIF();
		document.getElementById("addr").href = addrurl;
		qrcodeAddress.makeCode(address);
		qrcodeSecret.makeCode(keys.toWIF());
	}
}

function getAddress(keys) {
	var network = getConfig()['network']
	var address = undefined

	
	if (getAddressType() == 'bech32') {
		address = bitcoin.payments.p2wpkh({
			'pubkey': keys.publicKey,
			'network': network
		}).address
	} else if (getAddressType() == 'segwit') {
		address = bitcoin.payments.p2sh({
			'redeem': getP2WPKHScript(keys.publicKey),
			'network': network
		}).address
	} else if (getAddressType() == 'legacy') {
		address = bitcoin.payments.p2pkh({
			'pubkey': keys.publicKey,
			'network': getConfig()['network']
		}).address
	}

	return address
}

function getAddressType() {
	var type = 'legacy'
	/**
	var type = readCookie('type')
	if (type == null || !['bech32', 'segwit', 'legacy'].includes(type)) {
		setCookie('type', 'legacy', 60)
		type = readCookie('type')
	}
	*/
	return type
}
