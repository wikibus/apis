import { HttpProblemResponse } from 'express-http-problem-details'
import { DefaultMappingStrategy, MapperRegistry } from 'http-problem-details-mapper'
import { NotFoundErrorMapper } from '../error/NotFound'
import { UnauthorizedErrorMapper } from '../error/UnauthorizedError'
import * as domainMappers from '../error/DomainErrors'

const strategy = new DefaultMappingStrategy(
  new MapperRegistry()
    .registerMapper(new NotFoundErrorMapper())
    .registerMapper(new UnauthorizedErrorMapper())
    .registerMapper(new domainMappers.DomainErrorMapper())
    .registerMapper(new domainMappers.AggregateNotFoundErrorMapper())
    .registerMapper(new domainMappers.ConcurrencyErrorMapper()))

export const httpProblemMiddleware = HttpProblemResponse({ strategy })
