// here's a fake hardware device that we'll expose to HomeKit
import {
  Accessory,
  AccessoryEventTypes,
  Categories,
  Characteristic,
  CharacteristicValue,
  Service,
  uuid,
  VoidCallback,
} from "hap";

const FAKE_FAN: Record<string, any> = {
  powerOn: false,
  rSpeed: 100,
  setPowerOn: (on: CharacteristicValue) => {
    if (on) {
      FAKE_FAN.powerOn = on;
    } else {
      FAKE_FAN.powerOn = on;
    }
  },
  setSpeed: (value: CharacteristicValue) => {
    console.log("Setting fan rSpeed to %s", value);
    FAKE_FAN.rSpeed = value;
  },
  identify: () => {
    console.log("Fan Identified!");
  },
};

const fan = new Accessory("Fan", uuid.generate("hap-nodejs:accessories:Fan"));

fan
  .getService(Service.AccessoryInformation)!
  .setCharacteristic(Characteristic.Manufacturer, "Sample Company");

fan.on(
  AccessoryEventTypes.IDENTIFY,
  (paired: boolean, callback: VoidCallback) => {
    FAKE_FAN.identify();
    callback(); // success
  },
);

fan
  .addService(Service.Fan, "Fan")
  .getCharacteristic(Characteristic.On)!
  .onSet((value) => {
    FAKE_FAN.setPowerOn(value);
  });

fan
  .getService(Service.Fan)!
  .getCharacteristic(Characteristic.On)!
  .onGet(() => {
    return !!FAKE_FAN.powerOn;
  });

fan
  .getService(Service.Fan)!
  .addCharacteristic(Characteristic.RotationSpeed)
  .onGet(async () => {
    return FAKE_FAN.rSpeed;
  })
  .onSet(async (value) => {
    FAKE_FAN.setSpeed(value);
  });

fan.publish({
  username: "1A:2B:3C:4D:5E:FF",
  pincode: "031-45-154",
  category: Categories.FAN,
});
