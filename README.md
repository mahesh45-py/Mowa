##

This Application is a trail version of chat functionality

## Flask Migrate for SQLite
Once you have set up Flask-Migrate, you can use the following commands to manage your database:

flask db init: Initializes the database and creates the migrations directory.
flask db migrate -m "message": Generates a new migration script with the given message.
flask db upgrade: Applies the latest migration to the database.
flask db downgrade: Rolls back the latest migration.
flask db history: Shows the history of applied migrations.