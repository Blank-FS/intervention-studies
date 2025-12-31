import React from "react";
import { Card } from "../ui/card";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";

const FluStudyCard = ({ completed }: { completed: boolean }) => {
  return (
    <Card className="bg-umich-blue/70 gap-4 p-2">
      <Image
        src="/images/flu-study.jpg"
        alt="Flu Study"
        width={300}
        height={150}
        className="rounded-xl"
      />
      <div className="flex items-center justify-between px-2">
        <h2 className="text-xl font-bold">Flu Study</h2>
        {completed ? (
          <Button
            className="bg-umich-maize text-umich-blue hover:bg-umich-maize/80 font-bold disabled:opacity-50"
            disabled
          >
            Completed
          </Button>
        ) : (
          <Link href="/participant/flu-study">
            <Button className="bg-umich-maize text-umich-blue hover:bg-umich-maize/80 font-bold disabled:opacity-50">
              Start
            </Button>
          </Link>
        )}
      </div>
    </Card>
  );
};

export default FluStudyCard;
