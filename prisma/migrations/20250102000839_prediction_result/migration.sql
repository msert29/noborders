-- CreateTable
CREATE TABLE "PredictionResult" (
    "uuid" TEXT NOT NULL,
    "analysis" TEXT NOT NULL,
    "issues" TEXT NOT NULL,
    "suggestion" TEXT NOT NULL,
    "completeness" TEXT NOT NULL,
    "decision" TEXT NOT NULL,

    CONSTRAINT "PredictionResult_pkey" PRIMARY KEY ("uuid")
);
