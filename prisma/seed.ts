import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();
async function main() {
 const passwordHash = await bcrypt.hash('Demo@123', 12);
 const user = await prisma.user.upsert({ where:{email:'member@epfo.demo'}, update:{}, create:{email:'member@epfo.demo',passwordHash,fullName:'Rahul Sharma',uan:'1011 2345 6789',memberId:'MH/BAN/2345678/90',mobile:'+91 98765 43210'} });
 await prisma.contribution.deleteMany({where:{userId:user.id}}); await prisma.claim.deleteMany({where:{userId:user.id}}); await prisma.nominee.deleteMany({where:{userId:user.id}});
 const months = [4,3,2,1,0];
 await prisma.contribution.createMany({data:months.map((offset,i)=>({userId:user.id,month:new Date(2026,offset,1),employeeShare:3000,employerShare:3000,pensionShare:500,status:'Credited'}))});
 await prisma.claim.createMany({data:[{userId:user.id,claimNumber:'CLM1234567890',type:'PF Withdrawal',amount:15000,status:'Under Process'},{userId:user.id,claimNumber:'CLM0987654321',type:'PF Advance',amount:20000,status:'Settled'}]});
 await prisma.nominee.create({data:{userId:user.id,name:'Ramesh Chandra Sharma',relationship:'Father',dob:new Date('1970-05-14'),share:100}});
}
main().finally(()=>prisma.$disconnect());
