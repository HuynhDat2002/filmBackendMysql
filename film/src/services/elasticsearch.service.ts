// 'use strict'

// // import các thư viện cần thiết
// import { PrismaClient } from '@prisma/client';
// // elasticsearchClient.ts
// import { Client } from '@elastic/elasticsearch';

// export const elasticsearchClient = new Client({
//   node: 'http://localhost:9200',  // Địa chỉ của Elasticsearch
// });
// const prisma = new PrismaClient();

// async function syncDataToElasticsearch() {
//   try {
//     // Lấy dữ liệu từ Prisma (MySQL)
//     const movies = await prisma.movie.findMany();
//     const actor = await prisma.actor.findMany({
//         where:{
//             movie:{
//                 connect:
//             }    
//         }
// })

//     // Đẩy từng movie vào Elasticsearch
//     for (const movie of movies) {
//       await elasticsearchClient.index({
//         index: 'movies',  // Tên index trong Elasticsearch
//         id: movie.id.toString(),  // Dùng id của movie làm document ID
//         body: {
//           name: movie.name,
//           origin_name: movie.origin_name,
//           year: movie.year,
//           // Các trường khác bạn muốn đẩy vào Elasticsearch
//         },
//       });
//     }

//     console.log('Dữ liệu đã được đồng bộ hóa với Elasticsearch');
//   } catch (error) {
//     console.error('Có lỗi xảy ra khi đồng bộ hóa dữ liệu:', error);
//   }
// }

// // Gọi hàm syncDataToElasticsearch để bắt đầu đồng bộ
// syncDataToElasticsearch();