import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Title2,
} from "@fluentui/react-components";
import { Play24Regular, Delete24Regular } from "@fluentui/react-icons";
import { useEffect, useState } from "react";
import axios from "axios";
import { Message } from "@arco-design/web-react";
import { useNavigate } from "react-router-dom";
import UploadDialog from "./uploadDialog";

function ResourceGroup() {
  const [reload, setReload] = useState(false);

  return (
    <div className="flex flex-col m-4 lg:mr-32">
      <Title2 className="mb-2">{"资源管理"}</Title2>
      <div>
        <UploadDialog setReload={setReload} reload={reload} />
        <MusicList reload={reload} setReload={setReload} />
      </div>
    </div>
  );
}

// 音乐列表
function MusicList(props: { reload: boolean; setReload: Function }) {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  // 从服务器中获取数据
  useEffect(() => {
    axios.get("/api/music-resource/get-music-list").then((res) => {
      setData(res.data.reverse());
    });
  }, [props.reload]);
  const headers = [
    { columnKey: "Title", label: "标题" },
    { columnKey: "action", label: "操作" },
  ];
  return (
    <div className="mt-2">
      <Table>
        <TableHeader>
          <TableRow>
            {headers.map((header) => (
              <TableHeaderCell key={header.columnKey}>
                {header.label}
              </TableHeaderCell>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item: any, key: any) => {
            return (
              <TableRow key={key}>
                <TableCell>{item.Title}</TableCell>
                <TableCell role="gridcell">
                  <div className="flex flex-row">
                    <Button
                      appearance="primary"
                      icon={<Play24Regular />}
                      style={{ marginRight: "8px" }}
                      onClick={() => playMusic(item.Id, navigate)}
                    ></Button>
                    <DeleteConfirm
                      item={item}
                      reload={props.reload}
                      setReload={props.setReload}
                    />
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

// 播放音乐
function playMusic(id: number, navigate: any) {
  axios.put("/api/music-ctl/play-music-by-i-d?id=" + id).then((res) => {
    if (res.data.code === 0) {
      navigate("/controller");
    } else {
      Message.error("播放失败");
    }
  });
}

// 删除确认弹窗
function DeleteConfirm(prop: {
  item: any;
  reload: boolean;
  setReload: Function;
}) {
  return (
    <Dialog>
      <DialogTrigger disableButtonEnhancement>
        <Button icon={<Delete24Regular />}></Button>
      </DialogTrigger>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>删除警告</DialogTitle>
          <DialogContent>
            将要删除标题为 "{prop.item.Title}" 的音乐
            <br />
            此操作不可逆，确认删除？
          </DialogContent>
          <DialogActions>
            <DialogTrigger disableButtonEnhancement>
              <Button appearance="secondary">取消</Button>
            </DialogTrigger>
            <DialogTrigger>
              <Button
                appearance="primary"
                onClick={() => {
                  deleteLive(prop.item.Id, prop.reload, prop.setReload);
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

// 删除音乐资源
function deleteLive(id: number, reload: boolean, setReload: Function) {
  axios.delete("/api/music-resource/delete-music?id=" + id).then((res) => {
    if (res.data.code === 0) {
      Message.success("删除成功");
    } else {
      Message.error("删除失败");
    }
    setReload(!reload);
  });
}

export default ResourceGroup;
