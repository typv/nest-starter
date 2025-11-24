import { applyDecorators, HttpStatus, Type } from '@nestjs/common';
import {
  ApiBody,
  ApiBodyOptions,
  ApiExtraModels,
  ApiConsumes as ApiFileConsumes,
  ApiOperation,
  ApiParam,
  ApiParamOptions,
  ApiQuery,
  ApiQueryOptions,
  ApiResponse,
  ApiTags,
  getSchemaPath,
  ApiOperationOptions as SwaggerApiOperationOptions,
  ApiResponseOptions as SwaggerApiResponseOptions,
} from '@nestjs/swagger';
import { HttpErrorResponseDto, PaginationResponseDto } from '../dto';
import { BodyContentType } from '../enums';

type ApiResponseOptions = SwaggerApiResponseOptions & {
  isPagination?: boolean;
  status?: HttpStatus;
};

type ApiOperationOptions = SwaggerApiOperationOptions & {
  summary: string;
  operationId: string;
};

type ApiDocumentExtraOption = {
  isPublic?: true;
};

type ApiDocumentOption = {
  operation: ApiOperationOptions;
  contentType?: BodyContentType[];
  body?: ApiBodyOptions;
  response: ApiResponseOptions | ApiResponseOptions[];
  query?: ApiQueryOptions | ApiQueryOptions[];
  param?: ApiParamOptions | ApiParamOptions[];
  extra?: ApiDocumentExtraOption;
  tags?: string[];
};

/**
 * The `SwaggerApiDocument` function is a decorator factory that generates a set of decorators for a Swagger API document.
 * It takes an `ApiDocumentOption` object as an argument and returns a function that applies the decorators to the target.
 * This function is used to simplify the process of defining API documentation for a route handler in a NestJS application.
 * It allows you to define the operation, response, parameters, query parameters, body, file types, and tags for the API in a single place.
 * This makes the code more readable and maintainable, as all the API documentation for a route handler is defined together.
 *
 * @decorators
 *  - ApiResponse
 *  - ApiBody
 *  - ApiQuery
 *  - ApiParam
 *  - ApiOperation
 **/
function SwaggerApiDocument(options: ApiDocumentOption) {
  const {
    response: responseOptions,
    operation,
    param,
    query,
    body,
    extra,
    tags,
    contentType,
  } = options;

  const decorators: (MethodDecorator | ClassDecorator)[] = [
    ApiOperation(operation),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Oops, something went wrong',
      type: HttpErrorResponseDto,
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Bad Request',
    }),
    ApiResponse({
      status: HttpStatus.UNPROCESSABLE_ENTITY,
      description: 'Validate request payload error',
    }),
  ];

  if (!extra?.isPublic) {
    decorators.push(
      ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized',
      }),
    );
  }

  if (contentType?.length) {
    decorators.push(ApiFileConsumes(...contentType));
  }

  if (tags?.length) {
    decorators.push(ApiTags(...tags));
  }

  // body
  if (body) {
    decorators.push(ApiBody(body));
  }

  // response
  if (Array.isArray(responseOptions)) {
    // if (responseOptions.some((option) => option?.isPagination)) {
    //   defineRequestPaginationQuery(decorators);
    // }
    responseOptions.forEach((option) => addApiResponse(option, decorators));
  } else {
    // if (responseOptions?.isPagination) {
    //   defineRequestPaginationQuery(decorators);
    // }
    addApiResponse(responseOptions, decorators);
  }

  // query
  if (query && Array.isArray(query)) {
    decorators.push(...query.map((opt) => ApiQuery(opt)));
  } else if (query) {
    decorators.push(ApiQuery(query as ApiQueryOptions));
  }

  // param
  if (param && Array.isArray(param)) {
    decorators.push(...param.map((opt) => ApiParam(opt)));
  } else if (param) {
    decorators.push(ApiParam(param as ApiParamOptions));
  }

  return applyDecorators(...decorators);
}

function defineRequestPaginationQuery(decorators: (MethodDecorator | ClassDecorator)[]) {
  decorators.push(
    ApiQuery({ name: 'page', type: Number, required: false, example: 1 }),
    ApiQuery({ name: 'pageSize', type: Number, required: false, example: 10 }),
  );
}

export const ResponsePaginated = <Model extends Type<unknown>>(
  model: Model,
  { status, description }: ApiResponseOptions,
) =>
  applyDecorators(
    ApiExtraModels(PaginationResponseDto, model),
    ApiResponse({
      status,
      description,
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginationResponseDto) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    }),
  );

function addApiResponse(
  option: ApiResponseOptions,
  decorators: (MethodDecorator | ClassDecorator)[],
) {
  if (option?.isPagination) {
    decorators.push(ResponsePaginated(option['type'], option));
  } else {
    decorators.push(ApiResponse(option));
  }
}

export { SwaggerApiDocument };
