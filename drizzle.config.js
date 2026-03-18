/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./utils/schema.js",
    dialect: 'postgresql',
    dbCredentials: {
      url: 'postgresql://neondb_owner:npg_f1crVSaWn3pb@ep-icy-sky-ahod5qyg-pooler.c-3.us-east-1.aws.neon.tech/skillsage?sslmode=require&channel_binding=require',
    }
  };