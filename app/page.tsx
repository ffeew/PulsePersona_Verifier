"use client";

import { useState } from "react";
import UploadFileModal from "./components/UploadFileModal";
import LoginCard from "./components/LoginCard";

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [verifySuccess, setVerifySuccess] = useState(false);

  const handleVerify = (content: object) => {
    console.log(content);
    // verify uploaded json file here
    //
    //
    //
    // if verified successfully
    setVerifySuccess(true);
    // else
    // setVerifySuccess(false);
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
