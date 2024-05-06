import React, { useState, useRef } from "react";
import Html5QrcodePlugin from "../barcodeScanner/Html5QrcodePlugin";

import "./styles.css";
import '../../cssElement/Table.css'

function BarcodeScanner2({ onSave }) {
    const [scannedText, setScannedText] = useState(""); 

    const onNewScanResult = (decodedText) => {
        setScannedText(decodedText);
    };

    const handleSaveChanges = () => {
        setScannedText("");
        onSave(scannedText);
    };

    const handleClose = () => {
        setScannedText("");
    };

    const checkCameraIsOpen = () => {
        if(document.getElementById("html5-qrcode-button-camera-stop") != null){
            const stopBtn = document.getElementById("html5-qrcode-button-camera-stop").style.display;

            if(stopBtn != null && stopBtn == "inline-block") {
                console.log("Camera is open");
                document.getElementById("html5-qrcode-button-camera-stop").click();
            }
        } else {
            console.log("Camera is not open");
            if(document.getElementById("html5qr-code-full-region__scan_region") == null){
                console.log("Camera is not ope2n");
                window.location.reload();
            }
        }
    };

    return (
        <div>
            <button
                type="button"
                className="btn btn-outline-success me-2"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
                onClick={checkCameraIsOpen}
            >
                <i className="fa-solid fa-expand"></i>
            </button>

            <div
                className="modal fade"
                id="exampleModal"
                tabIndex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">
                                Barcode Scanner
                            </h1>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                onClick={handleClose}
                            ></button>
                        </div>
                        <div className="modal-body">
                            <p className="profile__label">scanned: {scannedText}</p>
                            <Html5QrcodePlugin
                                fps={10}
                                qrbox={250}
                                disableFlip={false}
                                qrCodeSuccessCallback={onNewScanResult}
                            />
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn edit--btn modal-btn"
                                onClick={handleSaveChanges}
                                data-bs-dismiss="modal"
                            >
                                <i className='fa-solid fa-circle-check' />ยืนยัน
                            </button>

                            <button
                                type="button"
                                className="btn btn-danger modal-btn"
                                onClick={handleClose}
                                data-bs-dismiss="modal"
                            >
                                <i className='fa-solid fa-circle-xmark' /> ยกเลิก
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BarcodeScanner2;