export const verifierABI = [
	{
		"inputs": [],
		"name": "EC_SCALAR_MUL_FAILURE",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "MOD_EXP_FAILURE",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "PROOF_FAILURE",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "expected",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "actual",
				"type": "uint256"
			}
		],
		"name": "PUBLIC_INPUT_COUNT_INVALID",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "PUBLIC_INPUT_GE_P",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "PUBLIC_INPUT_INVALID_BN128_G1_POINT",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "getVerificationKeyHash",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "pure",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes",
				"name": "_proof",
				"type": "bytes"
			},
			{
				"internalType": "bytes32[]",
				"name": "_publicInputs",
				"type": "bytes32[]"
			}
		],
		"name": "verify",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]