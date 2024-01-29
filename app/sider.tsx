"use client";
import { useBoolean, useCreation } from "ahooks";
import { Button, Flex, Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import Title from "antd/es/typography/Title";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  PanelsTopLeft,
  Shapes,
  SpellCheck2,
} from "lucide-react";
import Link from "next/link";
import { createElement } from "react";
import classnames from "classnames";
import { usePathname, useRouter } from "next/navigation";
import { findIndex, propEq } from "ramda";

const routes = [
  { icon: Home, text: "Home", link: "/" },
  { icon: Shapes, text: "Image Classification", link: "/image" },
  { icon: SpellCheck2, text: "Text Classification", link: "/text" },
];

const AppSider = () => {
  const [collapsed, { toggle, setTrue, setFalse }] = useBoolean(false);
  const pathname = usePathname();
  const selectedKey = useCreation(() => {
    return String(findIndex(propEq(pathname, "link"))(routes));
  }, [pathname]);

  const items = useCreation(
    () =>
      routes.map((item, index) => ({
        key: String(index),
        icon: createElement(item.icon, {
          className: "h-full",
          size: 20,
        }),
        label: (
          <Link href={item.link} className={classnames({ hidden: collapsed })}>
            {item.text}
          </Link>
        ),
        className: !collapsed ? "flex justify-center items-center" : "py-1",
      })),
    [routes, collapsed]
  );

  return (
    <div className="h-full relative">
      <Button
        type="text"
        className={classnames(
          "absolute rounded-full outline-dashed hover:outline-2 bg-gray-200 p-1 z-20 top-[10px]",
          {
            "left-[62px]": collapsed,
            "left-[382px]": !collapsed,
          }
        )}
        onClick={() => toggle()}
      >
        {collapsed ? <ChevronRight /> : <ChevronLeft />}
      </Button>
      <Sider
        width="400"
        breakpoint="lg"
        // collapsedWidth="0"
        className="border-4 border-t-0 border-primary h-full bg-stone-100"
        trigger={null}
        collapsible
        collapsed={collapsed}
      >
        <Link href="/">
          <Title
            level={3}
            className={classnames(
              "my-2 pb-2 border-b-2 border-[#104F55] justify-center flex"
            )}
          >
            <Flex align="center" gap={15}>
              <PanelsTopLeft size={32} />
              {!collapsed && "Sections"}
            </Flex>
          </Title>
        </Link>
        <Menu
          mode="inline"
          defaultSelectedKeys={["1"]}
          selectedKeys={[selectedKey]}
          items={items}
        />
      </Sider>
    </div>
  );
};

export default AppSider;
