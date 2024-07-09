-- CreateEnum
CREATE TYPE "account_type" AS ENUM ('ACCOUNT_DEFAULT', 'ACCOUNT_ADMIN');

-- CreateEnum
CREATE TYPE "address_type" AS ENUM ('HOME', 'WORK', 'OTHER');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "fullName" TEXT,
    "password" TEXT,
    "ban" BOOLEAN NOT NULL DEFAULT false,
    "profilePicture" JSON,
    "accountType" "account_type" NOT NULL,
    "activeAs" "account_type" NOT NULL,
    "firstName" TEXT,
    "lastname" TEXT,
    "accessPin" TEXT,
    "isAccessPinRequired" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Device" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "brand" TEXT,
    "firstInstallationTime" BIGINT,
    "lastUpdateTime" BIGINT,
    "ipAddress" TEXT,
    "apiLevel" DOUBLE PRECISION,
    "installerPackageName" TEXT,
    "installerReferrer" TEXT,
    "buildId" TEXT,
    "buildNumber" TEXT,
    "applicationName" TEXT,
    "applicationVersion" TEXT,
    "bundleId" TEXT,
    "baseOs" TEXT,
    "deviceUniqueId" TEXT NOT NULL,
    "deviceType" TEXT,
    "deviceName" TEXT,
    "deviceToken" TEXT,
    "fcmToken" TEXT,
    "hardware" TEXT,
    "fingerPrint" TEXT,
    "fontScale" DOUBLE PRECISION,
    "freeDiskStorage" DOUBLE PRECISION,
    "display" TEXT,
    "bootLoader" TEXT,
    "batteryLevel" DOUBLE PRECISION,
    "instanceId" TEXT,
    "macAddress" TEXT,
    "maxMemory" INTEGER,
    "host" TEXT,
    "imei" TEXT,
    "carrier" TEXT,
    "manufacturer" TEXT,
    "model" TEXT,
    "serialNumber" TEXT,
    "securityPatch" TEXT,
    "processor" TEXT[],
    "osName" TEXT,
    "osVersion" TEXT,
    "totalCapacity" DOUBLE PRECISION,
    "userAgent" TEXT,
    "haveCamera" BOOLEAN NOT NULL DEFAULT false,
    "isAirplaneMode" BOOLEAN NOT NULL DEFAULT false,
    "isCharging" BOOLEAN NOT NULL DEFAULT false,
    "isSavePowerModeOn" BOOLEAN NOT NULL DEFAULT false,
    "isEmulator" BOOLEAN NOT NULL DEFAULT false,
    "isPinOrFingerPrintSet" BOOLEAN NOT NULL DEFAULT false,
    "isLandscape" BOOLEAN NOT NULL DEFAULT false,
    "isLocationEnabled" BOOLEAN NOT NULL DEFAULT false,
    "isHeadPhoneConnected" BOOLEAN NOT NULL DEFAULT false,
    "isTablet" BOOLEAN NOT NULL DEFAULT false,
    "ban" BOOLEAN NOT NULL DEFAULT false,
    "receivePushNotification" BOOLEAN NOT NULL DEFAULT false,
    "codeName" TEXT,
    "browserName" TEXT DEFAULT 'unkown',

    CONSTRAINT "Device_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mobile" (
    "id" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "primaryAccountId" TEXT NOT NULL,
    "primaryDeviceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Mobile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "__Device__ufk__" TEXT NOT NULL,
    "__Locations__fk__" TEXT NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Locations" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "previousPointId" TEXT,
    "heading" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "averageSpeed" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "point" TEXT NOT NULL,
    "latitudeDelta" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "longitudeDelta" DOUBLE PRECISION NOT NULL DEFAULT 0.0,

    CONSTRAINT "Locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AccountDevice" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "__Account__fk__" TEXT NOT NULL,
    "__Device__fk__" TEXT NOT NULL,
    "ban" BOOLEAN NOT NULL DEFAULT false,
    "accountId" TEXT,

    CONSTRAINT "_AccountDevice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DeviceMobile" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "__Mobile__fk__" TEXT NOT NULL,
    "__Device__fk__" TEXT NOT NULL,
    "ban" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "Cron" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "whatToCron" TEXT NOT NULL,
    "atWhatTime" TIMESTAMP(6) NOT NULL,
    "params" JSON,
    "executed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Cron_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "formattedAddress" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "landMark" TEXT NOT NULL,
    "zipCode" BIGINT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "type" "address_type" NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "point" TEXT NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AddressAccount" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "__Account__fk__" TEXT NOT NULL,
    "__Address__fk" TEXT NOT NULL,
    "accountId" TEXT,

    CONSTRAINT "_AddressAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Setting" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "supportEmail" TEXT NOT NULL DEFAULT 'dotsinspace@gmail.com',
    "supportPhoneNumber" TEXT NOT NULL DEFAULT '+918826668515',
    "userAccessPinExpireIn" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "isAccessPinRequired" BOOLEAN NOT NULL DEFAULT false,
    "nearByMinimumTime" TEXT NOT NULL DEFAULT '30',
    "nearByMinimumTimeUnit" TEXT NOT NULL DEFAULT 'minutes',

    CONSTRAINT "Setting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Device_deviceUniqueId_key" ON "Device"("deviceUniqueId");

-- CreateIndex
CREATE UNIQUE INDEX "Device_fcmToken_key" ON "Device"("fcmToken");

-- CreateIndex
CREATE UNIQUE INDEX "Device_imei_key" ON "Device"("imei");

-- CreateIndex
CREATE UNIQUE INDEX "Mobile_number_key" ON "Mobile"("number");

-- CreateIndex
CREATE UNIQUE INDEX "Mobile_primaryAccountId_key" ON "Mobile"("primaryAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Mobile_primaryDeviceId_key" ON "Mobile"("primaryDeviceId");

-- CreateIndex
CREATE UNIQUE INDEX "Location___Device__ufk___key" ON "Location"("__Device__ufk__");

-- CreateIndex
CREATE UNIQUE INDEX "_DeviceMobile_id_key" ON "_DeviceMobile"("id");

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location___Device__ufk___fkey" FOREIGN KEY ("__Device__ufk__") REFERENCES "Device"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location___Locations__fk___fkey" FOREIGN KEY ("__Locations__fk__") REFERENCES "Locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AccountDevice" ADD CONSTRAINT "_AccountDevice___Device__fk___fkey" FOREIGN KEY ("__Device__fk__") REFERENCES "Device"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AccountDevice" ADD CONSTRAINT "_AccountDevice_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DeviceMobile" ADD CONSTRAINT "_DeviceMobile___Device__fk___fkey" FOREIGN KEY ("__Device__fk__") REFERENCES "Device"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DeviceMobile" ADD CONSTRAINT "_DeviceMobile___Mobile__fk___fkey" FOREIGN KEY ("__Mobile__fk__") REFERENCES "Mobile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AddressAccount" ADD CONSTRAINT "_AddressAccount___Address__fk_fkey" FOREIGN KEY ("__Address__fk") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AddressAccount" ADD CONSTRAINT "_AddressAccount_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;
