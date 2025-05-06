"use client";

import { useRouter } from "next/navigation";
import { splitStringByComma } from "@/lib/utils";
import {
  Award,
  Briefcase,
  FileSearch,
  MapPin,
  PenSquareIcon,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { INSURERS } from "@/constants/index";

interface AdvisorProfileProps {
  firstName: string;
  lastName: string;
  certifications: string;
  agencyName: string;
  streetAddress: string;
  city: string;
  provinceOrState: string;
  postcode: string;
  licensedProvinces: string[];
  insurers: string[];
}

// Takes: First and last name, certifications, agency name,
//        street address, city, province or state, and postcode strings.
//        An array of strings for the licensed provinces and insurers.
export function AdvisorProfile({
  firstName,
  lastName,
  certifications,
  agencyName,
  streetAddress,
  city,
  provinceOrState,
  postcode,
  licensedProvinces,
  insurers,
}: AdvisorProfileProps) {
  const router = useRouter();
  const certificationList = splitStringByComma(certifications);

  return (
    <Card id="profile" className="w-full overflow-hidden">
      <CardHeader className="bg-navbar p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white">
              <User className="text-secondary h-12 w-12" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">
                {firstName} {lastName}
              </CardTitle>
              <CardDescription className="text-blue-100">
                {agencyName}
              </CardDescription>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              className="space-x-2"
              onClick={() => router.push("/dashboard/settings?edit=true")}
            >
              <span>Edit</span>
              <PenSquareIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-8 p-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Certifications</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {certificationList.map((cert, i) => (
                <Badge key={i}>{cert}</Badge>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Briefcase className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Agency</h3>
            </div>
            <p className="text-muted-foreground">{agencyName}</p>
          </div>
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Address</h3>
            </div>
            <p className="text-muted-foreground">
              {streetAddress} {city} {provinceOrState} {postcode}
            </p>
          </div>
        </div>

        <div className="col-span-2 space-y-4">
          <div className="flex items-center space-x-2">
            <FileSearch className="h-5 w-5" />
            <h3 className="text-lg font-semibold">Disclosure</h3>
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-muted-foreground text-sm">
                I am licensed as a life and health insurance agent in:
              </p>
              <div className="flex flex-wrap gap-2">
                {licensedProvinces.map((licensedProvince, i) => (
                  <Badge key={i}>{licensedProvince}</Badge>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-muted-foreground text-sm">
                I represent the following insurers:
              </p>
              <div className="flex flex-wrap gap-2">
                {insurers.map((insurerCompCode) => {
                  const insurer = INSURERS.find(
                    (insurer) => insurer.CompCode === insurerCompCode
                  );
                  return insurer ? (
                    <Badge key={insurerCompCode}>{insurer.Name}</Badge>
                  ) : null;
                })}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
