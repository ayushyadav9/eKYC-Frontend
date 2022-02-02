import React, { useEffect, useState } from "react";
import { Result, Button, Spin, message } from "antd";
import { baseURL } from "../../../api";
import { useHistory } from "react-router-dom";

const Done = ({ formData }) => {

  const [status, setStatus] = useState(0);
  const history = useHistory();

  useEffect(() => {
    console.log(formData)
    if (formData.email.length) {
      fetch(`${baseURL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ formData, sender: "client" }),
      })
        .then((res) => res.json())
        .then((result, err) => {
          if (err) {
            console.log(err);
            setStatus(2)
            message.error("Something went wrong");
            return;
          }
          if (result.success) {
            setStatus(1);
            return message.success("Registered Successfuly!");
          }
          setStatus(2)
          message.info(result.message);
        })
        .catch((err) => {
          setStatus(2);
          message.error("Something went wrong!");
          console.log(err);
        });
    }
  }, [formData]);

  return (
    <>
      {status === 0 ? (
        <Result
          status="info"
          title="Sending Data to Blockchain"
          subTitle="Your Personal Data is completely Safe on Blockchain"
          extra={[
            <Spin size="large" />
          ]}
        />
      ) : status === 1 ? (
        <Result
          status="success"
          title="Successfully Registered for vKYC"
          subTitle="Login credentials sent via Email"
          extra={[
            <Button type="primary" key="console" onClick={()=>history.push('/')}>
              Proceed to Login
            </Button>            
          ]}
        />
      ) : (
        <Result
          status="error"
          title="Failed To Register"
          subTitle="You can try again after sometime"
          extra={[
            <Button type="primary" key="console" onClick={()=>history.push('/')}>
              Go to Home
            </Button>,
          ]}
        />
      )}
    </>
  );
};

export default Done;
