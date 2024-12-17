/** @type {import('next').NextConfig} */

import fs from 'fs'
import path, {dirname} from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const nextConfig = {
    basePath: '/adminpage',
    images: {
    domains: [], // Nếu dùng hình ảnh từ domain ngoài, liệt kê domain ở đây
    unoptimized: true, // Tắt tối ưu hóa nếu không cần thiết
  },
 
};

export default nextConfig;
