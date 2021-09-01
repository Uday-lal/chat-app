from flask import Blueprint, render_template, redirect, url_for, session
from .form import EnterForm

views = Blueprint("views", __name__)


@views.route("/", methods=["GET", "POST"])
def home():
	enter_form = EnterForm()
	if enter_form.validate_on_submit():
		username = enter_form.username.data
		session["username"] = username
		return redirect(url_for("views.chat"))
	return render_template("index.html", enter_form=enter_form)


@views.route("/chat")
def chat():
	return "Chat page"
