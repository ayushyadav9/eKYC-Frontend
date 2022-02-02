import { Button, Form, Input, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState } from "react";
const IPFS = require("ipfs-api");
const ipfs = new IPFS({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});

const Documents = ({ formData, setformData, handelStatus }) => {
  const [buffer, setbuffer] = useState([0, 1]);
  const [isLoading, setisLoading] = useState(false);

  const handelNext = () => {
    if (buffer[0] !== 0 && buffer[1] !== 1) {
      setisLoading(true);
      ipfs.files.add(buffer, (error, result) => {
        setisLoading(false);
        if (error) {
          console.error(error);
          message.error("Something went wrong!");
          return;
        }
        setformData({
          ...formData,
          panIPFS: result[0].hash,
          aadharIPFS: result[1].hash,
        });
        handelStatus(2);
      });
    } else {
      message.error("Please choose Documents");
    }
  };

  const captureFile = (e, i) => {
    const file = e.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      let buf = buffer;
      console.log(e, i);
      buf[i] = Buffer(reader.result);
      setbuffer(buf);
    };
  };

  return (
    <>
      <Form layout="vertical" style={{ margin: "50px auto", width: "30%" }}>
        <Form.Item label="PAN Card">
          <Input
            type="file"
            suffix={<UploadOutlined />}
            required
            onChange={(e) => captureFile(e, 0)}
          />
        </Form.Item>
        <Form.Item label="Aadhar Card">
          <Input
            type="file"
            suffix={<UploadOutlined />}
            required
            onChange={(e) => captureFile(e, 1)}
          />
        </Form.Item>
      </Form>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Button
          type="ghoast"
          style={{ margin: "0 10px" }}
          onClick={() => handelStatus(0)}
        >
          Back
        </Button>
        <Button
          type="primary"
          style={{ margin: "0 10px" }}
          onClick={handelNext}
          loading={isLoading}
        >
          Next
        </Button>
      </div>
    </>
  );
};

export default Documents;
