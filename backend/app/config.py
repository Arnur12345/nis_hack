import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres.txmvikhmxfcdwszxyitm:YOUR_PASSWORD@aws-0-eu-central-1.pooler.supabase.com:6543/postgres")
SECRET_KEY = os.getenv("SECRET_KEY", "hackathon-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days
