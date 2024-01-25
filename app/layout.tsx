import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.scss";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Breadcrumb, ConfigProvider, Flex, Layout, Menu, theme } from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
import { PanelsTopLeft, Shapes, SpellCheck2 } from "lucide-react";
import Sider from "antd/es/layout/Sider";
import { createElement } from "react";
import Paragraph from "antd/es/typography/Paragraph";
import Title from "antd/es/typography/Title";
import Link from "next/link";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Classification Demo App",
  description: "This is a demo app created for classification task",
};

const items = [
  { icon: Shapes, text: "Image Classification", link: "/image" },
  { icon: SpellCheck2, text: "Text Classification", link: "/text" },
].map((item, index) => ({
  key: String(index + 1),
  icon: createElement(item.icon),
  label: <Link href={item.link}>{item.text}</Link>,
}));

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = {
    token: {
      colorPrimary: "#104F55",
    },
    components: {
      Layout: {
        headerBg: "white",
        footerBg: "white",
        bodyBg: "white",
        siderBg: "white",
      },
      Button: {
        colorPrimary: "#104F55",
      },
      Menu: {
        itemSelectedBg: "orange",
      },
    },
  };
  return (
    <ConfigProvider theme={theme} prefixCls="pb">
      <html lang="en">
        <body className={`${inter.className}`}>
          <AntdRegistry>
            <Layout className="h-screen">
              <Header className="border-b-2 border-primary">
                <div className="demo-logo" />
                <Menu
                  theme="dark"
                  mode="horizontal"
                  defaultSelectedKeys={["2"]}
                  items={[]}
                  style={{ flex: 1, minWidth: 0 }}
                />
              </Header>
              <Content className="overflow-auto">
                <Layout className="h-full" hasSider>
                  <Sider
                    width="400"
                    breakpoint="lg"
                    collapsedWidth="0"
                    className="border-e-2 border-primary"
                  >
                    <Title className="my-2 mx-4 pb-2 border-b-2 border-[#104F55]">
                      <Flex align="center" gap={15}>
                        <PanelsTopLeft size={32} />
                        Pages
                      </Flex>
                    </Title>
                    <Menu
                      mode="inline"
                      defaultSelectedKeys={["1"]}
                      items={items}
                    />
                  </Sider>
                  <Content className="p-5"> {children}</Content>
                </Layout>
              </Content>
              <Footer className="text-center border-t-2 border-primary">
                Classification Task ©{new Date().getFullYear()} Created by{" "}
                <span className="font-bold">Hamid Basri</span>
              </Footer>
            </Layout>
          </AntdRegistry>
        </body>
      </html>
    </ConfigProvider>
  );
}
