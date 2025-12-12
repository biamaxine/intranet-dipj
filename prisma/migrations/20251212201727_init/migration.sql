-- Habilita a extensão
CREATE EXTENSION IF NOT EXISTS unaccent;

-- Configuração de busca personalizada 'pt_unaccent'
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_ts_config WHERE cfgname = 'pt_unaccent'
    ) THEN
        CREATE TEXT SEARCH CONFIGURATION pt_unaccent ( COPY = portuguese );

        ALTER TEXT SEARCH CONFIGURATION pt_unaccent
            ALTER MAPPING FOR hword, hword_part, word
            WITH unaccent, portuguese_stem;
    END IF;
END
$$;

-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('PENDING', 'OPENED', 'WAITING', 'COMPLETED');

-- CreateTable
CREATE TABLE "Departments" (
    "id" UUID NOT NULL,
    "manager_id" UUID,
    "name" VARCHAR(60) NOT NULL,
    "acronym" VARCHAR(30) NOT NULL,
    "description" VARCHAR(500),
    "email" VARCHAR(255),
    "phone" VARCHAR(11),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Users" (
    "id" UUID NOT NULL,
    "department_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "cpf" CHAR(11) NOT NULL,
    "email" VARCHAR(255),
    "phone" VARCHAR(11),
    "password" VARCHAR(60) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "is_manager" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Programs" (
    "id" UUID NOT NULL,
    "name" VARCHAR(60) NOT NULL,
    "link" TEXT NOT NULL,
    "description" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Programs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DepartmentProgramRelations" (
    "department_id" UUID NOT NULL,
    "program_id" UUID NOT NULL,

    CONSTRAINT "DepartmentProgramRelations_pkey" PRIMARY KEY ("department_id","program_id")
);

-- CreateTable
CREATE TABLE "UserProgramsRelations" (
    "user_id" UUID NOT NULL,
    "program_id" UUID NOT NULL,

    CONSTRAINT "UserProgramsRelations_pkey" PRIMARY KEY ("user_id","program_id")
);

-- CreateTable
CREATE TABLE "Documents" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "content_id" UUID,
    "category_id" UUID NOT NULL,
    "parent_id" UUID,
    "origin" VARCHAR(122) NOT NULL,
    "state" CHAR(2) NOT NULL,
    "city" VARCHAR(122) NOT NULL,
    "code" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "storage_key" UUID NOT NULL,
    "hash" VARCHAR(64) NOT NULL,
    "status" "DocumentStatus" NOT NULL DEFAULT 'PENDING',
    "deadline" TIMESTAMP(3),
    "search_vector" tsvector,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentContents" (
    "id" UUID NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "DocumentContents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentCategories" (
    "id" UUID NOT NULL,
    "name" VARCHAR(122) NOT NULL,
    "acronym" VARCHAR(16) NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "need_content" BOOLEAN NOT NULL,
    "need_parent" BOOLEAN DEFAULT false,

    CONSTRAINT "DocumentCategories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentHistoryRelations" (
    "user_id" UUID NOT NULL,
    "document_id" UUID NOT NULL,
    "registers" TIMESTAMP(3)[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DocumentHistoryRelations_pkey" PRIMARY KEY ("user_id","document_id")
);

-- CreateTable
CREATE TABLE "DocumentKeywords" (
    "id" UUID NOT NULL,
    "tag_id" UUID NOT NULL,
    "key" VARCHAR(60) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DocumentKeywords_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentKeywordRelations" (
    "document_id" UUID NOT NULL,
    "keyword_id" UUID NOT NULL,
    "ocurrences" INTEGER NOT NULL,

    CONSTRAINT "DocumentKeywordRelations_pkey" PRIMARY KEY ("document_id","keyword_id")
);

-- CreateTable
CREATE TABLE "KeywordTags" (
    "id" UUID NOT NULL,
    "name" VARCHAR(60) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KeywordTags_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Departments_name_key" ON "Departments"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Departments_acronym_key" ON "Departments"("acronym");

-- CreateIndex
CREATE UNIQUE INDEX "Users_cpf_key" ON "Users"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Users_phone_key" ON "Users"("phone");

-- CreateIndex
CREATE INDEX "Users_name_is_active_idx" ON "Users"("name", "is_active");

-- CreateIndex
CREATE UNIQUE INDEX "Programs_name_key" ON "Programs"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Documents_content_id_key" ON "Documents"("content_id");

-- CreateIndex
CREATE UNIQUE INDEX "Documents_storage_key_key" ON "Documents"("storage_key");

-- CreateIndex
CREATE UNIQUE INDEX "Documents_hash_key" ON "Documents"("hash");

-- CreateIndex
CREATE INDEX "Documents_state_city_origin_idx" ON "Documents"("state", "city", "origin");

-- CreateIndex
CREATE INDEX "Documents_status_idx" ON "Documents"("status");

-- CreateIndex
CREATE INDEX "Documents_search_vector_idx" ON "Documents" USING GIN ("search_vector");

-- CreateIndex
CREATE UNIQUE INDEX "Documents_category_id_code_year_origin_state_city_key" ON "Documents"("category_id", "code", "year", "origin", "state", "city");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentCategories_name_key" ON "DocumentCategories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentCategories_acronym_key" ON "DocumentCategories"("acronym");

-- CreateIndex
CREATE INDEX "DocumentKeywords_key_idx" ON "DocumentKeywords"("key");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentKeywords_key_tag_id_key" ON "DocumentKeywords"("key", "tag_id");

-- CreateIndex
CREATE UNIQUE INDEX "KeywordTags_name_key" ON "KeywordTags"("name");

-- AddForeignKey
ALTER TABLE "Departments" ADD CONSTRAINT "Departments_manager_id_fkey" FOREIGN KEY ("manager_id") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "Departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DepartmentProgramRelations" ADD CONSTRAINT "DepartmentProgramRelations_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "Departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DepartmentProgramRelations" ADD CONSTRAINT "DepartmentProgramRelations_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "Programs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProgramsRelations" ADD CONSTRAINT "UserProgramsRelations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProgramsRelations" ADD CONSTRAINT "UserProgramsRelations_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "Programs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Documents" ADD CONSTRAINT "Documents_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Documents" ADD CONSTRAINT "Documents_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "DocumentContents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Documents" ADD CONSTRAINT "Documents_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "DocumentCategories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Documents" ADD CONSTRAINT "Documents_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "Documents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentHistoryRelations" ADD CONSTRAINT "DocumentHistoryRelations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentHistoryRelations" ADD CONSTRAINT "DocumentHistoryRelations_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "Documents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentKeywords" ADD CONSTRAINT "DocumentKeywords_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "KeywordTags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentKeywordRelations" ADD CONSTRAINT "DocumentKeywordRelations_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "Documents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentKeywordRelations" ADD CONSTRAINT "DocumentKeywordRelations_keyword_id_fkey" FOREIGN KEY ("keyword_id") REFERENCES "DocumentKeywords"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- LÓGICA DE FULL-TEXT SEARCH OTIMIZADA

-- 1. Função que gera o vetor (Agora com verificação condicional)
CREATE OR REPLACE FUNCTION document_generate_search_vector()
RETURNS trigger AS $$
DECLARE
  doc_content text;
BEGIN
  -- OTIMIZAÇÃO:
  -- Se for um UPDATE, verificamos se é necessário recalcular.
  -- Se o content_id não mudou E o search_vector já existe (não é NULL),
  -- então assumimos que é uma atualização de metadados (status, deadline, etc)
  -- e pulamos o processamento pesado.
  IF (TG_OP = 'UPDATE') THEN
    IF (NEW.content_id = OLD.content_id AND NEW.search_vector IS NOT NULL) THEN
        RETURN NEW;
    END IF;
  END IF;

  -- Se chegou aqui, é um INSERT novo, ou mudou o content_id, ou o vetor foi forçado a NULL.

  -- Busca o texto na tabela DocumentContents
  SELECT content INTO doc_content
  FROM "DocumentContents"
  WHERE id = NEW.content_id;

  -- Constrói o vetor
  NEW.search_vector := to_tsvector('pt_unaccent', COALESCE(doc_content, ''));

  RETURN NEW;
END
$$ LANGUAGE plpgsql;

-- 2. Gatilho na tabela Documents
CREATE TRIGGER tsvectorupdate
BEFORE INSERT OR UPDATE ON "Documents"
FOR EACH ROW EXECUTE PROCEDURE document_generate_search_vector();

-- 3. Função de Propagação (Agora "suja" o vetor)
CREATE OR REPLACE FUNCTION propagate_content_update()
RETURNS trigger AS $$
BEGIN
  -- Ao invés de só atualizar o updated_at, nós setamos o search_vector para NULL.
  -- Isso força a condição "NEW.search_vector IS NOT NULL" na função principal a ser FALSA,
  -- obrigando o PostgreSQL a recalcular o vetor para este documento.
  UPDATE "Documents"
  SET
    "updated_at" = NOW(),
    "search_vector" = NULL
  WHERE "content_id" = NEW.id;

  RETURN NEW;
END
$$ LANGUAGE plpgsql;

-- 4. Gatilho na tabela de CONTEÚDO
CREATE TRIGGER content_update_propagation
AFTER UPDATE ON "DocumentContents"
FOR EACH ROW EXECUTE PROCEDURE propagate_content_update();
