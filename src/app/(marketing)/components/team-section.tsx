"use client";

import { Linkedin } from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import JeremyReinboltPhoto from "@/app/(marketing)/images/jeremy-reinbolt.jpg";

interface Team {
  name: string;
  photo: StaticImageData;
  title: string;
  linkedIn: string;
}

// Define an array of Team objects.
// { name: string, photo: StaticImageData, title: string, linkedIn: string }
const team: Team[] = [
  {
    name: "Jeremy Reinbolt",
    title: "Co-founder & President",
    photo: JeremyReinboltPhoto,
    linkedIn: "https://www.linkedin.com/in/jeremy-reinbolt-cim-clu-14049524/",
  },
];

export function TeamSection() {
  return (
    <section id="team" className="p-6 pb-20">
      <div className="mt-8 space-y-4">
        <Heading className="text-center tracking-tighter">Our Team</Heading>
      </div>
      <div className="mt-12 flex justify-center gap-10">
        {team.map((member, i) => (
          <div key={i}>
            <Image
              src={member.photo}
              alt={`Photo of ${member.name}`}
              quality={100}
              className="mb-2 aspect-667/1003 w-[400px] rounded-lg"
            />
            <div className="p-2">
              <div className="flex justify-between gap-4">
                <h2 className="text-primary text-2xl font-semibold">
                  {member.name}
                </h2>
                <Button asChild variant="secondary">
                  <a href={member.linkedIn} target="_blank">
                    <Linkedin />
                    <span className="sr-only">Linkedin</span>
                  </a>
                </Button>
              </div>
              <p className="text-muted-foreground">{member.title}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
