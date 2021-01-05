import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AWSError } from 'aws-sdk';
import S3 from 'aws-sdk/clients/s3';
import { PromiseResult } from 'aws-sdk/lib/request';
import * as fs from 'fs';

import { isProductionMode } from '../common/common.helper';
import { AwsError } from './aws.resource';

@Injectable()
export class AwsService {
  private readonly s3?: S3;
  private readonly bucketName?: string;

  constructor() {
    if (isProductionMode()) {
      this.s3 = new S3({
        region: process.env.AWS_REGION,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
      });
      this.bucketName = process.env.AWS_BUCKET_NAME;
    }
  }

  public async uploadFileToS3(filePath: string, file: fs.ReadStream): Promise<void> {
    if (!this.s3 || !this.bucketName) {
      return;
    }

    try {
      await this.s3
        .upload({
          Bucket: this.bucketName,
          Key: filePath,
          Body: file
        })
        .promise();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  public async downloadFilesFromS3(folderPath: string): Promise<void[]> {
    if (!this.s3 || !this.bucketName) {
      return [];
    }

    try {
      const getListObjectsPromise = await this.getListObjectsFromS3(folderPath);
      const { Contents } = await getListObjectsPromise;
      if (!Contents) {
        return [];
      }

      const promise: Promise<void>[] = [];
      for (const { Key } of Contents) {
        if (!Key) {
          continue;
        }

        promise.push(this.downloadFileFromS3(`./${Key}`));
      }

      return Promise.all(promise);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  private getListObjectsFromS3(
    folderPath: string
  ): Promise<PromiseResult<S3.ListObjectsOutput, AWSError>> {
    if (!this.s3 || !this.bucketName) {
      return Promise.reject(new InternalServerErrorException(AwsError.ERR_1));
    }

    const prefix = folderPath.replace(/^\.\//, '').concat('/');
    return this.s3
      .listObjects({ Bucket: this.bucketName, Prefix: prefix, Delimiter: '/' })
      .promise();
  }

  public async deleteObjectOnS3(filePath: string): Promise<void> {
    if (!this.s3 || !this.bucketName) {
      return;
    }

    try {
      await this.s3
        .deleteObject({ Bucket: this.bucketName, Key: filePath.replace(/^\.\//, '') })
        .promise();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  public async downloadFileFromS3(filePath: string): Promise<void> {
    const Key = this.removePrefix(filePath);
    const file = fs.createWriteStream(filePath);

    return new Promise<void>((resolve) => {
      this.s3!.getObject({ Bucket: this.bucketName!, Key })
        .createReadStream()
        .on('end', () => {
          return resolve();
        })
        .on('error', (error) => {
          throw new InternalServerErrorException(error);
        })
        .pipe(file);
    });
  }

  public async isFileExist(filePath: string): Promise<boolean> {
    try {
      const Key = this.removePrefix(filePath);
      await this.s3!.getObject({ Bucket: this.bucketName!, Key }).promise();
      return true;
    } catch (error) {
      return false;
    }
  }

  private removePrefix(filePath: string): string {
    let returnValue = filePath;
    const REMOVE_PREFIX_REGEX = new RegExp(/^.\//g);
    if (REMOVE_PREFIX_REGEX.test(filePath)) {
      returnValue = returnValue.replace(REMOVE_PREFIX_REGEX, '');
    }

    return returnValue;
  }
}
