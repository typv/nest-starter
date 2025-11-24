import { s3Configuration } from 'src/config';
import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class AwsS3Service {
  private readonly s3Client: S3Client;
  private readonly bucket: string;
  private readonly region: string;
  private readonly s3Url: string;

  constructor(
    @Inject(s3Configuration.KEY)
    private readonly s3Config: ConfigType<typeof s3Configuration>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    this.bucket = this.s3Config.awsS3BucketName;
    this.region = this.s3Config.awsS3Region;
    this.s3Url = this.s3Config.awsS3Url;

    this.s3Client = new S3Client({
      region: this.region,
      endpoint: this.s3Url,
      forcePathStyle: true,
      credentials: {
        accessKeyId: this.s3Config.awsS3AccessKeyId,
        secretAccessKey: this.s3Config.awsS3SecretAccessKey,
      },
    });
  }

  async getPresignedUploadUrl(
    fileName: string,
    contentType: string,
    bucketFolder?: string,
  ): Promise<{ uploadUrl: string; fileUrl: string }> {
    const fileKey = bucketFolder
      ? `${bucketFolder.replace(/^\/|\/$/g, '')}/${fileName}`
      : fileName;

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: fileKey,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: 900, // 15 minutes
    });

    const baseUrl = this.s3Url.replace(/\/+$/, '');
    const fileUrl = `${baseUrl}/${this.bucket}/${encodeURI(fileKey)}`;

    return { uploadUrl, fileUrl };
  }

  async getPresignedDownloadUrl(
    fileKey: string,
    expiresInSeconds: number = 300,
  ): Promise<{ presignURL: string; expiresInSeconds: number }> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: fileKey,
      });
      const downloadUrl = await getSignedUrl(this.s3Client, command, {
        expiresIn: expiresInSeconds,
      });

      return {
        presignURL: downloadUrl,
        expiresInSeconds,
      };
    } catch (error) {
      this.logger.error(
        `getPresignedDownloadUrl: Error generating pre-signed download URL for ${fileKey}:`,
        error,
      );
      return null;
    }
  }

  async uploadFile(
    fileName: string,
    contentType: string,
    body: Buffer,
    bucketFolder?: string,
  ): Promise<{ fileKey: string }> {
    const fileKey = bucketFolder ? `${bucketFolder}/${fileName}` : `${fileName}`;

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: fileKey,
      Body: body,
      ContentType: contentType,
    });
    await this.s3Client.send(command);

    return { fileKey };
  }
}
