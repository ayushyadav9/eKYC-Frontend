import React, { useState, useRef } from "react";
import Webcam from "react-webcam";
import { Card, Button, message } from "antd";
const IPFS = require("ipfs-api");
const ipfs = new IPFS({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});

function dataURLtoFile(dataurl, filename) {
  var arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

const Selfie = ({ formData, setformData, handelStatus }) => {
  const webcamRef = useRef(null);
  const [buffer, setbuffer] = useState([0]);
  const [isLoading, setisLoading] = useState(false);

  const handleOk = () => {
    capture();
  };

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    var file = dataURLtoFile(imageSrc, "selfie.png");
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      let buf = buffer;
      buf[0] = Buffer(reader.result);
      setbuffer(buf);
      message.success("Selfie Clicked")
    };
    // eslint-disable-next-line
  }, [webcamRef]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setisLoading(true);
    ipfs.files.add(buffer, (error, result) => {
      setisLoading(false);
      if (error) {
        console.error(error);
        message.error("Something went wrong!");
        return;
      }
      setformData({ ...formData, selfieIPFS: result[0].hash });
      handelStatus(3)
    });
  };

  return (
    <>
      <Card style={{ width: "40%", margin: "20px auto" }}>
        <Webcam style={{ width: "100%" }} ref={webcamRef} />
        <Button
          type="primary"
          style={{ display: "flex", margin: "auto" }}
          onClick={handleOk}
        >
          Click Selfie
        </Button>
      </Card>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Button
          type="ghoast"
          style={{ margin: "0 10px" }}
          onClick={() => handelStatus(1)}
        >
          Back
        </Button>
        <Button
          type="primary"
          style={{ margin: "0 10px" }}
          onClick={handleSubmit}
          loading={isLoading}
        >
          Save
        </Button>
      </div>
    </>
  );
};

export default Selfie;
