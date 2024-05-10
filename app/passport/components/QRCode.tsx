import { ZuSwitch } from '@/components/core';
import { ArrowPathIcon, CloseIcon, InformationIcon } from '@/components/icons';
import { useQRCode } from 'next-qrcode';
import React, { Dispatch, SetStateAction } from 'react'

interface PropTypes {
    isOpen: boolean,
    setIsOpen: Dispatch<SetStateAction<boolean>>
}

const QRCode = ({ isOpen, setIsOpen }: PropTypes) => {
    const { Canvas } = useQRCode();

    const [isZk, setIsZk] = React.useState<boolean>(false);
    const [errorCorrectionLevel, setErrorCorrectionLevel] = React.useState<string>('M');
    const [isRotated, setIsRotated] = React.useState<boolean>(false);

    const getRandomErrorCorrectionLevel = () => {
        const levels = ['L', 'M', 'Q', 'H'];
        let clevel = levels[Math.floor(Math.random() * levels.length)];
        console.log(clevel);

        setIsRotated(true);
        setErrorCorrectionLevel(clevel);
        setTimeout(() => setIsRotated(false), 500);

    }

    return (
        <div>
            {isOpen && (
                <div className="fixed overflow-y-auto top-1/2 left-1/2 transform -translate-x-1/2 md:-translate-y-1/2 w-fit">
                    <div className="backdrop-blur-xl rounded-[10px] bg-[rgba(52,52,52,0.80)] border-2 border-[rgba(255,255,255,0.10)] relative p-5 shadow-lg">
                        <div className="flex justify-between items-center mb-[14px]">
                            <div className=""></div>
                            <div className="text-white text-[18px] font-[700] leading-[120%]">QR Code</div>

                            <div onClick={() => setIsOpen(false)} className="cursor-pointer p-2.5 rounded-[10px] bg-[rgba(255,255,255,0.05)]">
                                <CloseIcon />
                            </div>
                        </div>

                        <Canvas
                            text={'https://github.com/aagbotemi/'}
                            options={{
                                errorCorrectionLevel: errorCorrectionLevel,
                                margin: 3,
                                scale: 4,
                                width: 340,
                                color: {
                                    dark: '#000000',
                                    light: '#FFFFFF',
                                },
                            }}
                        />

                        <div className="flex justify-center my-[14px]">
                            <div onClick={() => getRandomErrorCorrectionLevel()} className="inline-block cursor-pointer p-3.5 rounded-[10px] bg-[rgba(255,255,255,0.05)]">
                                <div className={`${isRotated ? 'rotate-90' : ''} transition-transform duration-500`}>
                                    <ArrowPathIcon />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center flex-col text-white">
                            <div className="mb-2.5 text-[18px] font-[700] leading-[120%]">{isZk ? "*%_||*(" : "Username"}</div>
                            <div className="text-[13px] tracking-[0.13px] opacity-50">{isZk ? "**&^|*@" : "username@gmail.com"}</div>
                        </div>

                        <div className="mt-2.5">
                            <div className={`${isZk ? "bg-custom-gradient bg-[var(--Inactive-White)]" : "bg-[rgba(255,255,255,0.05)]"} p-2.5 rounded-[10px] flex justify-between items-center`}>
                                <div className="flex items-center">
                                    <ZuSwitch onClick={() => setIsZk(!isZk)} />
                                    <div className="text-white font-[600] leading-[120%] ml-3.5">Zero-Knowledge Mode</div>
                                </div>
                                <InformationIcon />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default QRCode