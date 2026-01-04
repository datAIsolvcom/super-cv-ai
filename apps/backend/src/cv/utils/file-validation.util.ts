import { BadRequestException } from '@nestjs/common';
import * as crypto from 'crypto';
import * as path from 'path';

/**
 * File magic number signatures for CV formats
 * @see https://en.wikipedia.org/wiki/List_of_file_signatures
 */
const MAGIC_NUMBERS: Record<string, { bytes: number[]; offset: number }> = {

    'application/pdf': { bytes: [0x25, 0x50, 0x44, 0x46], offset: 0 },

    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
        bytes: [0x50, 0x4b, 0x03, 0x04],
        offset: 0,
    },

    'application/msword': {
        bytes: [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1],
        offset: 0,
    },

    'application/rtf': { bytes: [0x7b, 0x5c, 0x72, 0x74, 0x66], offset: 0 },
};

const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.doc', '.rtf'];
const MAX_FILENAME_LENGTH = 100;
const DANGEROUS_CHARS_REGEX = /[<>:"/\\|?*\x00-\x1f]/g;


export function validateFileMagicNumber(
    buffer: Buffer,
    mimeType: string,
): boolean {
    const signature = MAGIC_NUMBERS[mimeType];
    if (!signature) {

        return true;
    }

    const fileBytes = buffer.slice(
        signature.offset,
        signature.offset + signature.bytes.length,
    );

    return signature.bytes.every((byte, index) => fileBytes[index] === byte);
}


export function sanitizeFilename(originalName: string): string {

    const ext = path.extname(originalName).toLowerCase();


    if (!ALLOWED_EXTENSIONS.includes(ext)) {
        throw new BadRequestException(
            `Invalid file type. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}`,
        );
    }


    let baseName = path.basename(originalName, ext);


    baseName = baseName.replace(DANGEROUS_CHARS_REGEX, '_');


    baseName = baseName.replace(/^[\s.]+|[\s.]+$/g, '');


    if (baseName.length > MAX_FILENAME_LENGTH - 20) {
        baseName = baseName.slice(0, MAX_FILENAME_LENGTH - 20);
    }


    if (!baseName) {
        baseName = 'cv_file';
    }

    return `${baseName}${ext}`;
}


export function generateFileHash(buffer: Buffer): string {
    return crypto.createHash('sha256').update(buffer).digest('hex');
}


export function validateUploadedFile(file: Express.Multer.File): {
    sanitizedName: string;
    hash: string;
    isValid: boolean;
} {

    if (!file || !file.buffer) {
        throw new BadRequestException('No file provided');
    }


    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
        throw new BadRequestException('File size exceeds 10MB limit');
    }


    if (!validateFileMagicNumber(file.buffer, file.mimetype)) {
        throw new BadRequestException(
            'File content does not match declared type. Possible file spoofing detected.',
        );
    }


    const sanitizedName = sanitizeFilename(file.originalname);


    const hash = generateFileHash(file.buffer);

    return {
        sanitizedName,
        hash,
        isValid: true,
    };
}


export async function checkDuplicateFile(
    hash: string,
    prisma: any,
): Promise<string | null> {
    const existing = await prisma.cV.findFirst({
        where: { fileHash: hash },
        select: { id: true },
    });

    return existing?.id || null;
}
