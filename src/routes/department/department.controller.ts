import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { SwaggerOperation } from 'src/shared/decorators/swagger/operation.decorator';
import { SwaggerParams } from 'src/shared/decorators/swagger/params.decorator';
import { SwaggerQueries } from 'src/shared/decorators/swagger/queries.decorator';
import { SwaggerResponses } from 'src/shared/decorators/swagger/response.decorator';

import { DepartmentService } from './department.service';
import { DepartmentSwagger } from './department.swagger';
import { DepartmentCreateDto } from './dto/department-create.dto';
import { DepartmentAcronymPipe } from './pipes/department-acronym.pipe';
import { DepartmentFiltersPipe } from './pipes/department-filters.pipe';
import { DepartmentManagerIdPipe } from './pipes/department-manager-id.pipe';
import { DepartmentNameOrIdPipe } from './pipes/department-name-or-id.pipe';

@Controller('departments')
export class DepartmentController {
  private readonly toManagerID = new DepartmentManagerIdPipe().transform;
  private readonly toAcronym = new DepartmentAcronymPipe().transform;
  private readonly toNameOrID = new DepartmentNameOrIdPipe().transform;
  private readonly toFilters = new DepartmentFiltersPipe().transform;

  constructor(private readonly service: DepartmentService) {}

  @Post()
  @SwaggerOperation(DepartmentSwagger.CREATE)
  @SwaggerResponses(DepartmentSwagger.CREATE.responses)
  CREATE(@Body() dto: DepartmentCreateDto) {
    return this.service.create(dto);
  }

  @Get('manager/:manager_id')
  @SwaggerOperation(DepartmentSwagger.READ_ONE_BY_MANAGER)
  @SwaggerParams(DepartmentSwagger.READ_ONE_BY_MANAGER.params)
  @SwaggerResponses(DepartmentSwagger.READ_ONE_BY_MANAGER.responses)
  READ_ONE_BY_MANAGER(@Param('manager_id') manager_id: string) {
    return this.service.readOneByManager(this.toManagerID(manager_id));
  }

  @Get('acronym/:acronym')
  @SwaggerOperation(DepartmentSwagger.READ_ONE_BY_ACRONYM)
  @SwaggerParams(DepartmentSwagger.READ_ONE_BY_ACRONYM.params)
  @SwaggerResponses(DepartmentSwagger.READ_ONE_BY_ACRONYM.responses)
  READ_ONE_BY_ACRONYM(@Param('acronym') acronym: string) {
    return this.service.readOneByAcronym(this.toAcronym(acronym));
  }

  @Get(':identifier')
  @SwaggerOperation(DepartmentSwagger.READ_ONE)
  @SwaggerParams(DepartmentSwagger.READ_ONE.params)
  @SwaggerResponses(DepartmentSwagger.READ_ONE.responses)
  READ_ONE(@Param('identifier') identifier: string) {
    return this.service.readOne(this.toNameOrID(identifier));
  }

  @Get()
  @SwaggerOperation(DepartmentSwagger.READ_MANY)
  @SwaggerQueries(DepartmentSwagger.READ_MANY.queries, { required: false })
  @SwaggerResponses(DepartmentSwagger.READ_MANY.responses)
  READ_MANY(@Query() filters: any) {
    return this.service.readMany(this.toFilters(filters));
  }

  @Patch(':identifier')
  @SwaggerOperation(DepartmentSwagger.UPDATE)
  @SwaggerParams(DepartmentSwagger.UPDATE.params)
  @SwaggerResponses(DepartmentSwagger.UPDATE.responses)
  UPDATE(
    @Param('identifier') identifier: string,
    @Body() dto: DepartmentCreateDto,
  ) {
    return this.service.update(this.toNameOrID(identifier), dto);
  }

  @Patch(':identifier/disable')
  @SwaggerOperation(DepartmentSwagger.DISABLE)
  @SwaggerParams(DepartmentSwagger.DISABLE.params)
  @SwaggerResponses(DepartmentSwagger.DISABLE.responses)
  DISABLE(@Param('identifier') identifier: string) {
    return this.service.disable(this.toNameOrID(identifier));
  }

  @Patch(':identifier/enable')
  @SwaggerOperation(DepartmentSwagger.ENABLE)
  @SwaggerParams(DepartmentSwagger.ENABLE.params)
  @SwaggerResponses(DepartmentSwagger.ENABLE.responses)
  ENABLE(@Param('identifier') identifier: string) {
    return this.service.enable(this.toNameOrID(identifier));
  }
}
