import { useEffect, useState } from "react";

import { useLocation } from "react-router-dom";
import Modal from "./Modal";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import "./quiz_simple.css";
import { Contracts_MetaMask } from "../../../contract/contracts";

function Time_diff(props) {
    function convertSecondsToHours(secondsLimit, secondsStart) {
        let isBeforeStartline = false;

        const date1 = new Date(); // 1つ目のDateオブジェクト
        const date2 = new Date(secondsLimit * 1000); // 2つ目のDateオブジェクト
        const date3 = new Date(secondsStart * 1000);

        const epochTime1 = Math.floor(date1.getTime() / 1000); // 現在時刻を秒単位のエポック時間に変換
        const epochTime2 = Math.floor(date2.getTime() / 1000); // タイムリミットを秒単位のエポック時間に変換
        const epochTime3 = Math.floor(date3.getTime() / 1000); // タイムリミットを秒単位のエポック時間に変換
        // console.log("/////");
        // console.log(date2,seconds);
        // console.log( epochTime1 , epochTime2,epochTime1 - epochTime2); // タイムリミットと現在時刻の差を表示
        // console.log(date1.toISOString());
        // console.log(date2.toISOString());
        // console.log("////")
        console.log(epochTime1);

        let elapsedTime = 0;

        if (epochTime1 < epochTime3) {
            elapsedTime = Math.floor(Math.abs(epochTime3 - epochTime1)); // 二つのエポック時間の差をミリ秒単位で求める
            elapsedTime = new Date(elapsedTime * 1000);
            isBeforeStartline = true;
        } else {
            elapsedTime = Math.floor(Math.abs(epochTime2 - epochTime1)); // 二つのエポック時間の差をミリ秒単位で求める
            elapsedTime = new Date(elapsedTime * 1000);
        }

        //console.log(elapsedTime);

        const labels = ["年", "ヶ月", "日", "時間", "分", "秒"];
        let date = [];
        date.push(elapsedTime.getUTCFullYear() - 1970);
        date.push(elapsedTime.getUTCMonth());
        date.push(elapsedTime.getUTCDate() - 1);
        date.push(elapsedTime.getUTCHours());
        date.push(elapsedTime.getUTCMinutes());
        date.push(elapsedTime.getUTCSeconds());
        let res = "";
        let count = 0;
        let i = 0;

        for (i = 0; i <= date.length; i++) {
            //console.log(date[i]);
            if (date[i] != 0) {
                //count =i;
                break;
            }
        }
        for (i; i < date.length; i++) {
            res += date[i].toString() + labels[i];
        }
        if (isBeforeStartline) {
            return "回答開始時間まで" + res;
        } else {
            if (epochTime2 - epochTime1 > 0) {
                return "締め切りまで " + res;
            } else {
                return "締切終了";
            }
        }
    }

    //console.log(parseInt(props.limit["_hex"]));
    return (
        <div>
            {/* {now}<br/>
            {targetDate}<br/> */}
            {convertSecondsToHours(parseInt(props.limit), parseInt(props.start))}
        </div>
    );
}

function Simple_quiz(props) {
    let contract = new Contracts_MetaMask();
    const search = useLocation().search;

    const [show, setShow] = useState(false);
    const [is_payment, setIs_payment] = useState(false);

    console.log(props.quiz);
    console.log(props.quiz[8]);
    console.log(props.quiz[9]);

    async function get_is_payment(id){
        setIs_payment(await contract.get_is_payment(id));
    }

    useEffect(() => {
        console.log("show", show);
    }, [show]);

    useEffect(() =>{
        get_is_payment(props.quiz[0]);
    }, []);
    console.log(is_payment);

    return (
        <>

            <div onClick={() => setShow(true)}>
                <div className={`quiz_card ${is_payment ? 'border border-danger' : '' }`}>
                    <Link to={{ pathname: "/answer_quiz/" + Number(props.quiz[0]), state: { back_page: 0 } }} style={{ color: "black", textDecoration: "none" }}>
                        <div className="row quiz_card_1">
                            <div className="col-2">
                                <img src={props.quiz[4]} className="img-fluid"></img>
                            </div>
                            <div className="col-10" style={{ textAlign: "left" }}>
                                <div className="row h-20">
                                    <div className="col-sm-12 col-md-12 col-lg-12 ">{props.quiz[2]}</div>
                                </div>
                                <div className="row h-80" style={{ whiteSpace: "pre-wrap", fontSize: "14px", lineHeight: "1" }}>
                                    <div className="col-sm-12 col-md-12 col-lg-12 ">{props.quiz[3]}</div>
                                </div>
                                <div className="row h-20" style={{ fontSize: "14px" }}>
                                    <Time_diff start={Number(props.quiz[8])} limit={Number(props.quiz[9])} />
                                </div>
                                <div className="d-flex" style={{ fontSize: "14px", lineHeight: "1" }}>


                                    <div className="col-3">
                                        <div className="col">報酬</div>
                                        <div className="col" style={{ textAlign: "center" }}>
                                            {Number(props.quiz[10]) / (10 ** 18)}TFT
                                        </div>
                                    </div>
                                    <div className="col-3">
                                        <div className="col">回答数</div>
                                        <div className="col" style={{ textAlign: "center" }}>
                                            {Number(props.quiz[11])}
                                        </div>
                                    </div>
                                    <div className="col-3">
                                        <div className="col">上限</div>
                                        <div className="col" style={{ textAlign: "center" }}>
                                            {Number(props.quiz[12])}
                                        </div>
                                    </div>
                                    <div className="col-3">
                                        <div className="col">状態</div>
                                        <div className="col" style={{ textAlign: "center" }}>
                                            {Number(props.quiz[13]) == 0 ? "未回答" : Number(props.quiz[13]) == 1 ? "不正解" : Number(props.quiz[13]) == 2 ? "正解" : Number(props.quiz[13]) == 3 ? "解答済み" :""}
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </Link>
                    <div style={{ textAlign: "right" }}>
                        <Button as={Link} to={`/edit_quiz/${Number(props.quiz[0])}`} state={{ args: [Number(props.quiz[0]), props.quiz[1], props.quiz[2], props.quiz[3], props.quiz[4], props.quiz[5], Number(props.quiz[6]), props.quiz[7], Number(props.quiz[8]), Number(props.quiz[9]), Number(props.quiz[10]), Number(props.quiz[11]), Number(props.quiz[12]), Number(props.quiz[13])] }} variant="primary" style={{ marginTop: "20px" }}>
                            編集
                        </Button>
                        <Button as={Link} to={`/investment_page/${Number(props.quiz[0])}`} state={{ args: [Number(props.quiz[0])] }} variant="primary" style={{ marginTop: "20px", marginLeft: "10px", marginRight: "0px" }}>
                            報酬の追加
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
export default Simple_quiz;
