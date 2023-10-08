import React, { useState } from "react";
import Scanner from "./Scanner";

import "./styles.css";
import '../../cssElement/Table.css'

function BarcodeScanner2({ onSave }) {
    const [results, setResults] = useState([]);
    const [scanning, setScanning] = useState(false);
    const [scannedCode, setScannedCode] = useState("");
    const [modalScannedText, setModalScannedText] = useState("");

    const handleScan = () => {
        setScanning(!scanning);
    };

    const handleDetected = (result) => {
        setResults([]);
        setResults([result]);
        setModalScannedText(result.codeResult.code);
    };

    const handleSaveChanges = () => {
        setScannedCode(modalScannedText);
        setModalScannedText("");
        onSave(modalScannedText);
    };

    const handleClose = () => {
        setModalScannedText("");
    };

    return (
        <div>
            <button
                type="button"
                className="btn btn-outline-success me-2"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
                onClick={handleScan}
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
                            <p className="profile__label">scanned: {modalScannedText}</p>
                            <Scanner onDetected={handleDetected} />
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