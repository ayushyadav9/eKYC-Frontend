import { useEffect, useRef, useState } from "react";
import Video from "./Video/VideoAgent";
import VideoState from "../../context/VideoState";
import { baseURL } from "../../api";
import Options from "./options/OptionsAgent";
import { message } from "antd";
import "./VideoPage.css";
const IPFS = require("ipfs-api");
const ipfs = new IPFS({ host: "ipfs.infura.io", port: 5001, protocol: "https" });

const VideoPage = (props) => {
  const canvasEle = useRef();
  const imageEle = useRef();
  const [imageURL, setImageURL] = useState();
  const [imageFile, setImageFile] = useState();
  const [buffer, setBuffer] = useState([]);
  const [SS, setSS] = useState(false);
  const [screenshotModal, setScreenshotModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!navigator.onLine) message.error("Please connect to the internet!");
    // eslint-disable-next-line
  }, [navigator]);

  console.log(props.location.state.kycId);

  useEffect(() => {
    setImageFile(dataURLtoFile(imageURL, "vidScreenshot"));
  }, [imageURL]);

  const clickScreenshot = async (userVideo) => {
    const width = userVideo.current.videoWidth;
    const height = userVideo.current.videoHeight;
    const ctx = canvasEle.current.getContext("2d");
    canvasEle.current.width = width;
    canvasEle.current.height = height;

    ctx.drawImage(userVideo.current, 0, 0, width, height);

    let imageDataURL = canvasEle.current.toDataURL("image/png");
    setImageURL(imageDataURL);
    imageDataURL = dataURLtoFile(imageDataURL, "userSelfie.png");
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(imageDataURL);
    reader.onloadend = () => {
      setBuffer([Buffer(reader.result)]);
    };
    setSS(true);
    setScreenshotModal((val) => !val);
  };

  const dataURLtoFile = (dataurl, filename) => {
    if (dataurl) {
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
  };

  const updateRecord = async (record_type, record_data) => {
    let data = { kycId: props.location.state.kycId, record_type, record_data };
    console.log(data);

    fetch(`${baseURL}/updateRecord`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((result, err) => {
        setIsLoading(false);
        setScreenshotModal((val) => !val);
        if (err) {
          console.log(err);
          message.error("Something went wrong");
          return;
        }
        message.success("Updated Successfuly");
        console.log(result);
      });
  };

  const handleVerdict = (verd) => {
    setIsLoading(true);
    ipfs.files.add(buffer, (error, result) => {
      if (error) {
        setIsLoading(false);
        console.error(error);
        console.log(imageFile, imageURL);
        message.error("Something went wrong!");
        return;
      }
      console.log(result);
      updateRecord("video_kyc", JSON.stringify({ image: result[0].hash, verdict: verd }));
    });
  };

  return (
    <div className="videoPageBody">
      <VideoState>
        <Video clickScreenshot={clickScreenshot} SS={SS} imageURL={imageURL} />
        <Options
          clientId={props.match.params.clientId}
          canvasEle={canvasEle}
          imageEle={imageEle}
          imageURL={imageURL}
          handleVerdict={handleVerdict}
          message={message}
          SS={SS}
          screenshotModal={screenshotModal}
          setScreenshotModal={setScreenshotModal}
          isLoading={isLoading}
          bankName={props.location.state.name}
        />
      </VideoState>
    </div>
  );
};

export default VideoPage;
