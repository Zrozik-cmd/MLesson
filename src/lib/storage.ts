import { writeFile, mkdir } from "fs/promises";
import path from "path";

export interface StorageProvider {
  upload(file: Buffer, filename: string): Promise<string>;
}

/**
 * Writes to /public/uploads. Fine for local/demo use; swap for the
 * Cloudinary/S3 provider below once credentials are configured — nothing
 * outside this file needs to change.
 */
class LocalStorageProvider implements StorageProvider {
  async upload(file: Buffer, filename: string): Promise<string> {
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    const safeName = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9.\-_]/g, "")}`;
    await writeFile(path.join(uploadsDir, safeName), file);

    return `/uploads/${safeName}`;
  }
}

// TODO: add a CloudinaryStorageProvider / S3StorageProvider here and select
// it based on CLOUDINARY_* / AWS_* env vars once cloud storage is wired up.
export const storage: StorageProvider = new LocalStorageProvider();
