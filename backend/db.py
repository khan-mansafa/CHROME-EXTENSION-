import psycopg2

conn = psycopg2.connect(
    host="localhost",
    database="productivity_db",
    user="postgres",
    password="yourpassword",
    port="5432"
)
