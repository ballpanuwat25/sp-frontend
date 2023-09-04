import React, { useRef, useState } from "react";
import QrReader from "react-qr-reader";
import "./styles.css";

const QRCodeScanner = ({ onScannedTextChange }) => {
  const [scannedText, setScannedText] = useState("");

  const handleScan = (data) => {
    if (data) {
      setScannedText(data);
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  return (
    <div>
      <div className="scanner">
        <QrReader
          delay={300}
          onError={handleError}
          onScan={handleScan}
          style={{ width: "100%" }}
        />
      </div>
      <p>Scanned Text: {scannedText}</p>
    </div>
  );
};

export default QRCodeScanner;