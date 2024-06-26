# start flask app
from main import app

if __name__ == '__main__':
    print("[INFO] Serving on port 5004")

    app.run(host='0.0.0.0', debug=True, port = 5004)