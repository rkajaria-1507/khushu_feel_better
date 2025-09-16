from pydrive2.auth import GoogleAuth
from pydrive2.drive import GoogleDrive
import json
import os

# Authenticate
gauth = GoogleAuth()
gauth.LocalWebserverAuth()  # Opens browser for login
drive = GoogleDrive(gauth)

# Replace with your Drive folder ID
FOLDER_ID = "19lubLkq9LBkPz5lfpu05obJmEq5B_1fl"

def list_files(folder_id, parent_path=""):
    """Recursively list all files in a Drive folder"""
    query = f"'{folder_id}' in parents and trashed=false"
    file_list = drive.ListFile({'q': query}).GetList()
    mapping = {}

    for f in file_list:
        if f['mimeType'] == 'application/vnd.google-apps.folder':
            # Recurse into subfolder
            subfolder_path = os.path.join(parent_path, f['title'])
            mapping.update(list_files(f['id'], subfolder_path))
        else:
            # File → direct download link
            file_path = os.path.join(parent_path, f['title']).replace("\\", "/")
            file_id = f['id']
            mapping[file_path] = f"https://drive.google.com/uc?export=download&id={file_id}"

    return mapping

# Run for your root folder
mapping = list_files(FOLDER_ID)

# Save to JSON
with open("drive_mapping.json", "w") as f:
    json.dump(mapping, f, indent=2)

print("✅ Mapping saved to drive_mapping.json")
