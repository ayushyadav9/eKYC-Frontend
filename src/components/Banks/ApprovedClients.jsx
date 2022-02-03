import React from 'react';
import { Card,Modal, message, Avatar } from "antd";
import { useState, useEffect } from "react";
import VerifyClient from './VerifyClient';
import InitialiseWeb3 from "../utils/web3.js";
import { baseURL } from "../../api";
const { Meta } = Card;

const ApprovedClients = () => {

    const [dmr, setDmr] = useState(null);
    const [accounts, setAccounts] = useState(null);
    const [approvedClients, setApprovedClients] = useState({});
    const [clientData, setClientData] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        setup();
        // eslint-disable-next-line
    }, []);

    const setup = async () => {
        let [tempDmr, tempAcc] = await InitialiseWeb3();
        setDmr(tempDmr);
        setAccounts(tempAcc);
        getApprovedClients(tempAcc[0]);
    };

    const getApprovedClients = (account) => {
        console.log(account);
        if (account) {

            fetch(`${baseURL}/getApprovedClients`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ ethAddress: account }),
            })
                .then((res) => res.json())
                .then((result, err) => {
                    if (err) {
                        console.log(err);
                        message.error("Something went wrong");
                        return;
                    }
                    else {
                        console.log(result.approvedClients);
                        setApprovedClients(result.approvedClients);
                    }
                });
        }
    };

    const showModal = (data) => {
        console.log(data);
        setClientData(data);
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };


    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                margin: "0 auto",
            }}
        >
            <Modal title="Basic Modal"
                visible={isModalVisible}
                onCancel={handleCancel}
                width={1100}
                style={{ top: "20px" }}
                footer={null}
            >
                {clientData && <VerifyClient dmr={dmr} accounts={accounts} data={clientData} />}
            </Modal>
            <div>

                {approvedClients.length > 0
                    ? approvedClients.map((req, i) => {
                        return (
                            <Card.Grid
                                style={{
                                    width: "20%",
                                    textAlign: "center",
                                    margin: "15px",
                                    fontSize: "15px",
                                    borderRadius: "9px",
                                }}
                                onClick={() => { showModal(req) }}
                            >
                                <Meta
                                    avatar={<Avatar
                                        size="large"
                                        style={{
                                            color: '#f56a00',
                                            backgroundColor: '#fde3cf',
                                        }}
                                    >
                                        {(req.name).charAt(0).toUpperCase()}
                                    </Avatar>}
                                    title={req.name}
                                    description={req.kycId}
                                />
                            </Card.Grid>
                        );
                    })
                    : "No pending requests"}

            </div>
        </div>
    );
};

export default ApprovedClients;
