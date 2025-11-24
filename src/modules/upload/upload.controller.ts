import { AccessControl, SwaggerApiDocument } from 'src/common';
import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UploadPresignBodyDto, UploadPresignResponseDto } from 'src/modules/upload/dto';
import { UploadService } from './upload.service';

@Controller('upload')
@ApiTags('Upload')
@ApiBearerAuth()
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('presign')
  @SwaggerApiDocument({
    response: {
      status: HttpStatus.OK,
      type: UploadPresignResponseDto,
    },
    body: { type: UploadPresignBodyDto, required: true },
    operation: {
      operationId: 'generateUploadUrl',
      summary: 'Api generateUploadUrl',
      description: 'Generate presigned URL for file upload to S3',
    },
  })
  generateUploadUrl(
    @Body() body: UploadPresignBodyDto,
  ): Promise<UploadPresignResponseDto> {
    return this.uploadService.generateUploadUrl(body);
  }
}
