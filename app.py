from flask import Flask,request,render_template,redirect

app = Flask(__name__)

# Testing

@app.route("/")
def hello():
    """
        return hello World
    """
    return "Hello World! This is Flask."
