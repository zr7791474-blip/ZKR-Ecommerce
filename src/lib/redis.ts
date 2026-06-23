import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL;

let redis: Redis | null = null;

if (redisUrl) {
  redis = new Redis(redisUrl, {
    maxRetriesPerRequest: 0,
    lazyConnect: true,
    enableReadyCheck: false,
    connectTimeout: 1000,
  });

  redis.on("error", () => {
    // ignore redis errors
  });
}


// ======================
// GET CACHE
// ======================

export async function cacheGet<T>(
  key:string
):Promise<T|null>{

  if(!redis) return null;

  try{

    const data = await redis.get(key);

    if(!data) return null;

    return JSON.parse(data);

  }catch{
    return null;
  }
}



// ======================
// SET CACHE
// ======================

export async function cacheSet<T>(
 key:string,
 value:T,
 ttlSeconds=3600
){

 if(!redis) return;

 try{

 await redis.setex(
   key,
   ttlSeconds,
   JSON.stringify(value)
 );

 }catch{}

}



// ======================
// DELETE CACHE
// ======================

export async function cacheDel(
 key:string
){

 if(!redis) return;

 try{
  await redis.del(key);
 }catch{}

}



// ======================
// COUNTER
// ======================

export async function cacheIncr(
 key:string,
 ttlSeconds=60
){

 if(!redis) return 0;


 try{

 const result = await redis.multi()
 .incr(key)
 .expire(key,ttlSeconds)
 .exec();


 return Number(result?.[0]?.[1] ?? 0);


 }catch{

 return 0;

 }

}



// ======================
// RATE LIMIT
// ======================

export async function rateLimit(
 identifier:string,
 limit=100,
 windowSeconds=60
){

 if(!redis){

 return {
 success:true,
 remaining:limit,
 reset:Date.now()/1000+windowSeconds
 }

 }


 const key=`ratelimit:${identifier}`;

 try{

 const count=await redis.incr(key);


 if(count===1){
   await redis.expire(key,windowSeconds);
 }


 return {

 success:count<=limit,

 remaining:Math.max(
 0,
 limit-count
 ),

 reset:
 Date.now()/1000+windowSeconds

 };


 }catch{

 return {
 success:true,
 remaining:limit,
 reset:Date.now()/1000+windowSeconds
 }

 }

}


export default redis;