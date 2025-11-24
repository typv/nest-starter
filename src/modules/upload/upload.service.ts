import { ERROR_RESPONSE } from 'src/common';
import { ServerException } from 'src/common';
import { AwsS3Service } from 'src/integrations';
import { Inject, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { UploadPresignBodyDto, UploadPresignResponseDto } from './dto';

@Injectable()
export class UploadService {
  constructor(
    private readonly awsS3Service: AwsS3Service,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async generateUploadUrl(body: UploadPresignBodyDto) {
    const { fileName, uploadPath: bucketFolder, contentType } = body;

    try {
      const urls = await this.awsS3Service.getPresignedUploadUrl(
        fileName,
        contentType,
        bucketFolder,
      );

      return plainToInstance(UploadPresignResponseDto, urls, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      this.logger.error({
        message: 'UploadService.generateUploadUrl: Failed to generate upload URL',
        context: 'UploadService.generateUploadUrl',
        error: error,
      });

      throw new ServerException({
        ...ERROR_RESPONSE.BAD_REQUEST,
        message: 'Failed to generate upload URL',
      });
    }
  }
}
