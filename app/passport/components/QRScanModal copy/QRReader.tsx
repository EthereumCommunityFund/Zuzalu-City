import { Stack } from '@mui/material';
import QrScanner from 'qr-scanner';
import { useEffect, useRef, useState } from 'react';
import "./qrScanner.css";

export const QRReader = () => {

    const videoEl = useRef<HTMLVideoElement>(null);
    const scanner = useRef<QrScanner>();
    const qrBoxEl = useRef<HTMLDivElement>(null);
    const [qrOn, setQrOn] = useState<boolean>(true);

    const [scannedResult, setScannedResult] = useState<string | undefined>("");

    const onScanSuccess = (result: QrScanner.ScanResult) => {
        setScannedResult(result.data);
    }

    const onScanFail = (err: string | Error) => {
        console.log("Error: ", err);
    }

    useEffect(() => {
        if (videoEl?.current && !scanner.current) {
            scanner.current = new QrScanner(videoEl.current, onScanSuccess, {
                onDecodeError: onScanFail,
                preferredCamera: 'environment',
                highlightScanRegion: true,
                highlightCodeOutline: true,
                overlay: qrBoxEl.current || undefined
            });

            scanner.current.start().then(() => setQrOn(true)).catch((err) => {
                if (err) {
                    setQrOn(false)
                }
            });
        }

        return () => {
            if (!videoEl?.current) {
                scanner.current?.stop();
            }
        }
    }, [])

    useEffect(() => {
        if (!qrOn)
            alert(
                "Camera is blocked or not accessible. Please allow camera in your browser permissions and Reload."
            );
    }, [qrOn]);

    return (
        <Stack
            className='qr-reader'
        >
            <video ref={videoEl}></video>
            <div ref={qrBoxEl} className='qr-box'>
                <div
                    style={{
                        width: '256px',
                        height: '256px'
                    }}

                    className='qr-frame'
                ></div>

            </div>
            {
                scannedResult && (
                    <p
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            zIndex: 99999,
                            color: "white",
                        }}
                    >
                        Scanned Result: {scannedResult}
                    </p>
                )
            }
        </Stack>
    )
}