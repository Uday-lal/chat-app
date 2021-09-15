from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField
from wtforms.validators import DataRequired, Length


class EnterForm(FlaskForm):
	username = StringField("Enter Name: ", validators=[DataRequired(), Length(max=10)])
	submit = SubmitField("Submit")
