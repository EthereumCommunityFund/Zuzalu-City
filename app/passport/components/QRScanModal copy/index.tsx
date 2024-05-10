import { Typography } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close';
import { Dispatch, SetStateAction, useState } from "react";
import { ZuSelect } from "components/core";

const QrReader = require('react-qr-scanner');

interface IScanQRModal {
    showModal: boolean,
    setShowModal: Dispatch<SetStateAction<boolean>>
}

export const ScanQRModal = ({ showModal, setShowModal }: IScanQRModal) => {

    const [delay, setDelay] = useState(1000);
    const [scanResult, setScanResult] = useState();
    const [error, setError] = useState("");
    const [isSuccess, setIsSuccess] = useState<boolean>(false)
    const [isFailed, setIsFailed] = useState<boolean>(false)

    const handleScan = (data: any) => {
        setScanResult(data);
        // setIsSuccess(true)
        setIsFailed(true)
    }

    const handleError = (err: string) => {
        setError(err)
    }

    let verifying = false;

    return (
        <>
            <VerificationSuccess isSuccess={isSuccess} setIsSuccess={setIsSuccess} />
            <VerificationFailed isFailed={isFailed} setIsFailed={setIsFailed} setShowModal={setShowModal} />
            {
                showModal && (
                    <div className="fixed overflow-y-auto top-1/2 left-1/2 transform -translate-x-1/2 md:-translate-y-1/2 w-fit">
                        <div className="backdrop-blur-xl rounded-[10px] bg-[rgba(52,52,52,0.80)] border-2 border-[rgba(255,255,255,0.10)] relative p-5 shadow-lg">
                            <div className="flex justify-between items-center mb-[14px]">
                                <div className=""></div>
                                <div className="text-white text-[18px] font-[700] leading-[120%]">Scan Ticket</div>

                                <div onClick={() => setShowModal(false)} className="cursor-pointer p-2.5 rounded-[10px] bg-[rgba(255,255,255,0.05)] text-white">
                                    <CloseIcon />
                                </div>
                            </div>

                            {
                                error ? <Typography textAlign={'center'}>
                                    {
                                        "Please check your camera accessibility or QR Code"
                                    }
                                </Typography> :
                                    <QrReader
                                        delay={delay}
                                        style={{
                                            width: '360px',
                                            height: '360px'
                                        }}
                                        onError={handleError}
                                        onScan={handleScan}
                                    />
                            }

                            <div className="text-center font-[700] text-[18px] leading-[120%] text-white">
                                {verifying ? "Verifying..." : "Scanning..."}
                            </div>

                            <div className="mt-3.5 text-white">
                                <div className="font-[700]">Select an Event</div>
                                <ZuSelect></ZuSelect>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    )
}

interface IVerificationSuccess {
    isSuccess: boolean,
    setIsSuccess: Dispatch<SetStateAction<boolean>>
}

const VerificationSuccess = ({ isSuccess, setIsSuccess }: IVerificationSuccess) => {
    return (
        <div className="">
            {
                isSuccess && (
                    <div className="fixed overflow-y-auto top-1/2 left-1/2 transform -translate-x-1/2 md:-translate-y-1/2 w-fit">
                        <div className="backdrop-blur-xl rounded-[10px] bg-[rgba(52,52,52,0.80)] border-2 border-[rgba(255,255,255,0.10)] relative p-5 shadow-lg">
                            <div className="flex justify-between items-center mb-[14px]">
                                <div className=""></div>
                                <div className="text-white text-[18px] font-[700] leading-[120%]">Scan Ticket</div>

                                <div onClick={() => setIsSuccess(false)} className="cursor-pointer p-2.5 rounded-[10px] bg-[rgba(255,255,255,0.05)] text-white">
                                    <CloseIcon />
                                </div>
                            </div>

                            <svg width="360" height="360" viewBox="0 0 360 360" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="360" height="360" rx="10" fill="#7DFFD1" fill-opacity="0.1" />
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M131.25 180C131.25 153.076 153.076 131.25 180 131.25C206.924 131.25 228.75 153.076 228.75 180C228.75 206.924 206.924 228.75 180 228.75C153.076 228.75 131.25 206.924 131.25 180ZM198.051 170.93C199.255 169.244 198.865 166.902 197.18 165.699C195.494 164.495 193.152 164.885 191.948 166.57L175.771 189.218L167.652 181.098C166.187 179.634 163.813 179.634 162.348 181.098C160.884 182.563 160.884 184.937 162.348 186.402L173.598 197.652C174.378 198.431 175.461 198.828 176.559 198.737C177.658 198.646 178.661 198.077 179.302 197.18L198.051 170.93Z" fill="#1BA27A" />
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M131.25 180C131.25 153.076 153.076 131.25 180 131.25C206.924 131.25 228.75 153.076 228.75 180C228.75 206.924 206.924 228.75 180 228.75C153.076 228.75 131.25 206.924 131.25 180ZM198.051 170.93C199.255 169.244 198.865 166.902 197.18 165.699C195.494 164.495 193.152 164.885 191.948 166.57L175.771 189.218L167.652 181.098C166.187 179.634 163.813 179.634 162.348 181.098C160.884 182.563 160.884 184.937 162.348 186.402L173.598 197.652C174.378 198.431 175.461 198.828 176.559 198.737C177.658 198.646 178.661 198.077 179.302 197.18L198.051 170.93Z" fill="url(#paint0_linear_5186_11150)" />
                                <defs>
                                    <linearGradient id="paint0_linear_5186_11150" x1="131.25" y1="131.25" x2="180" y2="228.75" gradientUnits="userSpaceOnUse">
                                        <stop stop-color="white" />
                                        <stop offset="1" stop-color="white" stop-opacity="0" />
                                    </linearGradient>
                                </defs>
                            </svg>

                            <div className="text-[#7DFFD1] mt-2.5 text-[18px] font-[700] text-center">Verified</div>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

interface IVerificationFailed {
    isFailed: boolean,
    setIsFailed: Dispatch<SetStateAction<boolean>>
    setShowModal: Dispatch<SetStateAction<boolean>>
}

const VerificationFailed = ({ isFailed, setIsFailed, setShowModal }: IVerificationFailed) => {
    const handleReScan = () => {
        setShowModal(true)
        setIsFailed(false)
    }
    return (
        <div className="">
            {
                isFailed && (
                    <div className="fixed overflow-y-auto top-1/2 left-1/2 transform -translate-x-1/2 md:-translate-y-1/2 w-fit">
                        <div className="backdrop-blur-xl rounded-[10px] bg-[rgba(52,52,52,0.80)] border-2 border-[rgba(255,255,255,0.10)] relative p-5 shadow-lg">
                            <div className="flex justify-between items-center mb-[14px]">
                                <div className=""></div>
                                <div className="text-white text-[18px] font-[700] leading-[120%]">Scan Ticket</div>

                                <div onClick={() => setIsFailed(false)} className="cursor-pointer p-2.5 rounded-[10px] bg-[rgba(255,255,255,0.05)] text-white">
                                    <CloseIcon />
                                </div>
                            </div>

                            <svg width="360" height="360" viewBox="0 0 360 360" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="360" height="360" rx="10" fill="#FF5E5E" fill-opacity="0.1" />
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M180 131.25C153.076 131.25 131.25 153.076 131.25 180C131.25 206.924 153.076 228.75 180 228.75C206.924 228.75 228.75 206.924 228.75 180C228.75 153.076 206.924 131.25 180 131.25ZM171.402 166.098C169.937 164.634 167.563 164.634 166.098 166.098C164.634 167.563 164.634 169.937 166.098 171.402L174.697 180L166.098 188.598C164.634 190.063 164.634 192.437 166.098 193.902C167.563 195.366 169.937 195.366 171.402 193.902L180 185.303L188.598 193.902C190.063 195.366 192.437 195.366 193.902 193.902C195.366 192.437 195.366 190.063 193.902 188.598L185.303 180L193.902 171.402C195.366 169.937 195.366 167.563 193.902 166.098C192.437 164.634 190.063 164.634 188.598 166.098L180 174.697L171.402 166.098Z" fill="#FF5E5E" />
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M180 131.25C153.076 131.25 131.25 153.076 131.25 180C131.25 206.924 153.076 228.75 180 228.75C206.924 228.75 228.75 206.924 228.75 180C228.75 153.076 206.924 131.25 180 131.25ZM171.402 166.098C169.937 164.634 167.563 164.634 166.098 166.098C164.634 167.563 164.634 169.937 166.098 171.402L174.697 180L166.098 188.598C164.634 190.063 164.634 192.437 166.098 193.902C167.563 195.366 169.937 195.366 171.402 193.902L180 185.303L188.598 193.902C190.063 195.366 192.437 195.366 193.902 193.902C195.366 192.437 195.366 190.063 193.902 188.598L185.303 180L193.902 171.402C195.366 169.937 195.366 167.563 193.902 166.098C192.437 164.634 190.063 164.634 188.598 166.098L180 174.697L171.402 166.098Z" fill="url(#paint0_linear_5186_11161)" />
                                <defs>
                                    <linearGradient id="paint0_linear_5186_11161" x1="131.25" y1="131.25" x2="180" y2="228.75" gradientUnits="userSpaceOnUse">
                                        <stop stop-color="white" />
                                        <stop offset="1" stop-color="white" stop-opacity="0" />
                                    </linearGradient>
                                </defs>
                            </svg>


                            <div className="mb-3.5 text-[#FF5E5E] mt-2.5 text-[18px] font-[700] text-center">Unverified</div>

                            <button onClick={() => handleReScan()} className="w-full px-[14px] py-[10px] rounded-[10px] font-[600] bg-[rgba(255,255,255,0.05)] text-white">Re-Scan</button>
                        </div>
                    </div>
                )
            }
        </div>
    )
}