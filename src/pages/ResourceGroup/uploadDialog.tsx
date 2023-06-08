import { Message, Upload } from "@arco-design/web-react";
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
  Spinner,
} from "@fluentui/react-components";
import axios from "axios";
import { useState } from "react";

function UploadDialog(props: { setReload: Function, reload: boolean }) {
  const [musicName, setMusicName] = useState("");
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  return (
    <Dialog modalType="alert" open={open}>
      <DialogTrigger disableButtonEnhancement>
        <Button appearance="primary" onClick={() => setOpen(true)}>
          上传音乐
        </Button>
      </DialogTrigger>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>上传音乐</DialogTitle>
          <DialogContent>
            <div className="flex flex-col" style={{ overflow: "hidden" }}>
              <Input
                placeholder="音乐名"
                value={musicName}
                onChange={(e) => {
                  setMusicName(e.target.value);
                }}
                className="mb-2"
              ></Input>
              <Upload
                drag
                limit={1}
                accept=".mp3,.ogg,.flac,.wav"
                action="/api/music-resource/upload-music"
                tip="支持 mp3 wav flac ogg 格式的音乐"
                disabled={musicName == ""}
                onChange={(e: any) => {
                  try {
                    if (e[0].status === "done" && e[0].response.code === 0) {
                      console.log(e[0].response.data.fileName);
                      addMusic(
                        musicName,
                        e[0].response.data.fileName,
                        setMusicName,
                        setOpen,
                        props.setReload,
                        props.reload,
                        setUploading
                      );
                    } else if (e[0].status === "error") {
                      Message.error("上传失败");
                      setUploading(false);
                    }
                  } catch (e) {}
                }}
                onProgress={() => {
                  setUploading(true);
                }}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <DialogTrigger disableButtonEnhancement>
              <Button
                appearance="secondary"
                onClick={() => {
                  setMusicName("");
                  setOpen(false);
                }}
                disabled={uploading}
              >
                关闭
              </Button>
            </DialogTrigger>
            <Button appearance="primary">
              {uploading ? <Spinner size="small" /> : "上传"}
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}

function addMusic(
  musicName: string,
  musicFileName: string,
  setMusicName: Function,
  setOpen: Function,
  setReload: Function,
  reload: boolean,
  setUploading: Function
) {
  axios
    .post("/api/music-resource/add-music", {
      title: musicName,
      fileName: musicFileName,
    })
    .then((res) => {
      if (res.data.code == 0) {
        Message.success("上传成功");
      } else {
        Message.error("上传失败");
      }
      setOpen(false);
      setMusicName("");
      setReload(!reload);
      setUploading(false)
    });
}

export default UploadDialog;
