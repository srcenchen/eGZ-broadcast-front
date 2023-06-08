import {
  Body2,
  Button,
  Card,
  ProgressBar,
  Subtitle2,
  Switch,
  Title2,
} from "@fluentui/react-components";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// const hostname = window.location.hostname;
const hostname = location.hostname;
const port = location.port;
function Controller() {
  return (
    <div className="flex flex-col m-4 lg:mr-32">
      <Title2 className="mb-2 w-full">{"控制中心"}</Title2>
      <BasicCard />
      <TaskGroupCard />
    </div>
  );
}

// 基本信息卡片
function BasicCard() {
  const [position, setPosition] = useState(0);
  const [length, setLength] = useState(100);
  const [paused, setPaused] = useState(false);
  const [looped, setLooped] = useState(false);
  const [musicName, setMusicName] = useState("Loading...");
  useEffect(() => {
    // 连接websocket
    const musicInfoWS = new WebSocket(
      "ws://" + hostname + ":" + port + "/api/music-ctl/music-info"
    );
    musicInfoWS.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setPosition(data.position);
      setLength(data.length);
      setPaused(data.pause);
      setLooped(data.loop == -1);
      setMusicName(data.musicName);
    };
    return () => {
      musicInfoWS.close();
    };
  }, []);

  // 暂停或恢复请求
  const pauseOrResume = () => {
    if (paused) axios.put("/api/music-ctl/resume-music");
    else axios.put("/api/music-ctl/pause-music");
    setPaused(!paused);
  };
  // 停止请求
  const stop = () => {
    axios.put("/api/music-ctl/stop-music");
  };
  // 循环设置
  const setLoop = () => {
    if (looped) axios.put("/api/music-ctl/disable-loop");
    else axios.put("/api/music-ctl/enable-loop");
  };
  return (
    <Card className="max-w-3xl">
      <div className="flex flex-col">
        <Subtitle2 className="mb-2">{"信息"}</Subtitle2>
        <div className="flex flex-col items-center ml-2 mr-2 mb-2">
          <Body2 className="mb-4">{musicName}</Body2>
          <ProgressBar
            className="w-full"
            thickness="large"
            value={position}
            max={length}
          ></ProgressBar>
          <div className="flex mt-4">
            <Button onClick={pauseOrResume} style={{ marginRight: "8px" }}>
              {paused ? "继续播放" : "暂停"}
            </Button>
            <Button onClick={stop}>停止</Button>
          </div>
          <div className="flex mt-2 w-full">
            <Switch
              label={"循环播放"}
              labelPosition="before"
              checked={looped}
              onChange={(e) => {
                setLooped(e.target.checked);
                setLoop();
              }}
            ></Switch>
          </div>
        </div>
      </div>
    </Card>
  );
}

// 任务组控制
function TaskGroupCard() {
  const [taskGroup, setTaskGroup] = useState("");
  const [currentTask, setCurrentTask] = useState("");
  const [nextTask, setNextTask] = useState("");
  useEffect(() => {
    // 连接websocket
    const musicInfoWS = new WebSocket(
      "ws://" + hostname + ":" + port + "/api/task-group/task-group-info"
    );
    musicInfoWS.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setTaskGroup(data.taskGroupName);
      setCurrentTask(data.currentTask);
      setNextTask(data.nextTask);
    };
    return () => {
      musicInfoWS.close();
    };
  }, []);
  const nextTaskClick = () => {
    axios.put("/api/task-group/next-task");
  };
  const stopTaskGroup = () => {
    axios.put("/api/task-group/stop-task-group");
  };
  const navigate = useNavigate();
  return (
    <Card className="max-w-3xl mt-2">
      <div className="flex flex-col">
        <Subtitle2 className="mb-2">{"任务组控制"}</Subtitle2>
        <div className="flex flex-col items-center ml-2 mr-2 mb-2">
          {taskGroup == "" ? (
            <div className="flex flex-col items-center">
              <Body2 className="mb-2">{"当前没有正在执行的任务组"}</Body2>
              <Body2 className="mb-2">{"请前往 任务策略 中执行任务组"}</Body2>
              <Button
                appearance="primary"
                onClick={() => navigate("/task-group")}
              >
                任务策略
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Body2 className="mb-2">{"当前任务组：" + taskGroup}</Body2>
              <Body2 className="mb-2">{"当前任务：" + currentTask}</Body2>
              <Body2 className="mb-2">{"下一项任务：" + nextTask}</Body2>
              <div className="flex">
                <Button
                  style={{ marginRight: "8px" }}
                  onClick={() => nextTaskClick()}
                >
                  {"下一项任务"}
                </Button>
                <Button onClick={() => stopTaskGroup()}>{"结束任务组"}</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

export default Controller;
