import { Message, Modal, Select, Space, Switch } from "@arco-design/web-react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Input,
  Title2,
} from "@fluentui/react-components";
import {
  Tree,
  TreeItem,
  TreeItemAside,
  TreeItemLayout,
} from "@fluentui/react-components/unstable";

import { Delete24Regular, Add24Regular } from "@fluentui/react-icons";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function TaskGroup() {
  const [reloadGroup, setReloadGroup] = useState(false);
  return (
    <div className="flex flex-col m-4 lg:mr-32">
      <Title2 className="mb-2">{"任务策略"}</Title2>
      <div>
        <div className="flex">
          <NewTaskGroup reload={reloadGroup} setReload={setReloadGroup} />
          <NewTask reload={reloadGroup} setReload={setReloadGroup} />
        </div>

        <TaskGroupList reload={reloadGroup} setReload={setReloadGroup} />
      </div>
    </div>
  );
}

// 任务组列表
function TaskGroupList(props: { reload: boolean; setReload: Function }) {
  const [taskGroupData, setTaskGroupData] = useState([]);
  const [taskData, setTaskData] = useState([]);
  // 从服务器中获取数据
  useEffect(() => {
    axios.get("/api/task-group/get-task-group-list").then((res) => {
      setTaskGroupData(res.data);
      axios.get("/api/task-group/get-all-task").then((resTasks) => {
        setTaskData(resTasks.data);
      });
    });
  }, [props.reload]);

  const deleteTask = (id: number) => {
    axios.delete("/api/task-group/delete-task?Id=" + id).then(() => {
      props.setReload(!props.reload);
    });
  };
  const navigate = useNavigate();
  const runTaskGroup = (id: number) => {
    axios.post("/api/task-group/run-task-group?Id=" + id).then(() => {
      navigate("/controller");
    });
  };
  return (
    <div className="mt-4">
      <Tree aria-label="Tree">
        {taskGroupData.map((item: any) => {
          const taskThis: any[] = [];
          taskData.forEach((task: any) => {
            if (task.GroupID === item.Id) taskThis.push(task);
          });
          return (
            <TreeItem itemType="branch" key={item.Id}>
              <TreeItemLayout>{item.Name}</TreeItemLayout>
              <TreeItemAside actions>
                <Button
                  appearance="primary"
                  onClick={() => runTaskGroup(item.Id)}
                >
                  执行
                </Button>
                <DeleteGroupConfirm item={item} setReload={props.setReload} reload={props.reload}/>
              </TreeItemAside>
              <Tree>
                {taskThis.map((child: any) => {
                  const after = child.Loop ? " 循环播放" : "";
                  return (
                    <TreeItem itemType="leaf" key={child.Id}>
                      <TreeItemLayout>{child.MusicName + after}</TreeItemLayout>
                      <TreeItemAside actions>
                        <Button
                          appearance="subtle"
                          icon={<Delete24Regular />}
                          onClick={() => {
                            deleteTask(child.Id);
                          }}
                        />
                      </TreeItemAside>
                    </TreeItem>
                  );
                })}
              </Tree>
            </TreeItem>
          );
        })}
      </Tree>
    </div>
  );
}

// 新建任务组
function NewTaskGroup(props: { reload: boolean; setReload: Function }) {
  const [open, setOpen] = useState(false);
  const [taskGroupName, setTaskGroupName] = useState("");
  const addTaskGroup = () => {
    axios
      .post("/api/task-group/add-task-group", {
        name: taskGroupName,
      })
      .then(() => {
        props.setReload(!props.reload);
        setOpen(false);
        setTaskGroupName("");
      });
  };
  return (
    <Dialog open={open}>
      <DialogTrigger>
        <Button
          appearance="primary"
          icon={<Add24Regular />}
          onClick={() => setOpen(true)}
        >
          新建任务组
        </Button>
      </DialogTrigger>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>新建任务组</DialogTitle>
          <DialogContent>
            <Input
              placeholder="任务组名"
              className="w-full"
              value={taskGroupName}
              onChange={(e) => setTaskGroupName(e.target.value)}
            ></Input>
          </DialogContent>
          <DialogActions>
            <DialogTrigger>
              <Button
                appearance="secondary"
                onClick={() => {
                  setOpen(false);
                  setTaskGroupName("");
                }}
              >
                取消
              </Button>
            </DialogTrigger>
            <Button appearance="primary" onClick={addTaskGroup}>
              确定
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}

// 新建任务
function NewTask(props: { reload: boolean; setReload: Function }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [groupID, setGroupID] = useState("");
  const [musicID, setMusicID] = useState("");
  const [loop, setLoop] = useState(false);
  const addButtonClick = () => {
    setOpen(true);
  };
  const [taskGroupList, setTaskGroupList] = useState([]);
  const [musicList, setMusicList] = useState([{}, {}]);
  useEffect(() => {
    // 获取任务组列表
    axios.get("/api/task-group/get-task-group-list").then((res) => {
      setTaskGroupList(res.data);
    });
    // 获取音乐列表
    axios.get("/api/music-resource/get-music-list").then((res) => {
      if (res.data.length === 0) {
        Message.error("想要进行任务策略的配置，您需要至少有一个音乐资源");
        navigate("/resource-group");
      }
      res.data.push({
        Id: -1,
        Title: "待命",
        MusicFile: "",
      }); // 添加待命
      setMusicList(res.data.reverse());
    });
  }, [props.reload]);
  if (taskGroupList.length === 0) return <></>;

  const addTask = () => {
    // 判断是否选择了任务组
    if (groupID === "") {
      Message.error("请选择任务组");
      return;
    }
    // 判断是否选择了音乐
    if (musicID === "") {
      Message.error("请选择音乐");
      return;
    }
    axios
      .post("/api/task-group/add-task", {
        groupId: groupID,
        musicId: musicID,
        loop: loop,
      })
      .then(() => {
        props.setReload(!props.reload);
        setLoop(false);
        setOpen(false);
      });
  };
  return (
    <div>
      <Button
        appearance="outline"
        icon={<Add24Regular />}
        onClick={addButtonClick}
        style={{ marginLeft: "8px" }}
      >
        新建任务
      </Button>
      <Modal
        visible={open}
        onCancel={() => setOpen(false)}
        title="新建任务"
        onConfirm={addTask}
      >
        <div className="flex flex-col">
          <label key="groupLabel">任务组</label>
          <Select
            onChange={(e) => {
              setGroupID(e.match(/(\S*)brbrb/)[1]);
            }}
            placeholder="请选择任务组"
            key="group"
            showSearch
          >
            {taskGroupList.map((item: any) => (
              <Select.Option
                key={item.Id + "brbrb" + item.Name}
                value={item.Id + "brbrb" + item.Name}
              >
                {item.Name}
              </Select.Option>
            ))}
          </Select>
          <Space className="mt-2"></Space>
          <label key="musicLabel">任务组</label>
          <Select
            onChange={(e) => {
              setMusicID(e.match(/(\S*)brbrb/)[1]);
            }}
            placeholder="请选择音乐"
            key="music"
            showSearch
          >
            {musicList.map((item: any) => (
              <Select.Option
                key={item.Id + "brbrb" + item.Title}
                value={item.Id + "brbrb" + item.Title}
              >
                {item.Title}
              </Select.Option>
            ))}
          </Select>
          <div className="mt-2">
            <label className="mr-2">循环播放</label>
            <Switch
              checked={loop}
              onChange={(e) => {
                setLoop(e);
              }}
            ></Switch>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// 删除任务组确认弹窗
function DeleteGroupConfirm(prop: {
  item: any;
  setReload: Function;
  reload: boolean;
}) {
  const deleteTaskGroup = (id: number) => {
    axios.delete("/api/task-group/delete-task-group?Id=" + id).then(() => {
      prop.setReload(!prop.reload);
    });
  };
  return (
    <Dialog>
      <DialogTrigger disableButtonEnhancement>
        <Button icon={<Delete24Regular />} appearance="subtle"></Button>
      </DialogTrigger>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>删除警告</DialogTitle>
          <DialogContent>
            将要删除标题为 "{prop.item.Name}" 的任务策略组
            <br />
            此操作不可逆，确认删除？
          </DialogContent>
          <DialogActions>
            <DialogTrigger disableButtonEnhancement>
              <Button >取消</Button>
            </DialogTrigger>
            <DialogTrigger>
              <Button
                appearance="primary"
                onClick={() => {
                  deleteTaskGroup(prop.item.Id);
                }}
              >
                确认
              </Button>
            </DialogTrigger>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}

export default TaskGroup;
