import { Card, Flex } from "antd";
import AnimatedCard from "./card";
import Link from "next/link";
import Image from "next/image";
import Title from "antd/es/typography/Title";
import Paragraph from "antd/es/typography/Paragraph";

export default function Home() {
  return (
    <Flex gap={80} justify="center" align="center" className="h-full">
      <Link href="/text">
        <Card
          className="w-[400px] h-[400px] rounded-lg transform transition duration-500 hover:scale-110 group"
          cover={
            <div>
              <Image
                className="bg-gray-600"
                fill
                src="/liar_bg.jpg"
                alt="liar image"
              />
              <div className="bg-slate-600 absolute h-full w-full opacity-0 group-hover:opacity-90 rounded-2xl transition duration-200"></div>
              <div className="absolute w-full text-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition duration-500">
                <div className="bg-red-800 w-full h-full"></div>
                <Title level={2} className="font-bold w-full text-primary">
                  LIAR Classification
                </Title>
                <Paragraph className="text-2xl text-white">
                  Fake News Detection
                </Paragraph>
              </div>
            </div>
          }
        ></Card>
      </Link>
      <Link href="/image">
        <Card
          className="w-[400px] h-[400px] rounded-lg transform transition duration-500 hover:scale-110 group"
          cover={
            <div>
              <Image
                className="bg-gray-600"
                fill
                src="/cifar_bg.png"
                alt="cifar image"
              />
              <div className="bg-slate-600 absolute h-full w-full opacity-0 group-hover:opacity-90 rounded-2xl transition duration-200"></div>
              <div className="absolute w-full text-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition duration-500">
                <div className="bg-red-800 w-full h-full"></div>
                <Title level={2} className="font-bold w-full text-primary">
                  CIFAR-10 Classification
                </Title>
                <Paragraph className="text-2xl text-white">
                  Common Image Detection
                </Paragraph>
              </div>
            </div>
          }
        ></Card>
      </Link>
    </Flex>
  );
}
