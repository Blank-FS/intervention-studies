"use client";

import React, { useEffect, useState } from "react";
import { Card } from "../ui/card";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";

const FluStudyCard = ({
  completed = false,
  isAdmin = false,
}: {
  completed?: boolean;
  isAdmin?: boolean;
}) => {
  const [isActive, setIsActive] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  /** Fetch study state */
  useEffect(() => {
    async function fetchStudy() {
      try {
        const res = await fetch(
          "/api/proxy?path=/api/studies/flu-study/active",
          {
            credentials: "include",
          },
        );
        if (!res.ok) throw new Error("Failed to fetch study status");
        const data: { isActive: boolean } = await res.json();
        setIsActive(data.isActive);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchStudy();
  }, []);

  /** Admin toggle handler */
  const handleToggle = async (next: boolean) => {
    setIsActive(next); // optimistic update

    try {
      const res = await fetch(`/api/proxy?path=/api/studies/flu-study/toggle`, {
        method: "PUT",
        credentials: "include",
      });
      console.log(res);
      if (!res.ok) throw new Error("Failed to update study state");
    } catch (err) {
      console.error(err);
      setIsActive(!next); // rollback on failure
    }
  };

  if (loading || isActive === null) return null;
  if (!isAdmin && !isActive) return null;
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

        {/* ADMIN VIEW */}
        {isAdmin ? (
          <div className="flex items-center gap-2">
            <Label htmlFor="activate-study" className="text-sm font-medium">
              {isActive ? "Active" : "Inactive"}
            </Label>
            <Switch
              id="activate-study"
              checked={isActive}
              onCheckedChange={handleToggle}
              className="data-[state=checked]:bg-umich-maize"
            />
          </div>
        ) : completed ? (
          /* PARTICIPANT – COMPLETED */
          <Button className="bg-umich-maize text-umich-blue font-bold" disabled>
            Completed
          </Button>
        ) : (
          /* PARTICIPANT – START */
          <Link href="/participant/flu-study">
            <Button className="bg-umich-maize text-umich-blue font-bold">
              Start
            </Button>
          </Link>
        )}
      </div>
    </Card>
  );
};

export default FluStudyCard;
