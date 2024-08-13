import { Controller, Get, Post, Put, Delete, Param, UploadedFile, UseInterceptors, Body, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';
import { HttpException, HttpStatus } from '@nestjs/common';
@Controller('upload')
export class UploadController {
  private fileInfoPath = path.join(process.cwd(), 'fileInfo.json');

  @Post()
@UseInterceptors(FileInterceptor('image'))
uploadFile(
  @UploadedFile() file: Express.Multer.File,
  @Body('title') title: string,
  @Body('description') description: string,
  @Body('creatorLink') creatorLink: string,
) {
  const fileInfo = {
    id: Date.now().toString(), // Ensure this ID is generated
    filename: file.filename,
    title,
    description,
    creatorLink,
  };
  this.saveFileInfo(fileInfo);
  console.log('File info saved:', fileInfo);
  return { message: 'File uploaded successfully', fileInfo };
}
@Get('images')
getImages(@Res() res: Response) {
  if (!fs.existsSync(this.fileInfoPath)) {
    return res.json([]);
  }
  let fileInfo = JSON.parse(fs.readFileSync(this.fileInfoPath, 'utf8'));
  
  // Add IDs to existing entries if they're missing
  fileInfo = fileInfo.map((info, index) => {
    if (!info.id) {
      info.id = `legacy-${index}-${Date.now()}`;
    }
    return info;
  });

  // Save the updated fileInfo with IDs
  this.saveAllFileInfo(fileInfo);

  res.json(fileInfo);
}

  @Put('images/:id')
updateImage(@Param('id') id: string, @Body() updateData: any) {
  console.log('Updating image with ID:', id); // Add this log
  let fileInfo = this.getFileInfo();
  console.log('Current file info:', fileInfo); // Add this log
  const index = fileInfo.findIndex(info => info.id === id);
  if (index !== -1) {
    fileInfo[index] = { ...fileInfo[index], ...updateData };
    this.saveAllFileInfo(fileInfo);
    console.log('Image updated successfully:', fileInfo[index]); // Add this log
    return { message: 'Image updated successfully', fileInfo: fileInfo[index] };
  }
  console.log('Image not found for update'); // Add this log
  return { message: 'Image not found' };
}

@Delete('images/:id')
deleteImage(@Param('id') id: string) {
  console.log('Deleting image with ID:', id); // Add this log
  let fileInfo = this.getFileInfo();
  console.log('Current file info:', fileInfo); // Add this log
  const index = fileInfo.findIndex(info => info.id === id);
  if (index !== -1) {
    const deletedInfo = fileInfo.splice(index, 1)[0];
    this.saveAllFileInfo(fileInfo);
    // Delete the actual file
    const filePath = path.join(process.cwd(), 'uploads', deletedInfo.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log('File deleted successfully:', filePath); // Add this log
    } else {
      console.log('File not found:', filePath); // Add this log
    }
    return { message: 'Image deleted successfully' };
  }
  console.log('Image not found for deletion'); // Add this log
  return { message: 'Image not found' };
}

  private getFileInfo(): any[] {
    if (fs.existsSync(this.fileInfoPath)) {
      return JSON.parse(fs.readFileSync(this.fileInfoPath, 'utf8'));
    }
    return [];
  }

  private saveFileInfo(fileInfo: any) {
    let existingInfo = this.getFileInfo();
    existingInfo.push(fileInfo);
    this.saveAllFileInfo(existingInfo);
  }

  private saveAllFileInfo(fileInfo: any[]) {
    fs.writeFileSync(this.fileInfoPath, JSON.stringify(fileInfo, null, 2));
  }
}