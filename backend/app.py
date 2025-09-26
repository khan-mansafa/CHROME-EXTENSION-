from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
from datetime import date
import hashlib

app = Flask(__name__)
CORS(app)  # Allow frontend requests

# PostgreSQL connection
conn = psycopg2.connect(
    host="localhost",
    database="productivity_db",
    user="postgres",
    password="xyz"  # <-- replace this with your PostgreSQL password
)
cur = conn.cursor()

# Password hashing utility
def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

# ----------------------------
# ROUTES
# ----------------------------

# Register
@app.route("/api/register", methods=["POST"])
def register():
    data = request.get_json()
    email = data.get("email")
    password = hash_password(data.get("password"))

    cur.execute("SELECT * FROM users WHERE email=%s", (email,))
    if cur.fetchone():
        return jsonify({"success": False, "message": "Email already exists"})

    cur.execute("INSERT INTO users (email, password) VALUES (%s, %s) RETURNING id", (email, password))
    user_id = cur.fetchone()[0]
    conn.commit()
    return jsonify({"success": True, "user": {"id": user_id, "email": email}})

# Login
@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = hash_password(data.get("password"))

    cur.execute("SELECT id, email FROM users WHERE email=%s AND password=%s", (email, password))
    user = cur.fetchone()
    if user:
        return jsonify({"success": True, "user": {"id": user[0], "email": user[1]}})
    else:
        return jsonify({"success": False, "message": "Invalid credentials"})

# Forgot password (dummy)
@app.route("/api/forgot-password", methods=["POST"])
def forgot_password():
    data = request.get_json()
    email = data.get("email")
    return jsonify({"message": f"If {email} exists, reset instructions sent."})

# Track website
@app.route("/api/track", methods=["POST"])
def track():
    data = request.get_json()
    user_id = data.get("user_id")
    website = data.get("website").lower()
    duration = data.get("duration")

    productive_keywords = [
        "github","News","Information", "History","wikipedia" ,"britannica","stackoverflow", "leetcode", "docs", "tutorial",
        "geeksforgeeks", "w3schools", "khanacademy", "coursera",
        "udemy", "edx", "medium", "python", "java", "react", "localhost", "github.com", "stackoverflow.com", "leetcode.com", "hackerrank.com",
    "codeforces.com", "geeksforgeeks.org", "w3schools.com", "khanacademy.org", "coursera.org",
    "udemy.com", "edx.org", "freecodecamp.org", "medium.com", "dev.to",
    "cs50.harvard.edu", "codepen.io", "codesandbox.io", "replit.com", "sololearn.com",
    "tutorialspoint.com", "python.org", "java.com", "reactjs.org", "vuejs.org",
    "angular.io", "nodejs.org", "expressjs.com", "django.com", "flask.palletsprojects.com",
    "mongodb.com", "postgresql.org", "mysql.com", "tensorflow.org", "pytorch.org",
    "kaggle.com", "openai.com", "chat.openai.com", "towardsdatascience.com", "analyticsvidhya.com",
    "hackaday.com", "digitalocean.com", "aws.amazon.com", "azure.microsoft.com", "cloud.google.com",
    "stackoverflow.blog", "thenewstack.io", "devblogs.microsoft.com", "linux.com", "ubuntu.com",
    "reddit.com/r/programming", "reddit.com/r/learnprogramming", "reddit.com/r/datascience",
    "reddit.com/r/machinelearning", "reddit.com/r/webdev", "reddit.com/r/javascript",
    "reddit.com/r/python", "reddit.com/r/java", "reddit.com/r/reactjs", "reddit.com/r/vuejs",
    "reddit.com/r/Angular2", "reddit.com/r/coding", "reddit.com/r/technology", "techcrunch.com",
    "wired.com", "arxiv.org", "spring.io", "hibernate.org", "flutter.dev",
    "dart.dev", "swift.org", "kotlinlang.org", "developer.apple.com", "developer.android.com",
    "programiz.com", "javapoint.com", "pythonforbeginners.com", "realpython.com", "fullstackopen.com",
    "projecteuler.net", "exercism.org", "codingame.com", "edabit.com", "codesignal.com",
    "pluralsight.com", "lynda.com", "skillshare.com", "tutsplus.com", "teamtreehouse.com",
    "codingdojo.com", "frontendmasters.com", "egghead.io", "scrimba.com", "makeuseof.com",
    "howtogeek.com", "tutorialedge.net", "tutorialsteacher.com", "programmersought.com", "javarevisited.blogspot.com",
    "datasciencemasters.com", "machinelearningmastery.com", "fast.ai", "deeplearning.ai", "huggingface.co",
    "towardsai.net", "analyticsindiamag.com", "dataquest.io", "learn.co", "codecademy.com"
    ]

    category = "productive" if any(kw in website for kw in productive_keywords) else "unproductive"

    cur.execute(
        "INSERT INTO website_tracking (user_id, website, category, duration, date) VALUES (%s, %s, %s, %s, %s)",
        (user_id, website, category, duration, date.today())
    )
    conn.commit()
    return jsonify({"success": True})


# Analytics (aggregate per day)
@app.route("/api/analytics/<int:user_id>", methods=["GET"])
def analytics(user_id):
    cur.execute("""
        SELECT date, category, SUM(duration) 
        FROM website_tracking 
        WHERE user_id=%s 
        GROUP BY date, category 
        ORDER BY date
    """, (user_id,))
    rows = cur.fetchall()

    result = []
    for r in rows:
        day = r[0].isoformat()
        category = r[1]
        duration = r[2]
        day_entry = next((item for item in result if item["day"] == day), None)
        if not day_entry:
            day_entry = {"day": day, "productive": 0, "unproductive": 0}
            result.append(day_entry)
        day_entry[category] = duration

    return jsonify(result)

# ----------------------------
# New Route: History
# ----------------------------
@app.route("/api/history/<int:user_id>", methods=["GET"])
def history(user_id):
    cur.execute("""
        SELECT website, category, duration, date
        FROM website_tracking
        WHERE user_id=%s
        ORDER BY date DESC, id DESC
    """, (user_id,))
    rows = cur.fetchall()

    result = [
        {"website": r[0], "category": r[1], "duration": r[2], "date": r[3].isoformat()}
        for r in rows
    ]
    return jsonify(result)

# ----------------------------
# Run server
# ----------------------------
if __name__ == "__main__":
    app.run(debug=True)

