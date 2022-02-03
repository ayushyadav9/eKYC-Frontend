import React, { useState, useContext, useEffect, useRef } from "react";
import { Input, Button, Modal } from "antd";
import Phone from "../../../assets/phone.gif";
import Teams from "../../../assets/teams.mp3";
import * as classes from "./Options.module.css";
import VideoContext from "../../../context/VideoContext";
import Hang from "../../../assets/hang.svg";
import { useHistory } from "react-router-dom";
import { UserOutlined, PhoneOutlined } from "@ant-design/icons";

import { Card } from "antd";

const Options = (props) => {
  console.log(props);
  const [isModalVisible, setIsModalVisible] = useState(false);
  let history = useHistory();
  const Audio = useRef();
  const {
    call,
    callAccepted,
    setName,
    callEnded,
    callUser,
    leaveCall,
    answerCall,
    setOtherUser,
    leaveCall1,
  } = useContext(VideoContext);

  useEffect(() => {
    if (isModalVisible) {
      Audio?.current?.play();
    } else Audio?.current?.pause();
  }, [isModalVisible]);

  const showModal = (showVal) => {
    setIsModalVisible(showVal);
  };

  const handleHangup = () => {
    leaveCall();
    history.push("/bank");
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    leaveCall1();
    window.location.reload();
  };

  useEffect(() => {
    setName(props.bankName);
  }, [props.bankName, setName]);
  useEffect(() => {
    if (call.isReceivingCall && !callAccepted) {
      setIsModalVisible(true);
      setOtherUser(call.from);
    } else setIsModalVisible(false);
    // eslint-disable-next-line
  }, [call.isReceivingCall]);

  return (
    <>
      <div className={classes.options}>
        <div style={{ marginBottom: "0.5rem" }}>
          <h2>Client Info</h2>
          <Input
            size="large"
            prefix={<UserOutlined />}
            value={props.bankName}
            disabled={true}
            className={classes.inputgroup}
          />
        </div>

        <div style={{ marginBottom: "0.5rem" }}>
          <h2>Call</h2>

          {callAccepted && !callEnded ? (
            <Button
              variant="contained"
              onClick={handleHangup}
              className={classes.hang}
              tabIndex="0"
            >
              <img src={Hang} alt="hang up" style={{ height: "15px" }} />
              &nbsp; Hang up
            </Button>
          ) : (
            <Button
              type="primary"
              icon={<PhoneOutlined />}
              onClick={() => {
                callUser(props.clientId);
                console.log(props.clientId);
              }}
              className={classes.btn}
              tabIndex="0"
            >
              Call
            </Button>
          )}
        </div>

        {call.isReceivingCall && !callAccepted && (
          <>
            <audio src={Teams} loop ref={Audio} />
            <Modal
              title="Incoming Call"
              visible={isModalVisible}
              onOk={() => showModal(false)}
              onCancel={handleCancel}
              footer={null}
            >
              <div style={{ display: "flex", justifyContent: "space-around" }}>
                <h1>
                  {call.name} is calling you:{" "}
                  <img
                    src={Phone}
                    alt="phone ringing"
                    className={classes.phone}
                    style={{ display: "inline-block" }}
                  />
                </h1>
              </div>
              <div className={classes.btnDiv}>
                <Button
                  variant="contained"
                  className={classes.answer}
                  color="#29bb89"
                  icon={<PhoneOutlined />}
                  onClick={() => {
                    answerCall();
                    Audio.current.pause();
                  }}
                  tabIndex="0"
                >
                  Answer
                </Button>

                <Button
                  variant="contained"
                  className={classes.decline}
                  icon={<PhoneOutlined />}
                  onClick={() => {
                    setIsModalVisible(false);
                    Audio.current.pause();
                  }}
                  tabIndex="0"
                >
                  Decline
                </Button>
              </div>
            </Modal>
          </>
        )}
      </div>
      <canvas ref={props.canvasEle} style={{ display: "none" }}></canvas>

      <Modal
        title="Screenshot"
        visible={props.screenshotModal}
        onOk={() => showModal(false)}
        onCancel={() => props.setScreenshotModal((cur) => !cur)}
        footer={null}
      >
        <Card
          style={{ width: 300, margin: "auto" }}
          cover={<img alt="example" src={props.imageURL} />}
          actions={[
            <Button
              variant="contained"
              type="primary"
              loading={props.isLoading}
              onClick={() => props.handleVerdict("accepted")}
            >
              Accept
            </Button>,
            <Button
              variant="contained"
              type="danger"
              onClick={() => props.handleVerdict("rejected")}
              loading={props.isLoading}
            >
              Reject
            </Button>,
          ]}
        ></Card>
      </Modal>

      {/* {props.imageURL && callEnded && (
        <Modal
          title="Screenshot"
          visible={true}
          onOk={() => showModal(false)}
          onCancel={handleCancel}
          footer={null}
        >
          <Card
            style={{ width: 300, margin: "auto" }}
            cover={<img alt="example" src={props.imageURL} />}
            actions={[
              <Button variant="contained" onClick={() => props.handleVerdict("accepted")}>
                Accept
              </Button>,
              <Button variant="contained" onClick={() => props.handleVerdict("rejected")}>
                Reject
              </Button>,
            ]}
          ></Card>
        </Modal>
      )} */}
    </>
  );
};

export default Options;
