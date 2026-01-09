import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { SwaggerApi } from 'src/shared/decorators/swagger/api.decorator';

import { DepartmentService } from './department.service';
import { DepartmentSwagger } from './department.swagger';
import { DepartmentCreateDto } from './dto/department-create.dto';
import { DepartmentAcronymPipe } from './pipes/department-acronym.pipe';
import { DepartmentFiltersPipe } from './pipes/department-filters.pipe';
import { DepartmentManagerIdPipe } from './pipes/department-manager-id.pipe';
import { DepartmentNameOrIdPipe } from './pipes/department-name-or-id.pipe';
import { JwtAuth } from '../user/decorators/jwt-auth.decorator';

@JwtAuth({ management: true })
@Controller('departments')
export class DepartmentController {
  private readonly toManagerID = new DepartmentManagerIdPipe().transform;
  private readonly toAcronym = new DepartmentAcronymPipe().transform;
  private readonly toNameOrID = new DepartmentNameOrIdPipe().transform;
  private readonly toFilters = new DepartmentFiltersPipe().transform;

  constructor(private readonly service: DepartmentService) {}

  @Post()
  @SwaggerApi(DepartmentSwagger.CREATE)
  CREATE(@Body() dto: DepartmentCreateDto) {
    return this.service.create(dto);
  }

  @Get('manager/:manager_id')
  @SwaggerApi(DepartmentSwagger.READ_ONE_BY_MANAGER)
  READ_ONE_BY_MANAGER(@Param('manager_id') manager_id: string) {
    return this.service.readOneByManager(this.toManagerID(manager_id));
  }

  @Get('acronym/:acronym')
  @SwaggerApi(DepartmentSwagger.READ_ONE_BY_ACRONYM)
  READ_ONE_BY_ACRONYM(@Param('acronym') acronym: string) {
    return this.service.readOneByAcronym(this.toAcronym(acronym));
  }

  @Get(':identifier')
  @SwaggerApi(DepartmentSwagger.READ_ONE)
  READ_ONE(@Param('identifier') identifier: string) {
    return this.service.readOne(this.toNameOrID(identifier));
  }

  @Get()
  @SwaggerApi(DepartmentSwagger.READ_MANY, { query: { required: false } })
  READ_MANY(@Query() filters: any) {
    return this.service.readMany(this.toFilters(filters));
  }

  @Patch(':identifier')
  @SwaggerApi(DepartmentSwagger.UPDATE)
  UPDATE(
    @Param('identifier') identifier: string,
    @Body() dto: DepartmentCreateDto,
  ) {
    return this.service.update(this.toNameOrID(identifier), dto);
  }

  @Patch(':identifier/disable')
  @SwaggerApi(DepartmentSwagger.DISABLE)
  DISABLE(@Param('identifier') identifier: string) {
    return this.service.disable(this.toNameOrID(identifier));
  }

  @Patch(':identifier/enable')
  @SwaggerApi(DepartmentSwagger.ENABLE)
  ENABLE(@Param('identifier') identifier: string) {
    return this.service.enable(this.toNameOrID(identifier));
  }
}
