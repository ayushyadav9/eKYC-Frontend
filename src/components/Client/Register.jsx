import { Steps, Card } from "antd";
import {
  UserOutlined,
  SolutionOutlined,
  CameraOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import { useState,useEffect } from "react";
import Personal from "./Registration/Personal";
import Documents from "./Registration/Documents";
import Selfie from "./Registration/Selfie";
import Done from "./Registration/Done";
const { Step } = Steps;

const Register = () => {

  const [formData, setformData] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
    dob: "",
    gender: "",
    PANno: "",
    panIPFS:"",
    aadharIPFS:"",
    selfieIPFS:"",
    geo:""
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (position) {
      setformData({...formData,geo:position.coords.latitude + "," + position.coords.longitude})
    });
    // eslint-disable-next-line
  }, []);

  const [active, setActive] = useState({
    pStatus:"done",
    dStatus:"wait",
    sStatus:"wait",
    doneStatus:"wait",
    which:0
  });
  const handelStatus = (id)=>{
    if(id===0){
        setActive({...active,which:0,pStatus:"done",dStatus:"wait",sStatus:"wait",doneStatus:"wait"})
    }
    else if(id===1){
        setActive({...active,which:1,pStatus:"finish",dStatus:"done",sStatus:"wait",doneStatus:"wait"})
    }
    else if(id===2){
        setActive({...active,which:2,pStatus:"finish",dStatus:"finish",sStatus:"done",doneStatus:"wait"})
    }
    else if(id===3){
        setActive({...active,which:3,pStatus:"finish",dStatus:"finish",sStatus:"finish",doneStatus:"done"})
    }
  }


  return (
    <Card style={{ width: "80%", margin: "50px auto" }} hoverable>
      <div style={{ display: "flex" }}>
        <Steps>
          <Step status={active.pStatus} title="Personal Details" icon={<UserOutlined />}/>
          <Step status={active.dStatus} title="Documents" icon={<SolutionOutlined />} />
          <Step status={active.sStatus} title="Selfie Upload" icon={<CameraOutlined />} />
          <Step status={active.doneStatus} title="Done" icon={<SmileOutlined />} />
        </Steps>
      </div>
      {active.which===0 && <Personal formData={formData} setformData={setformData} handelStatus={handelStatus}/>}
      {active.which===1 && <Documents formData={formData} setformData={setformData} handelStatus={handelStatus}/>}
      {active.which===2 && <Selfie formData={formData} setformData={setformData} handelStatus={handelStatus}/>}
      {active.which===3 && <Done formData={formData} setformData={setformData} handelStatus={handelStatus}/>}
    </Card>
  );
};

export default Register;
