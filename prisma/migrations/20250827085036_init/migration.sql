-- CreateTable
CREATE TABLE "motorcycles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "engine" TEXT NOT NULL,
    "power" TEXT NOT NULL,
    "torque" TEXT NOT NULL,
    "maxSpeed" TEXT NOT NULL,
    "fuelConsumption" TEXT NOT NULL,
    "weight" TEXT NOT NULL,
    "maxLoad" TEXT NOT NULL,
    "dimensions" TEXT NOT NULL,
    "wheelbase" TEXT NOT NULL,
    "brakeType" TEXT NOT NULL,
    "fuelCapacity" TEXT NOT NULL,
    "starter" TEXT NOT NULL,
    "tires" TEXT NOT NULL,
    "containerQty" TEXT NOT NULL,
    "bore" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "admins" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "admins_username_key" ON "admins"("username");

-- CreateIndex
CREATE UNIQUE INDEX "admins_email_key" ON "admins"("email");
