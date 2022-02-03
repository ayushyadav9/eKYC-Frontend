import React, { useState, useContext, useEffect, useRef } from "react";
import { Input, Button, Modal } from "antd";
import Phone from "../../../assets/phone.gif";
import Teams from "../../../assets/teams.mp3";
import * as classes from "./Options.module.css";
import Hang from "../../../assets/hang.svg";
import VideoContext from "../../../context/VideoContext";
import { useHistory } from "react-router-dom";
import { UserOutlined, PhoneOutlined } from "@ant-design/icons";

const Options = (props) => {
  let history = useHistory();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const Audio = useRef();
  const {
    call,
    callAccepted,
    name,
    setName,
    callEnded,
    me,
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

  useEffect(() => {
    setName(props.clientName);
  }, [props.clientName, setName]);

  const showModal = (showVal) => {
    setIsModalVisible(showVal);
  };

  const handleHangup = () => {
    leaveCall();
    history.push("/client");
  };
  const handleCancel = () => {
    setIsModalVisible(false);
    leaveCall1();
    window.location.reload();
  };
  useEffect(() => {
    if (call.isReceivingCall && !callAccepted) {
      setIsModalVisible(true);
      setOtherUser(call.from);
    } else setIsModalVisible(false);
  }, [call.isReceivingCall, call.from, callAccepted, setOtherUser]);

  return (
    <div className={classes.options}>
      <div style={{ marginBottom: "0.5rem" }}>
        <h2>Account Info</h2>
        <Input
          size="large"
          placeholder="Your name"
          prefix={<UserOutlined />}
          value={name}
          disabled={true}
          className={classes.inputgroup}
        />

        <div className={classes.share_options}>
          Socket ID: {" " +me}
        </div>
      </div>
      <div style={{ marginBottom: "0.5rem" }}>
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
          <></>
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
  );
};

export default Options;
