import React, { useEffect, useState } from "react";
import { Text, View, ScrollView } from "react-native";
import { Modal } from "native-base";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import MapView, { Marker } from "react-native-maps";
import DateTimePicker from "react-native-modal-datetime-picker";
import BaseButton from "@src/components/utils/button";
import BaseInput from "@src/components/utils/inputbox";
import DateFormat from "@src/components/utils/dateformat";
import TimeFormat from "@src/components/utils/timeformat";
import ErrorAlert from "@src/components/utils/erroralert";
import postCreateService from "@src/api/service/postCreateService";
import getLocation from "@src/api/maps/getLocation";
import getCoordinates from "@src/api/maps/getCoordinates";
import * as SecureStore from "expo-secure-store";

const SchedulerUI = () => {
  const { type } = useLocalSearchParams();
  const [info, setInfo] = useState({
    accountId: null,
    collectionDate: null,
    collectionTime: null,
    collectionAddress: null,
    deliveryDate: null,
    deliveryTime: null,
    deliveryAddress: null,
    serviceType: type,
  });
  const [deliveryDateModalVisible, setDeliveryDateModalVisible] =
    React.useState(false);
  const [collectionDateModalVisible, setCollectionDateModalVisible] =
    React.useState(false);
  const [deliveryTimeModalVisible, setDeliveryTimeModalVisible] =
    React.useState(false);
  const [collectionTimeModalVisible, setCollectionTimeModalVisible] =
    React.useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [collectionRegion, setCollectionRegion] = useState({
    latitude: 1.3483,
    longitude: 103.6831,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [deliveryRegion, setDeliveryRegion] = useState({
    latitude: 1.3483,
    longitude: 103.6831,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const navigation = useNavigation();

  const getAccountId = async () => {
    try {
      const accountId = await SecureStore.getItemAsync("accountId");
      await inputHandler(accountId, "accountId");
    } catch (e) {
      setErrorMessage("Error in fetching Account ID.");
      setShowAlert(true);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getAccountId();
    });

    return () => {
      unsubscribe(); // Cleanup when the component is unmounted
    };
  }, [navigation]);

  const inputHandler = (input, field) => {
    setInfo((prevState) => ({ ...prevState, [field]: input }));
  };

  const resetHandler = () => {
    setShowAlert(false);
  };

  const dateHandler = (date, field) => {
    inputHandler(DateFormat(date), field);
    setCollectionDateModalVisible(false);
    setDeliveryDateModalVisible(false);
  };

  const timeHandler = (date, field) => {
    inputHandler(TimeFormat(date), field);
    setCollectionTimeModalVisible(false);
    setDeliveryTimeModalVisible(false);
  };

  const validInput = async () => {
    return Object.keys(info).reduce((previousValue, currentValue) => {
      return previousValue && info[currentValue] != null;
    }, true);
  };

  const submitHandler = async () => {
    if (await validInput()) {
      try {
        console.log("Calling post to create service");
        await postCreateService(info).then((json) => {
          const validResponse = json !== null ? !!json.success : false;
          if (validResponse) {
            const serviceId = json.body.serviceId;
            const jobId = json.body.jobId;

            // Save IDs to SecureStore for future references (cache)
            SecureStore.setItemAsync("serviceId", serviceId);
            SecureStore.setItemAsync("jobId", jobId);
            console.log(`Saving ${serviceId} and ${jobId} to SecureStore`);

            // Reroute to success page
            router.push("/customer/schedule/schedulesuccess");
          } else {
            setErrorMessage(json.body);
            setShowAlert(true);
          }
        });
      } catch (e) {
        setErrorMessage("Error calling API endpoint to create service.");
        setShowAlert(true);
      }
    } else {
      setShowAlert(true);
    }
  };

  const onRegionChange = (region, field) => {
    if (field === "delivery") {
      setDeliveryRegion(region);
    } else {
      setCollectionRegion(region);
    }
  };

  const searchAddressHandler = async (field) => {
    const collection = field === "Collection";

    try {
      const res = await getLocation(
        collection ? info.collectionAddress : info.deliveryAddress
      );
      if (res.success) {
        const data = res.body;

        if (collection) {
          setCollectionRegion({
            ...collectionRegion,
            longitude: data.lng,
            latitude: data.lat,
          });
        } else {
          setDeliveryRegion({
            ...deliveryRegion,
            longitude: data.lng,
            latitude: data.lat,
          });
        }
      } else {
        setShowAlert(true);
        setErrorMessage(res.body);
      }
    } catch (e) {
      setErrorMessage("Failed to find collection address using GoogleAPI.");
      setShowAlert(true);
    }
  };

  const searchCoordinatesHandler = async (field) => {
    const collection = field === "Collection";

    try {
      const res = await getCoordinates(
        collection ? collectionRegion : deliveryRegion
      );

      if (res.success) {
        const data = res.body;

        if (collection) {
          inputHandler(data, "collectionAddress");
        } else {
          inputHandler(data, "deliveryAddress");
        }
      } else {
        setShowAlert(true);
        setErrorMessage(res.body);
      }
    } catch (e) {
      setErrorMessage("Failed to find collection address using GoogleAPI.");
      setShowAlert(true);
    }
  };

  return (
    <ScrollView className={"h-full m-3"}>
      {showAlert && (
        <Modal isOpen={showAlert} onClose={() => resetHandler()}>
          <Modal.Content className={"bg-transparent"}>
            <Modal.Body>
              <ErrorAlert
                title={"Please try again!"}
                message={errorMessage ?? "You have missing or invalid inputs!"}
                onPress={() => resetHandler()}
                shown={showAlert}
              />
            </Modal.Body>
          </Modal.Content>
        </Modal>
      )}
      <View className={"h-[150vh]"}>
        <View className={"flex flex-col m-3"}>
          <Text className={"font-RobotoBold text-2xl mt-2"}>
            Schedule{" "}
            <Text className={"text-secondary"}>
              Moving {type === "MoveIn" ? "In" : "Out"}
            </Text>{" "}
            Service
          </Text>

          <Text className={"font-RobotoMedium text-lg mt-4 underline"}>
            Part 1: Collection
          </Text>

          <View className={"flex flex-col mt-3"}>
            <Text className={"font-RobotoMedium"}>
              Choose a Collection Date
            </Text>

            <View className={"mt-2"}>
              <BaseButton
                primary
                textSize={13}
                title={info.collectionDate ?? "Select Date"}
                onPress={() => setCollectionDateModalVisible(true)}
              />

              <DateTimePicker
                isVisible={collectionDateModalVisible}
                mode={"date"}
                onConfirm={(date) => dateHandler(date, "collectionDate")}
                onCancel={() => setCollectionDateModalVisible(false)}
              />
            </View>
          </View>

          <View className={"mt-4"}>
            <Text className={"font-RobotoMedium"}>Set Collection Time</Text>

            <View className={"mt-2"}>
              <BaseButton
                primary
                textSize={13}
                title={info.collectionTime ?? "Select Time"}
                onPress={() => setCollectionTimeModalVisible(true)}
              />
            </View>

            <DateTimePicker
              isVisible={collectionTimeModalVisible}
              mode={"time"}
              onConfirm={(time) => timeHandler(time, "collectionTime")}
              onCancel={() => setCollectionTimeModalVisible(false)}
            />
          </View>

          <View className={"mt-4"}>
            <MapView
              className={"w-full h-52"}
              region={collectionRegion}
              onRegionChange={(region) => onRegionChange(region, "collection")}
            >
              <Marker
                coordinate={{
                  longitude: collectionRegion.longitude,
                  latitude: collectionRegion.latitude,
                }}
              />
            </MapView>

            <View className={"mt-4"}>
              <BaseButton
                primary
                title={"Search Coordinates"}
                onPress={() => searchCoordinatesHandler("Collection")}
                textSize={14}
                width={150}
              />
            </View>

            <View className={"mt-2"}>
              <BaseInput
                title="Enter Collection Address"
                placeholder={"e.g. 123 Main st."}
                defaultValue={info.collectionAddress}
                onChangeText={(address) =>
                  inputHandler(address, "collectionAddress")
                }
              />
              <BaseButton
                primary
                title={"Search Address"}
                onPress={() => searchAddressHandler("Collection")}
                textSize={14}
                width={130}
              />
            </View>
          </View>

          {/* PART 2 */}
          <View className={"flex flex-col"}>
            <Text className={"font-RobotoMedium text-lg mt-4 underline"}>
              Part 2: Delivery
            </Text>

            <Text className={"font-RobotoMedium mt-4"}>
              Choose a Delivery Date
            </Text>

            <View className={"mt-2"}>
              <BaseButton
                primary
                textSize={13}
                title={info.deliveryDate ?? "Select Date"}
                onPress={() => setDeliveryDateModalVisible(true)}
              />

              <DateTimePicker
                isVisible={deliveryDateModalVisible}
                mode={"date"}
                onConfirm={(date) => dateHandler(date, "deliveryDate")}
                onCancel={() => setDeliveryDateModalVisible(false)}
              />
            </View>
          </View>

          <View className={"mt-4"}>
            <Text className={"font-RobotoMedium"}>Set Delivery Time</Text>

            <View className={"mt-2"}>
              <BaseButton
                primary
                textSize={13}
                title={info.deliveryTime ?? "Select Time"}
                onPress={() => setDeliveryTimeModalVisible(true)}
              />
            </View>

            <DateTimePicker
              isVisible={deliveryTimeModalVisible}
              mode={"time"}
              onConfirm={(time) => timeHandler(time, "deliveryTime")}
              onCancel={() => setDeliveryTimeModalVisible(false)}
            />
          </View>

          <View className={"mt-4"}>
            <MapView
              className={"w-full h-52"}
              initialRegion={deliveryRegion}
              region={deliveryRegion}
              onRegionChange={(region) => onRegionChange(region, "delivery")}
            >
              <Marker
                coordinate={{
                  longitude: deliveryRegion.longitude,
                  latitude: deliveryRegion.latitude,
                }}
              />
            </MapView>

            <View className={"mt-4"}>
              <BaseButton
                primary
                title={"Search Coordinates"}
                onPress={() => searchCoordinatesHandler("Delivery")}
                textSize={14}
                width={150}
              />
            </View>

            <View className={"mt-4"}>
              <BaseInput
                title="Enter Delivery Address"
                placeholder={"e.g. 123 Main st."}
                defaultValue={info.deliveryAddress}
                onChangeText={(address) =>
                  inputHandler(address, "deliveryAddress")
                }
              />
              <BaseButton
                primary
                title={"Search Address"}
                onPress={() => searchAddressHandler("Delivery")}
                textSize={14}
                width={130}
              />
            </View>
          </View>

          <View className={"flex flex-row justify-center items-center mt-6"}>
            <BaseButton
              title="Schedule"
              width="70%"
              onPress={() => submitHandler()}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignContent: "center",
              margin: 5,
            }}
          >
            <BaseButton title="Cancel" width="70%" onPress={router.back} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default SchedulerUI;
