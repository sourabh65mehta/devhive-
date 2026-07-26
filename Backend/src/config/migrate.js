import pool from "./db.js";

const migrate = async ()=>{
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users(
            id        UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            username  VARCHAR(50) NOT NULL UNIQUE,
            email     VARCHAR(255) NOT NULL UNIQUE,
            password_hash  TEXT NOT NULL,
            created_at  TIMESTAMP DEFAULT NOW(),
            updated_at  TIMESTAMP DEFAULT NOW()
            )
            `);
            console.log('Users Table created ');

            await pool.query(`
                    CREATE TABLE IF NOT EXISTS refresh_tokens (
                    id       UUID DEFAULT gen_random_uuid() PRIMARY KEY, 
                    user_id  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                    token    TEXT  NOT NULL UNIQUE,
                    expires_at  TIMESTAMP NOT NULL,
                    created_at  TIMESTAMP DEFAULT NOW()
                    )
                `);
                console.log(`refresh_tokens table created`);


                await pool.query(`
                    CREATE TABLE IF NOT EXISTS questions(
                    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                    title VARCHAR(255) NOT NULL,
                    body TEXT NOT NULL,
                    image_url TEXT,
                    created_at TIMESTAMP DEFAULT NOW(),
                    updated_at TIMESTAMP DEFAULT NOW()
                    )
                `);
            await pool.query(`
                CREATE TABLE IF NOT EXISTS question_votes(
                question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
                user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                vote_type VARCHAR(10) NOT NULL CHECK (vote_type IN ('upvote', 'downvote')),
                PRIMARY KEY (question_id, user_id)
                )
            `);
            await pool.query(`
                CREATE TABLE IF NOT EXISTS tags(
                id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                name  VARCHAR(50) NOT NULL UNIQUE,
                created_at  TIMESTAMP DEFAULT NOW()
                )
                
                `)

            await pool.query(`
                 CREATE TABLE IF NOT EXISTS question_tags(
                 tags_id  UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
                 question_id  UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
                 PRIMARY  KEY (tags_id,question_id)
                 
                 
                 )
                
                
                
                `)
            
            await pool.query(`
                CREATE TABLE IF NOT EXISTS answers(
                id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE ,
                user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                body TEXT NOT NULL ,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
                
                
                )
                
                
                
                `)

            await pool.query(`ALTER TABLE answers ADD COLUMN IF NOT EXISTS image_url TEXT`);

            
                
                
                
             
                
            const result = await pool.query(`
                SELECT table_name
                FROM information_schema.tables
                WHERE table_schema = 'public'
                
                
                `);
                console.log('Tables in Database: ',result.rows);
                
            
    } catch (error) {
        console.error('Migration failed:', error.message)
    }
    finally{
        process.exit()
    }
}



migrate();