import shutil
import os
from datetime import datetime
from pathlib import Path

def backup_sqlite():
    """
    Simple backup script for SQLite database.
    """
    base_dir = Path(__file__).resolve().parent.parent
    db_path = base_dir / "db.sqlite3"
    
    if not db_path.exists():
        print(f"Database not found at {db_path}")
        return

    backup_dir = base_dir / "backups"
    backup_dir.mkdir(exist_ok=True)
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_path = backup_dir / f"backup_{timestamp}.sqlite3"
    
    shutil.copy2(db_path, backup_path)
    print(f"Backup created at {backup_path}")

    # Keep only last 10 backups
    backups = sorted(list(backup_dir.glob("backup_*.sqlite3")), key=os.path.getmtime)
    if len(backups) > 10:
        for old_backup in backups[:-10]:
            old_backup.unlink()
            print(f"Deleted old backup: {old_backup}")

if __name__ == "__main__":
    backup_sqlite()
