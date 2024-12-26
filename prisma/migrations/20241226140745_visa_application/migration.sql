-- CreateTable
CREATE TABLE "VisaApplication" (
    "uuid" TEXT NOT NULL,
    "visaCountry" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "address" TEXT,
    "nationality" TEXT NOT NULL,
    "previousVisaFromUkEuUs" BOOLEAN NOT NULL DEFAULT false,
    "previousRejectionFromUkEuUs" BOOLEAN NOT NULL DEFAULT false,
    "employmentType" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "income" INTEGER NOT NULL,
    "expenditure" INTEGER NOT NULL,
    "savings" INTEGER NOT NULL,
    "fromDate" TEXT NOT NULL,
    "toDate" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VisaApplication_pkey" PRIMARY KEY ("uuid")
);
