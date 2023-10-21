import React, { useState } from "react";
import { Text, View, Image, ScrollView } from "react-native";
import { SERVICE_STATUS } from "@src/components/enum/servicestatus";
import BaseButton from "@src/components/utils/button";
import LandingIcon from "@src/assets/splash/LandingLogo.png";
import TextDisplay from "@src/components/utils/textdisplay";

const ScheduledTrackerUI = () => {
  const [serviceInfo, setServiceInfo] = useState({
    collectionDate: "28 Dec 2023",
    collectionTime: "12:30 AM",
    collectionAddress: "test",
    deliveryDate: "30 Dec 2023",
    deliveryTime: "12:30 AM",
    deliverAddress: "test",
    serviceType: "Move In",
  });
  const [personnelInfo, setPersonnelInfo] = useState({
    name: "Barry Alan",
    contact: "12345678",
  });
  const [serviceStatus, setServiceStatus] = useState(SERVICE_STATUS.SCHEDULED);

  return (
    <ScrollView className={"flex flex-column m-6"}>
      <View className={"mt-4"}>
        <Text className={"font-RobotoBold text-2xl"}>Progress Tracker</Text>

        <View
          className={
            "inline-block top-[107px] mx-[70px] border-b-[1px] border-primary"
          }
        />
        <View
          className={"flex flex-row"}
          style={{ justifyContent: "space-evenly", gap: 20, marginTop: 20 }}
        >
          <View
            className={"flex flex-column"}
            style={{ justifyContent: "center", alignItems: "center", gap: 5 }}
          >
            <Text style={{ fontSize: 25 }}>📅</Text>
            <Text style={{ fontSize: 15, fontWeight: "bold" }}>Scheduled</Text>

            {serviceStatus === SERVICE_STATUS.SCHEDULED ? (
              <Text style={{ marginTop: 20 }}>●</Text>
            ) : (
              <Text style={{ marginTop: 20 }}>○</Text>
            )}
          </View>

          <View
            className={"flex flex-column"}
            style={{ justifyContent: "center", alignItems: "center", gap: 5 }}
          >
            <Text style={{ fontSize: 25 }}>🚚</Text>
            <Text style={{ fontSize: 15, fontWeight: "bold" }}>
              In Progress
            </Text>

            {serviceStatus === SERVICE_STATUS.PROGRESS ? (
              <Text style={{ marginTop: 20 }}>●</Text>
            ) : (
              <Text style={{ marginTop: 20 }}>○</Text>
            )}
          </View>

          <View
            className={"flex flex-column"}
            style={{ justifyContent: "center", alignItems: "center", gap: 5 }}
          >
            <Text style={{ fontSize: 25 }}>📦</Text>
            <Text style={{ fontSize: 15, fontWeight: "bold" }}>Delivered!</Text>

            {serviceStatus === SERVICE_STATUS.DELIVERED ? (
              <Text style={{ marginTop: 20 }}>●</Text>
            ) : (
              <Text style={{ marginTop: 20 }}>○</Text>
            )}
          </View>
        </View>

        <View
          className={"flex flex-column"}
          style={{
            justifyContent: "space-between",
            borderWidth: 1,
            borderRadius: 5,
            margin: 10,
            marginLeft: 40,
            marginRight: 40,
            marginTop: 20,
            padding: 12,
          }}
        >
          <Text style={{ fontWeight: "bold", marginBottom: 10 }}>
            Delivery Information
          </Text>
          <TextDisplay
            title={"Collection"}
            content={
              serviceInfo.collectionDate + ", " + serviceInfo.collectionTime
            }
          />
          <TextDisplay
            title={"Delivery"}
            content={serviceInfo.deliveryDate + ", " + serviceInfo.deliveryTime}
          />

          <TextDisplay title={"Service"} content={serviceInfo.serviceType} />
        </View>

        <View
          className={"flex flex-column"}
          style={{
            justifyContent: "space-between",
            borderWidth: 1,
            borderRadius: 5,
            margin: 10,
            marginLeft: 40,
            marginRight: 40,
            marginTop: 15,
            padding: 12,
          }}
        >
          <Text style={{ fontWeight: "bold", marginBottom: 10 }}>
            Delivery Personnel
          </Text>
          <TextDisplay title={"Name"} content={personnelInfo.name} />
          <TextDisplay
            title={"Contact number"}
            content={personnelInfo.contact}
          />
        </View>

        <View
          className={"flex flex-row"}
          style={{ justifyContent: "center", borderWidth: 2, margin: 10 }}
        >
          <Image source={LandingIcon} />
        </View>

        <View
          className={"flex flex-row"}
          style={{ justifyContent: "center", margin: 20 }}
        >
          <BaseButton
            secondary
            width="60%"
            title="Cancel Service"
            link="customer/tracker/cancel"
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default ScheduledTrackerUI;
