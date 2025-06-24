import { BadRequestException } from '@nestjs/common';
import { Request } from 'express';

export const generatedFileName = (
  req: Request,
  file: any,
  callback: (error: Error | null, filename: string) => void,
) => {
  const timestamp = new Date().toISOString(); // Get the current timestamp in ISO format
  const fileExtension = file.mimetype.split('/')[1]; // Extract the file extension from mimetype
  const newFileName = `${timestamp}.${fileExtension}`; // Generate a new filename based on timestamp

  callback(null, newFileName);
};

export const docFileFilter = (
  req: Request,
  file: any,
  callback: (error, valid: boolean) => void,
) => {
  if (!file.originalname || !file.originalname.match(/\.(doc|docx|pdf)$/)) {
    return callback(
      new BadRequestException('File must be of type : doc,docx or pdf'),
      false,
    );
  }
  callback(null, true);
};
