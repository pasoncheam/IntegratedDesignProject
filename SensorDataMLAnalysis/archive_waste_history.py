import json
import os
import sys

def archive_history():
    # Paths (relative to where script is run, usually root of repo in CI)
    PHOTOS_JSON_PATH = os.path.join("public", "detected_waste_photos", "photos.json")
    HISTORY_JSON_PATH = os.path.join("public", "detected_waste_photos", "waste_history.json")

    print(f"Checking for new photos in {PHOTOS_JSON_PATH}...")

    # 1. Load current limited photos
    if not os.path.exists(PHOTOS_JSON_PATH):
        print(f"No photos.json found at {PHOTOS_JSON_PATH}. Exiting.")
        return

    try:
        with open(PHOTOS_JSON_PATH, "r") as f:
            current_photos = json.load(f)
    except json.JSONDecodeError:
        print("Error decoding photos.json. Exiting.")
        return

    # 2. Load existing history or initialize
    if os.path.exists(HISTORY_JSON_PATH):
        try:
            with open(HISTORY_JSON_PATH, "r") as f:
                history_photos = json.load(f)
        except json.JSONDecodeError:
            print("Error decoding waste_history.json. Starting fresh.")
            history_photos = []
    else:
        print("No history file found. Creating new one.")
        history_photos = []

    # 3. Merge process
    # Create a set of existing IDs for fast lookup
    existing_ids = set(photo["id"] for photo in history_photos)
    
    new_count = 0
    for photo in current_photos:
        if photo["id"] not in existing_ids:
            history_photos.append(photo)
            existing_ids.add(photo["id"])
            new_count += 1
            print(f"Archived new photo: {photo['id']} ({photo['date']} {photo['time']})")

    # 4. Save history if changes made
    if new_count > 0:
        # Sort by date/time newly (optional but good for consistency)
        # Using simple string comparison for date+time which works for ISO-like formats
        history_photos.sort(key=lambda x: x["date"] + x["time"], reverse=True)

        # Safety Limit: Keep only the recent 5000 entries to prevent performance issues
        if len(history_photos) > 5000:
            print(f"History limit exceeded ({len(history_photos)}). Trimming to recent 5000.")
            history_photos = history_photos[:5000]

        with open(HISTORY_JSON_PATH, "w") as f:
            json.dump(history_photos, f, indent=2)
        print(f"Successfully added {new_count} new photos to history. Total archived: {len(history_photos)}")
    else:
        print("No new photos to archive.")

if __name__ == "__main__":
    archive_history()
