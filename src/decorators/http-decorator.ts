import {
  Param,
  ParseUUIDPipe,
  PipeTransform,
  Type,
  UseGuards,
  applyDecorators,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';

export function Auth() {
  return applyDecorators(
    UseGuards(AuthGuard('jwt')),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}
export function UUIDParam(
  property: string,
  ...pipes: (Type<PipeTransform> | PipeTransform)[]
) {
  return Param(property, new ParseUUIDPipe(), ...pipes);
}
