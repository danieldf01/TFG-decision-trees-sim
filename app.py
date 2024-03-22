from urllib import request

from flask import Flask, redirect, url_for, render_template

app = Flask(__name__)

# @app.route('/')
# def home():  # put application's code here
#     return 'Hello <h1>World!<h1>'
#
# @app.route("/<name>")
# def user(name):
#     return f"Hello <h1>{name}<h1>"
#
# @app.route("/admin")
# def admin():
#     return redirect(url_for("home"))

@app.route('/', methods=['GET', 'POST'])
def index():
    return render_template('index.html')


if __name__ == '__main__':
    app.run()
