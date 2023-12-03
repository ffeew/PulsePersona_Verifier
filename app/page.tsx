"use client";

import { useState } from "react";
import UploadFileModal from "./components/UploadFileModal";
import LoginCard from "./components/LoginCard";
import { ethers } from "ethers";
import abi from "./identityRegistryAbi.json";
import pulsePersonaConfig from "../pulsepersona.config.json";

type VerifiableCredential = {
	"@context": string[];
	id: string;
	type: string[];
	issuer: string;
	issuanceDate: string;
	name: string;
	credentialSubject: {
		id: string;
		firstName: string;
		lastName: string;
		email: string;
	};
};

export default function Home() {
	const [showModal, setShowModal] = useState(false);
	const [verifySuccess, setVerifySuccess] = useState(false);

	const verifyOnBlockchain = async (content: VerifiableCredential) => {
		const contractAddress = pulsePersonaConfig.smartContractAddress;
		const provider = ethers.getDefaultProvider(
			pulsePersonaConfig.providerAddress
		);

		const contract = new ethers.Contract(contractAddress, abi, provider);
		const claimId = content.id;
		console.log("claimId", claimId);

		// obtain the hash of the credential
		try {
			const hash = await contract.getClaimHash(claimId);
			console.log("hash", hash);

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
