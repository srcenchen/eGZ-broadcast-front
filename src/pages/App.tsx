import { Divider, Tab, TabList } from "@fluentui/react-components";
import Header from "../components/Header";
import {
  RealEstate24Filled,
  MusicNote224Filled,
  GroupList24Filled,
} from "@fluentui/react-icons";
import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

function Index() {
  const [height, setHeight] = useState(window.innerHeight);
  return (
    <div className="">
      <Header />
      <div className="flex">
        <Sider height={height} setHeight={setHeight} />
        <div className="flex-1 overflow-auto" style={{ height: height - 60 }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

// Sider
function Sider(props: { height: number; setHeight: Function }) {
  // 监听窗口大小变化
  const [width, setWidth] = useState(window.innerWidth);
  const [tabWidth, setTabWidth] = useState("12rem"); // tabs 的宽度

  const updateSize = () => {
    props.setHeight(window.innerHeight);
    setWidth(window.innerWidth);
  };
  useEffect(() => {
    window.addEventListener("resize", updateSize);
    updateSize();
    // 侧边栏大小处理
    if (width < 700) setTabWidth("3rem");
    else setTabWidth("12rem");
    return () => {
      window.removeEventListener("resize", updateSize);
    };
  }, [width]);

  // Tab选择
  // 获取路由
  const location = useLocation();
  const [selectedTab, setSelectedTab] = useState(location.pathname);
  useEffect(() => {
    setSelectedTab(location.pathname);
  }, [location]);
  // Tab处理
  type Tab = {
    id: string;
    name: string;
    icon: React.ReactElement;
  };
  const tabs: Tab[] = [
    {
      id: "/controller",
      name: "控制中心",
      icon: <RealEstate24Filled />,
    },
    {
      id: "/task-group",
      name: "任务策略",
      icon: <GroupList24Filled />,
    },
    {
      id: "/resource-group",
      name: "资源管理",
      icon: <MusicNote224Filled />,
    }
  ];

  if (width < 700) {
    // 删除 name 属性
    tabs.forEach((tab) => {
      tab.name = "";
    });
  }
  const navigate = useNavigate();
  return (
    <div className="lg:ml-32 flex" style={{ height: props.height - 60 }}>
      <TabList
        vertical
        size="large"
        className="m-1"
        style={{ width: tabWidth }}
        selectedValue={selectedTab}
        onTabSelect={(_, data) => {
          navigate(data.value as string);
        }}
      >
        {tabs.map((tab) => (
          <Tab value={tab.id} icon={tab.icon} key={tab.id}>
            {tab.name}
          </Tab>
        ))}
      </TabList>
      <Divider vertical />
    </div>
  );
}

export default Index;
