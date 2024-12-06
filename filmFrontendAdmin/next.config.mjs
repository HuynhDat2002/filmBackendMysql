/** @type {import('next').NextConfig} */

import fs from 'fs'
import path, {dirname} from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const nextConfig = {
    appDir: true,
    basePath: '/adminpage',
 
};

export default nextConfig;
