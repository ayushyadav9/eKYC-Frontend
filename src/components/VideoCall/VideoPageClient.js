import { useEffect } from "react";
import Video from "./Video/VideoClient";
import VideoState from "../../context/VideoState";
import Options from "./options/OptionsClient";
import "./VideoPage.css";
import { message } from "antd";

const VideoPage = (props) => {
  useEffect(() => {
    if (!navigator.onLine) message.error("Please connect to the internet!");
  }, []);

  return (
    <div className="videoPageBody">
      <VideoState>
        <Video />
        <Options clientName={props.location.state.name} />
      </VideoState>
    </div>
  );
};

export default VideoPage;
