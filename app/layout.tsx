import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.scss";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import {
  Avatar,
  Breadcrumb,
  ConfigProvider,
  Flex,
  Layout,
  Menu,
  Space,
  theme,
} from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
import { Home, PanelsTopLeft, Shapes, SpellCheck2, User2 } from "lucide-react";
import Sider from "antd/es/layout/Sider";
import { createElement, useState } from "react";
import Paragraph from "antd/es/typography/Paragraph";
import Text from "antd/es/typography/Text";
import Title from "antd/es/typography/Title";
import Link from "next/link";
import AppSider from "./sider";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Classification Demo App",
  description: "This is a demo app created for classification task",
};
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
        headerHeight: 80,
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
              <Header className="border-4 border-primary flex justify-between items-center">
                <Title level={2} className="m-0">
                  Image (CIFAR-10) and Text (LIAR Fake News) Classification
                </Title>
                <Space className="pe-8 ps-4 h-14 bg-gray-100 hover:bg-gray-300 transition-all duration-200 rounded-full">
                  <Avatar
                    size={40}
                    className="flex justify-center items-center"
                    icon={<User2 />}
                  />
                  <Text className="select-none" strong>
                    Hamid Basri
                  </Text>
                </Space>
              </Header>
              <Layout className="overflow-auto" hasSider>
                <AppSider />
                <Layout className="h-full">
                  <Content className="h-full p-5 border-e-4 border-primary overflow-auto">
                    {children}
                  </Content>
                  <Footer className="text-center border-4 border-s-0 border-primary bg-stone-100">
                    Classification Task ©{new Date().getFullYear()} Created by{" "}
                    <span className="font-bold">Hamid Basri</span>
                  </Footer>
                </Layout>
              </Layout>
            </Layout>
          </AntdRegistry>
        </body>
      </html>
    </ConfigProvider>
  );
}
