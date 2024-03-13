const fs = require("fs");
const path = require("path");

const { RpcProvider } = require("starknet");

const provider = new RpcProvider({ nodeUrl: "http://localhost:5050" })

const manifest = require("../target/dev/manifest.json")

const getStateUpdates = async () => {
	const lastBlock = await provider.getBlockNumber()
	console.log("lastBlock", lastBlock)

	const updates = []
	for (let i = 0; i <= lastBlock; i++) {
		console.log("block:", i)
		const update = await provider.getBlockStateUpdate(i)
		updates.push(update)
	}
	return updates
}


const main = async () => {

	// const updates = await getStateUpdates()
	// fs.writeFileSync(path.resolve('./updates.json'), JSON.stringify(updates,null,2))

	const updates = JSON.parse(fs.readFileSync(path.resolve('./updates.json')))

	const genesis = generateGenesis(updates)

	fs.writeFileSync(path.resolve('./genesis.json'), JSON.stringify(genesis, null, 2))

}



const generateGenesis = (updates) => {

	const genesis = genesisInitialState

	for (let update of updates) {

		parseDeclaredClasses(genesis, update.state_diff.declared_classes)
		parseDeployedContracts(genesis, update.state_diff.deployed_contracts)

		parseStorageDiff(genesis, update.state_diff.storage_diffs)
		parseNonces(genesis, update.state_diff.nonces)

	}

	return genesis
}

/****************************************************************/


const parseStorageDiff = (genesis, diffs) => {
	for (let diff of diffs) {
		let contract = genesis.contracts[diff.address]
		contract = contract || genesis.accounts[diff.address]

		if (!contract) {
			console.log("contract not found :", diff.address)
		}

		for (let entry of diff.storage_entries) {
			contract.storage[entry.key] = entry.value
		}
	}
}

/****************************************************************/


const parseNonces = (genesis, nonces) => {

	for (let nonce of nonces) {
		const account = genesis.accounts[nonce.contract_address]
		if (account) {
			account.nonce = nonce.nonce
			continue
		}

		// check if account is in contract  //and move to account
		const contract = genesis.contracts[nonce.contract_address]
		if (contract) {
			// genesis.accounts[nonce.contract_address] = contract
			// delete genesis.contracts[nonce.contract_address]
			// console.log("moved contract -> account")
			contract.nonce = nonce.nonce
		}
	}
}

/****************************************************************/

const parseDeployedContracts = (genesis, deployedContracts) => {

	for (let deployedContract of deployedContracts) {
		// check if account
		if (genesis.accounts[deployedContract.address]) {

			genesis.accounts[deployedContract.address] = {
				...genesis.accounts[deployedContract.address],
				storage: {}
			}

		} else {
			genesis.contracts[deployedContract.address] = {
				// balance:"0x0",
				class: deployedContract.class_hash,
				storage: {}
			}
		}

	}

}

/****************************************************************/

const parseDeclaredClasses = (genesis, declaredClasses) => {
	for (let declaredClass of declaredClasses) {

		//check if already in
		if (genesis.classes.find(i => BigInt(i.classHash) === BigInt(declaredClass.class_hash))) { continue }

		genesis.classes.push({
			class: getClassArtifactFromClassHash(declaredClass.class_hash),
			classHash: declaredClass.class_hash
		})
	}
}


const getArtifactPath = (name) => `../target/dev/${name}.json`

const getClassArtifactFromClassHash = (classHash) => {
	let isBase = manifest.base.class_hash === classHash
	if (isBase) {
		return getArtifactPath(manifest.base.name)
	}

	let isWorld = manifest.world.class_hash === classHash
	if (isWorld) {
		return getArtifactPath(manifest.world.name)
	}

	let contract = manifest.contracts.find(i => i.class_hash === classHash)
	if (contract) {
		return getArtifactPath(contract.name)
	}

	let model = manifest.models.find(i => i.class_hash === classHash)
	if (model) {
		return getArtifactPath(model.name)
	}

	return "not found :("

}




const genesisInitialState = {
	"number": 0,
	"parentHash": "0x0",
	"timestamp": 5123512314,
	"stateRoot": "0x0",
	"sequencerAddress": "0x100",
	"gasPrices": {
		"ETH": 1111,
		"STRK": 2222
	},
	"feeToken": {
		"address": "0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
		"name": "ETHER",
		"symbol": "ETH",
		"decimals": 18,
		"class": "0x02a8846878b6ad1f54f6ba46f5f40e11cee755c677f130b2c4b60566c9003f1f",
		"storage": {}
	},
	"universalDeployer": {
		"address": "0x041a78e741e5af2fec34b695679bc6891742439f7afb8484ecd7766661ad02bf",
		"storage": {}
	},
	"accounts": {
		"0xb3ff441a68610b30fd5e2abbf3a1548eb6ba6f3559f2862bf2dc757e5828ca": {
			"publicKey": "0x640466ebd2ce505209d3e5c4494b4276ed8f1cde764d757eb48831961f7cdea",
			"balance": "0xD3C21BCECCEDA1000000",
			"nonce": "0x0",
			"class": "0x05400e90f7e0ae78bd02c77cd75527280470e2fe19c54970dd79dc37a9d3645c",
			"storage": {}
		},
	},
	"contracts": {
		// "0x29873c310fbefde666dc32a1554fea6bb45eecc84f680f8a2b0a8fbb8cb89af": {
		// 	"balance": "0xD3C21BCECCEDA1000000",
		// 	"class": "0x8",
		// 	"storage": {
		// 		"0x1": "0x1",
		// 		"0x2": "0x2"
		// 	}
		// },
	},
	"classes": [
		{
			"class": "./compiled/erc20.json",
			"classHash": "0x02a8846878b6ad1f54f6ba46f5f40e11cee755c677f130b2c4b60566c9003f1f"
		},
		{
			"class": "./compiled/universal_deployer.json",
			"classHash": "0x07b3e05f48f0c69e4a65ce5e076a66271a527aff2c34ce1083ec6e1526997a69"
		},
		{
			"class": "./compiled/account.json",
			"classHash": "0x05400e90f7e0ae78bd02c77cd75527280470e2fe19c54970dd79dc37a9d3645c"
		}
	]
}


main()
