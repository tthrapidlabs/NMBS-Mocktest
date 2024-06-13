from flask import Flask,request,render_template,redirect

app = Flask(__name__)

@app.route("/")
def hello():
    """
        return hello World
    """
    return "Hello! Deployment is successfull ."
