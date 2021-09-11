from . import DB
from sqlalchemy import func


class Chat(DB.Model):
    __tablename__ = "Chat"
    user_id = DB.Column(DB.Integer, primary_key=True, nullable=False)
    username = DB.Column(DB.String(10), nullable=False)
    message = DB.Column(DB.Text, nullable=False, unique=False)
    date = DB.Column(DB.DateTime(timezone=True), default=func.now())

    def __repr__(self):
        return f"{self.username}, {self.message}, {self.date}"
