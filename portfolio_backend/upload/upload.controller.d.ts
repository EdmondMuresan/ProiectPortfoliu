import { Response } from 'express';
export declare class UploadController {
    uploadFile(file: Express.Multer.File): void;
    getImages(res: Response): void;
}
