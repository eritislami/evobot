import json
import requests
import time

# Laden Sie den Token aus der config.json Datei
with open('config.json') as config_file:
    config = json.load(config_file)

TOKEN = config['TOKEN']
APPLICATION_ID = '1183825246621548605'  # Ersetzen Sie dies durch Ihre Anwendungs-ID

# Discord API URL für Anwendungsbefehle
url = f"https://discord.com/api/v9/applications/{APPLICATION_ID}/commands"

# HTTP-Header für die Anfrage
headers = {
    "Authorization": f"Bot {TOKEN}"
}

# Holen Sie alle vorhandenen Befehle
response = requests.get(url, headers=headers)
commands = response.json()

# Löschen Sie alle Befehle
for command in commands:
    delete_url = f"{url}/{command['id']}"
    delete_response = requests.delete(delete_url, headers=headers)
    if delete_response.status_code == 204:
        print(f"Deleted command {command['name']}")
    else:
        print(f"Failed to delete command {command['name']}: {delete_response.status_code}")
    
    # Pause, um Rate-Limits einzuhalten
    time.sleep(1)

print("All commands have been cleared.")