import { Injectable, PipeTransform } from '@nestjs/common';
import { ERROR_RESPONSE } from '../common/constants';
import { ServerException } from '../exceptions';

interface FileValidationOptions {
  maxSize?: number;
  allowedTypes?: string[];
}

@Injectable()
export class FileValidationPipe implements PipeTransform {
  constructor(private readonly options: FileValidationOptions = {}) {}

  transform(file: Express.Multer.File) {
    const { maxSize, allowedTypes } = this.options;
    if (!file) {
      throw new ServerException({
        ...ERROR_RESPONSE.UNPROCESSABLE_ENTITY,
        message: 'File is required',
      });
    }

    if (maxSize && file.size > this.options.maxSize) {
      const maxSizeMB = (this.options.maxSize / 1024 / 1024).toFixed(2);
      throw new ServerException({
        ...ERROR_RESPONSE.INVALID_FILES,
        message: `The file size exceeds the maximum limit. Please upload a file smaller than ${maxSizeMB} MB`,
      });
    }

    if (allowedTypes?.length && !allowedTypes.includes(file.mimetype)) {
      throw new ServerException({
        ...ERROR_RESPONSE.INVALID_FILES,
        message: `Only ${allowedTypes.join(', ')} files are allowed`,
      });
    }

    return file;
  }
}
