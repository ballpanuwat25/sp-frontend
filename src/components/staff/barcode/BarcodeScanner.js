import React, { useRef, useEffect, useState } from "react";
import Quagga from "quagga";
import "./styles.css";

const BarcodeScanner = ({ onScannedTextChange }) => {
  const scannerRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [scannedText, setScannedText] = useState("");
  const [isMounted, setIsMounted] = useState(true); // New state to track component mount status

  useEffect(() => {
    let scannerIsRunning = false;

    const startScanner = () => {
      if (!scannerIsRunning) {
        Quagga.init(
          {
            inputStream: {
              name: "Live",
              type: "LiveStream",
              target: scannerRef.current,
              constraints: {
                width: 640,
                height: 480,
                facingMode: "environment" // or user for the front camera
              }
            },
            decoder: {
              readers: ["code_128_reader"] // You can add more supported formats here
            }
          },
          (err) => {
            if (err) {
              console.error("Error initializing Quagga:", err);
            } else {
              console.log("Quagga initialized successfully");
              if (isMounted) {
                Quagga.start();
                scannerIsRunning = true;
              }
            }
          }
        );

        Quagga.onDetected(handleScan);
      }
    };

    const stopScanner = () => {
      if (scannerIsRunning) {
        Quagga.offDetected(handleScan);
        Quagga.stop();
        scannerIsRunning = false;
        setScanning(false);
      }
    };

    if (scanning) {
      startScanner();
    } else {
      stopScanner();
    }

    return () => {
      stopScanner();

      // Clean up any dynamically created elements by Quagga
      const quaggaContainer = scannerRef.current;
      if (quaggaContainer) {
        quaggaContainer.innerHTML = "";
        const drawingBufferCanvas = document.querySelector(".drawingBuffer");
        if (drawingBufferCanvas) {
          drawingBufferCanvas.remove();
        }
      }
    };
  }, [scanning, isMounted]); // Add isMounted to the dependencies list

  useEffect(() => {
    return () => {
      setIsMounted(false); // Set isMounted to false when the component is unmounted
    };
  }, []);

  const handleScan = (result) => {
    // Do something with the scanned barcode result here
    const scannedCode = result.codeResult.code;
    setScannedText(scannedCode);
  };

  const handleScanButtonClick = () => {
    setScanning((prevScanning) => !prevScanning);
  };

  const handleModalClose = () => {
    setScannedText("");
  };

  const handleModalSave = () => {
    onScannedTextChange(scannedText);
  };

  return (
    <div>
      <button
        type="button"
        className="btn btn-outline-primary me-2"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        Scan Barcode
      </button>

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        onClick={handleModalClose}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Barcode Scanner
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="scanner" ref={scannerRef}></div>
              <button onClick={handleScanButtonClick}>
                {scanning ? "Stop Scan" : "Start Scan"}
              </button>
              <p>Scanned Text: {scannedText}</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleModalSave}
                data-bs-dismiss="modal"
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarcodeScanner;