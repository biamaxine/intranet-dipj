/*
  Warnings:

  - A unique constraint covering the columns `[manager_id]` on the table `Departments` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Departments_manager_id_key" ON "Departments"("manager_id");
