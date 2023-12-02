"use client";

import { useState } from "react";
import UploadFileModal from "./components/UploadFileModal";
import LoginCard from "./components/LoginCard";
import { ethers } from "ethers";
import abi from "./identityRegistryAbi.json";

type VerifiableCredential = {
	"@context": string[];
	id: string;
	type: string[];
	issuer: string;
	issuanceDate: string;
	credentialSubject: {
		id: string;
		firstName: string;
		lastName: string;
		email: string;
	};
	proof: {
		type: string;
		created: string;
		proofPurpose: string;
		verificationMethod: string;
		proofValue: string;
	};
};

export default function Home() {
	const [showModal, setShowModal] = useState(false);
	const [verifySuccess, setVerifySuccess] = useState(false);

	const verifyOnBlockchain = async (content: VerifiableCredential) => {
		const contractAddress = "0xa34a080a97A01f340f853Af69Fe7487E73561aA0";
		const provider = ethers.getDefaultProvider(
			"https://sepolia.infura.io/v3/c4dec57aaf3140fe9df7ccfee9ed1b24"
		);

		const contract = new ethers.Contract(contractAddress, abi, provider);
		const claimId = content.id;

		// obtain the hash of the credential
		try {
			const hash = await contract.getClaimHash(claimId);

			// hash the VC content
			const vcBytes = ethers.toUtf8Bytes(JSON.stringify(content));
			const hashVc = ethers.keccak256(vcBytes);

			// verify the hash of the VC content with the hash stored on the blockchain
			if (hash === hashVc) {
				console.log("VC verified successfully");
				return true;
			} else {
				console.log("VC verification failed");
				return false;
			}
		} catch (e) {
			console.error(e);
			return false;
		}
	};

	const handleVerify = async (content: object) => {
		const verified = await verifyOnBlockchain(content as VerifiableCredential);
		if (verified) {
			setVerifySuccess(true);
		} else {
			setVerifySuccess(false);
		}
	};

	return (
		<>
			<UploadFileModal
				showModal={showModal}
				closeModal={() => setShowModal(false)}
				handleVerify={handleVerify}
				verifySuccess={verifySuccess}
			/>
			<LoginCard onClickPulsePersona={() => setShowModal(true)} />
		</>
	);
}
